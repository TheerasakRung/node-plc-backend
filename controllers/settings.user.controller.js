'use strict';

const service = require('../services/settings.user.service');

function getCompanyId(req, res) {
  const company_id = req.user.company_id;
  if (!company_id) {
    res.status(400).json({ success: false, message: 'Your account is not assigned to a company. Please contact system administrator.' });
    return null;
  }
  return company_id;
}

exports.listUsers = async (req, res) => {
  try {
    const company_id = getCompanyId(req, res);
    if (!company_id) return;
    const users = await service.listAll(company_id);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const company_id = getCompanyId(req, res);
    if (!company_id) return;
    const user = await service.create(req.body, req.user.id, company_id);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ success: false, message: err.errors.map(e => e.message).join(', ') });
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const company_id = getCompanyId(req, res);
    if (!company_id) return;
    const user = await service.update(req.params.id, req.body, company_id);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const company_id = getCompanyId(req, res);
    if (!company_id) return;
    await service.delete(req.params.id, company_id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};
