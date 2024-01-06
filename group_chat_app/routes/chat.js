const express = require('express');

const chatController = require('../controllers/chat');
const userAuthentication = require('../middlewares/authentication');

const router = express.Router();


router.post('/send-message', userAuthentication.authenticate, chatController.sendMessage);



module.exports = router;