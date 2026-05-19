'use strict';

const repo = require('../repositories/settings.role.repo');

const TAB_KEYS = ['dashboard', 'oee', 'products', 'devices', 'rooms', 'reports', 'settings'];
const SCOPE_KEYS = ['view', 'edit', 'export'];

function validateTabPermissions(tab_permissions) {
  for (const key of TAB_KEYS) {
    if (typeof tab_permissions[key] !== 'boolean') {
      const err = new Error(`tab_permissions.${key} must be a boolean`);
      err.status = 400;
      throw err;
    }
  }
}

function validateScopePermissions(scope_permissions) {
  for (const key of SCOPE_KEYS) {
    if (typeof scope_permissions[key] !== 'boolean') {
      const err = new Error(`scope_permissions.${key} must be a boolean`);
      err.status = 400;
      throw err;
    }
  }
}

exports.listAll = (company_id) => {
  return repo.findAll(company_id);
};

exports.findById = async (id, company_id) => {
  const role = await repo.findById(id);
  if (!role) {
    const err = new Error('Role not found');
    err.status = 404;
    throw err;
  }
  if (role.company_id !== company_id) {
    const err = new Error('Role not found');
    err.status = 404;
    throw err;
  }
  return role;
};

exports.create = async ({ name, tab_permissions, scope_permissions }, company_id) => {
  if (!name) {
    const err = new Error('name is required');
    err.status = 400;
    throw err;
  }
  if (!tab_permissions || !scope_permissions) {
    const err = new Error('tab_permissions and scope_permissions are required');
    err.status = 400;
    throw err;
  }
  validateTabPermissions(tab_permissions);
  validateScopePermissions(scope_permissions);

  const existing = await repo.findByName(name, company_id);
  if (existing) {
    const err = new Error('Role name already in use');
    err.status = 409;
    throw err;
  }
  return repo.create({ name, tab_permissions, scope_permissions, company_id });
};

exports.update = async (id, { name, tab_permissions, scope_permissions, is_active }, company_id) => {
  const role = await exports.findById(id, company_id);

  if (name && name !== role.name) {
    const existing = await repo.findByName(name, company_id);
    if (existing) {
      const err = new Error('Role name already in use');
      err.status = 409;
      throw err;
    }
  }
  if (tab_permissions) validateTabPermissions(tab_permissions);
  if (scope_permissions) validateScopePermissions(scope_permissions);

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (tab_permissions !== undefined) updateData.tab_permissions = tab_permissions;
  if (scope_permissions !== undefined) updateData.scope_permissions = scope_permissions;
  if (is_active !== undefined) updateData.is_active = is_active;

  await repo.update(id, updateData);
  return repo.findById(id);
};

exports.delete = async (id, company_id) => {
  await exports.findById(id, company_id);

  const userCount = await repo.countUsers(id);
  if (userCount > 0) {
    const err = new Error(`Cannot delete: ${userCount} user(s) are assigned to this role`);
    err.status = 409;
    throw err;
  }
  await repo.delete(id);
};
