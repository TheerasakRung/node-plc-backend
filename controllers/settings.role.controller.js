'use strict';

const service = require('../services/settings.role.service');
const { invalidateRoleCache } = require('../middleware/permission.middleware');

function getCompanyId(req, res) {
  const company_id = req.user.company_id;
  if (!company_id) {
    res.status(400).json({ success: false, message: 'Your account is not assigned to a company. Please contact system administrator.' });
    return null;
  }
  return company_id;
}

exports.listRoles = async (req, res) => {
  try {
    const company_id = getCompanyId(req, res);
    if (!company_id) return;
    const roles = await service.listAll(company_id);
    res.json({ success: true, data: roles });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const company_id = getCompanyId(req, res);
    if (!company_id) return;
    const role = await service.findById(req.params.id, company_id);
    res.json({ success: true, data: role });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const company_id = getCompanyId(req, res);
    if (!company_id) return;
    const { name, tab_permissions, scope_permissions } = req.body;
    const role = await service.create({ name, tab_permissions, scope_permissions }, company_id);
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const company_id = getCompanyId(req, res);
    if (!company_id) return;
    const { name, tab_permissions, scope_permissions, is_active } = req.body;
    const role = await service.update(req.params.id, { name, tab_permissions, scope_permissions, is_active }, company_id);
    invalidateRoleCache(Number(req.params.id));
    res.json({ success: true, data: role });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const company_id = getCompanyId(req, res);
    if (!company_id) return;
    await service.delete(req.params.id, company_id);
    invalidateRoleCache(Number(req.params.id));
    res.json({ success: true, message: 'Role deleted' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};
