const express = require('express');

const groupController = require('../controllers/group');
const userAuthentication = require('../middlewares/authentication');

const router = express.Router();

router.get('/get-groups', userAuthentication.authenticate, groupController.getGroups);

router.post('/create-group', userAuthentication.authenticate, groupController.createGroup);

router.post('/add-groupowner', userAuthentication.authenticate, groupController.addGroupOwner);

module.exports = router;