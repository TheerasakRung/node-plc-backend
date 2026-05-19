'use strict';

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const companyCtrl = require('../controllers/settings.company.controller');
const roleCtrl = require('../controllers/settings.role.controller');
const userCtrl = require('../controllers/settings.user.controller');

router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorizeRoles('super_admin'));

// Companies
router.get('/companies', companyCtrl.listCompanies);
router.post('/companies', companyCtrl.createCompany);
router.put('/companies/:id', companyCtrl.updateCompany);
router.delete('/companies/:id', companyCtrl.deleteCompany);

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

module.exports = router;
