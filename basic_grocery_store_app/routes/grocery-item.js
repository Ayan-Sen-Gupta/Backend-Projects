const path = require('path');

const express = require('express');

const itemController = require('../controllers/grocery-item');

const router = express.Router();

router.get('/', itemController.getForm);

router.post('/', itemController.postForm);

router.put('/buy/:itemId', itemController.buy);

router.delete('/delete-item/:itemId', itemController.deleteItem);

module.exports = router;