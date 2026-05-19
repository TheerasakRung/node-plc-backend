'use strict';

const repo = require('../repositories/settings.company.repo');

exports.listAll = () => {
  return repo.findAll();
};

exports.create = async (data) => {
  const existing = await repo.findByName(data.name);
  if (existing) {
    const err = new Error('Company name already in use');
    err.status = 409;
    throw err;
  }
  return repo.create(data);
};

exports.update = async (id, data) => {
  const company = await repo.findById(id);
  if (!company) {
    const err = new Error('Company not found');
    err.status = 404;
    throw err;
  }
  if (data.name && data.name !== company.name) {
    const existing = await repo.findByName(data.name);
    if (existing) {
      const err = new Error('Company name already in use');
      err.status = 409;
      throw err;
    }
  }
  await repo.update(id, data);
  return repo.findById(id);
};

exports.delete = async (id) => {
  const company = await repo.findById(id);
  if (!company) {
    const err = new Error('Company not found');
    err.status = 404;
    throw err;
  }
  const userCount = await repo.countUsers(id);
  if (userCount > 0) {
    const err = new Error(`Cannot delete: ${userCount} user(s) are assigned to this company`);
    err.status = 409;
    throw err;
  }
  await repo.delete(id);
};
