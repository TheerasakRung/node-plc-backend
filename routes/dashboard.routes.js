const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');
const perm = require('../middleware/permission.middleware');

router.get('/cards', controller.getCards);
router.post('/cards',        perm.checkScope('edit'), controller.createCard);
router.put('/cards/:id',     perm.checkScope('edit'), controller.updateCard);
router.delete('/cards/:id',  perm.checkScope('edit'), controller.deleteCard);

module.exports = router;
