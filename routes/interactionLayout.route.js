const express = require('express');
const router = express.Router();
const controller = require('../controllers/interactionLayout.controller');
const perm = require('../middleware/permission.middleware');

router.get('/layouts',      controller.getAllLayouts);
router.get('/layouts/:id',  controller.getLayoutById);
router.post('/layouts',     perm.checkScope('edit'), controller.createLayout);
router.post('/elements',    perm.checkScope('edit'), controller.createElement);

module.exports = router;
