'use strict';

const bcrypt = require('bcryptjs');
const { User, UserRoom } = require('../models');
const userRepo = require('../repositories/settings.user.repo');
const roleRepo = require('../repositories/settings.role.repo');
const companyRepo = require('../repositories/settings.company.repo');
const baseUserService = require('./user.service');

const allowedScopes = ['view', 'control', 'manage'];

exports.listAll = (company_id) => {
  return userRepo.findAll(company_id);
};

exports.create = async (body, createdBy, company_id) => {
  const { email, password, role = 'operator', role_id, employee_id, is_active, rooms } = body;

  if (!email || !password) {
    const err = new Error('email and password are required');
    err.status = 400;
    throw err;
  }
  if (rooms && Array.isArray(rooms)) {
    for (const room of rooms) {
      if (room.scope && !allowedScopes.includes(room.scope)) {
        const err = new Error(`scope must be one of: ${allowedScopes.join(', ')}`);
        err.status = 400;
        throw err;
      }
    }
  }
  if (role_id) {
    const roleRecord = await roleRepo.findById(role_id);
    if (!roleRecord || roleRecord.company_id !== company_id) {
      const err = new Error('role_id not found');
      err.status = 400;
      throw err;
    }
  }

  const existing = await baseUserService.findByEmail(email);
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const userData = {
    email,
    password_hash,
    role,
    role_id: role_id || null,
    company_id,
    employee_id: employee_id || null,
    is_active: typeof is_active === 'boolean' ? is_active : true,
    created_by: createdBy || null
  };

  const roomAssignments = Array.isArray(rooms) ? rooms : [];
  const user = await createWithRoomAssignment(userData, roomAssignments);
  return userRepo.findById(user.id);
};

async function createWithRoomAssignment(userData, roomAssignments) {
  const transaction = await User.sequelize.transaction();
  try {
    const user = await User.create(userData, { transaction });
    if (roomAssignments.length > 0) {
      const roomData = roomAssignments.map(r => ({
        user_id: user.id,
        room_id: r.room_id,
        scope: r.scope || 'view',
        assigned_by: userData.created_by || null
      }));
      await UserRoom.bulkCreate(roomData, { transaction });
    }
    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

exports.update = async (id, data, company_id) => {
  const user = await userRepo.findById(id);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  if (user.company_id !== company_id) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  if (data.role_id) {
    const roleRecord = await roleRepo.findById(data.role_id);
    if (!roleRecord || roleRecord.company_id !== company_id) {
      const err = new Error('role_id not found');
      err.status = 400;
      throw err;
    }
  }
  if (data.rooms && Array.isArray(data.rooms)) {
    for (const room of data.rooms) {
      if (room.scope && !allowedScopes.includes(room.scope)) {
        const err = new Error(`scope must be one of: ${allowedScopes.join(', ')}`);
        err.status = 400;
        throw err;
      }
    }
  }

  const allowed = ['role_id', 'is_active', 'role', 'employee_id'];
  const updateData = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  const transaction = await User.sequelize.transaction();
  try {
    if (Object.keys(updateData).length > 0) {
      await userRepo.update(id, updateData, transaction);
    }
    if (data.rooms !== undefined) {
      await UserRoom.destroy({ where: { user_id: id }, transaction });
      if (data.rooms.length > 0) {
        const roomData = data.rooms.map(r => ({
          user_id: id,
          room_id: r.room_id,
          scope: r.scope || 'view',
          assigned_by: null
        }));
        await UserRoom.bulkCreate(roomData, { transaction });
      }
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  return userRepo.findById(id);
};

exports.delete = async (id, company_id) => {
  const user = await userRepo.findById(id);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  if (user.company_id !== company_id) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  await userRepo.delete(id);
};

exports.toggleActive = async (id, company_id) => {
  const user = await userRepo.findById(id);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  if (user.company_id !== company_id) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  await userRepo.update(id, { is_active: !user.is_active });
  return userRepo.findById(id);
};

exports.resetPassword = async (id, newPassword, company_id) => {
  const user = await userRepo.findById(id);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  if (user.company_id !== company_id) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  if (!newPassword || newPassword.length < 6) {
    const err = new Error('password must be at least 6 characters');
    err.status = 400;
    throw err;
  }
  const password_hash = await bcrypt.hash(newPassword, 10);
  await userRepo.update(id, { password_hash });
};
