const express = require('express');

const chatController = require('../controllers/chat');
const userAuthentication = require('../middlewares/authentication');

const router = express.Router();

router.get('/get-message/:groupId', userAuthentication.authenticate, chatController.getMessage);

router.post('/send-message/:groupId', userAuthentication.authenticate, chatController.sendMessage);

router.get('/open-group/:groupId', userAuthentication.authenticate, chatController.getMessage);

module.exports = router;