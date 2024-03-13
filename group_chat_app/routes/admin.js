const express = require('express');

const adminController = require('../controllers/admin');
const userAuthentication = require('../middlewares/authentication');

const router = express.Router();


router.post('/make-admin/:groupId', userAuthentication.authenticate, adminController.makeAdmin);

router.post('/add-user/:groupId', userAuthentication.authenticate, adminController.addUser);

router.post('/remove-user/:groupId', userAuthentication.authenticate, adminController.removeUser);


module.exports = router;