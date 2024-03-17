const express = require('express');

const chatController = require('../controllers/chat');
const userAuthentication = require('../middlewares/authentication');
const upload = require('../utilities/multer');

const router = express.Router();

router.get('/get-message/:groupId', userAuthentication.authenticate, chatController.getMessage);

router.get('/open-group/:groupId', userAuthentication.authenticate, chatController.getMessage);

router.post('/send-file/:groupId' ,userAuthentication.authenticate, upload.single('file'), chatController.sendFile);

module.exports = router;