const express = require('express');
const router = express.Router();
const controller = require('../controllers/plc.controller');
const perm = require('../middleware/permission.middleware');

router.get('/status', controller.status);
router.get('/read',   controller.read);
router.post('/write', perm.checkScope('control'), controller.write);

module.exports = router;