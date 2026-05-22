'use strict';

const { Role } = require('../models');

// cache role permissions in memory — TTL 5 นาที
const roleCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

async function getRolePermissions(role_id) {
  const cached = roleCache.get(role_id);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data;
  }
  const role = await Role.findByPk(role_id, {
    attributes: ['id', 'tab_permissions', 'scope_permissions']
  });
  if (!role) return null;
  const data = {
    tab_permissions: role.tab_permissions || {},
    scope_permissions: role.scope_permissions || {}
  };
  roleCache.set(role_id, { data, ts: Date.now() });
  return data;
}

// ใช้ invalidate cache เมื่อ role ถูกแก้ไข
exports.invalidateRoleCache = (role_id) => {
  roleCache.delete(role_id);
};

// checkTab('dashboard') — ตรวจว่า user มีสิทธิ์เข้า tab นั้น
exports.checkTab = (tabName) => {
  return async (req, res, next) => {
    try {
      const { role, role_id } = req.user;

      // super_admin ผ่านทุก tab เสมอ
      if (role === 'super_admin') return next();

      if (!role_id) {
        return res.status(403).json({ success: false, message: `Access denied: no role assigned` });
      }

      const permissions = await getRolePermissions(role_id);
      if (!permissions) {
        return res.status(403).json({ success: false, message: 'Role not found' });
      }

      if (!permissions.tab_permissions[tabName]) {
        return res.status(403).json({ success: false, message: `Access denied: tab "${tabName}" is not visible for your role` });
      }

      next();
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
};

// checkScope('edit') — ตรวจว่า user มีสิทธิ์ action นั้น
exports.checkScope = (scopeName) => {
  return async (req, res, next) => {
    try {
      const { role, role_id } = req.user;

      // super_admin ผ่านทุก scope เสมอ
      if (role === 'super_admin') return next();

      if (!role_id) {
        return res.status(403).json({ success: false, message: `Access denied: no role assigned` });
      }

      const permissions = await getRolePermissions(role_id);
      if (!permissions) {
        return res.status(403).json({ success: false, message: 'Role not found' });
      }

      if (!permissions.scope_permissions[scopeName]) {
        return res.status(403).json({ success: false, message: `Access denied: scope "${scopeName}" not permitted for your role` });
      }

      next();
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
};
