const express = require('express');

const groupInvitationController = require('../controllers/group-invitation');


const router = express.Router();


router.post('/invite-member/:groupId', groupInvitationController.inviteMember);

router.get('/join-group/:groupId/:id',  groupInvitationController.joinGroup);

router.post('/join-member/:groupId', groupInvitationController.joinMember);

module.exports = router;