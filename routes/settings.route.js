'use strict';

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const companyCtrl = require('../controllers/settings.company.controller');
const roleCtrl = require('../controllers/settings.role.controller');
const userCtrl = require('../controllers/settings.user.controller');

// Companies — require login only (ไม่ต้องมี company_id เพื่อ setup ครั้งแรก)
router.get('/companies', authMiddleware.authenticate, authMiddleware.authorizeRoles('super_admin'), companyCtrl.listCompanies);
router.post('/companies', authMiddleware.authenticate, authMiddleware.authorizeRoles('super_admin'), companyCtrl.createCompany);
router.put('/companies/:id', authMiddleware.authenticate, authMiddleware.authorizeRoles('super_admin'), companyCtrl.updateCompany);
router.delete('/companies/:id', authMiddleware.authenticate, authMiddleware.authorizeRoles('super_admin'), companyCtrl.deleteCompany);

// Roles & Users — require super_admin + must have company_id
router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorizeRoles('super_admin'));

// Roles
router.get('/roles', roleCtrl.listRoles);
router.get('/roles/:id', roleCtrl.getRoleById);
router.post('/roles', roleCtrl.createRole);
router.put('/roles/:id', roleCtrl.updateRole);
router.delete('/roles/:id', roleCtrl.deleteRole);

// Users
router.get('/users', userCtrl.listUsers);
router.post('/users', userCtrl.createUser);
router.put('/users/:id', userCtrl.updateUser);
router.delete('/users/:id', userCtrl.deleteUser);
router.patch('/users/:id/toggle-active', userCtrl.toggleActive);
router.patch('/users/:id/reset-password', userCtrl.resetPassword);

module.exports = router;
