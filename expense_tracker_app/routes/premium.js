const path = require('path');

const express = require('express');

const premiumController = require('../controllers/premium');
const userAuthentication = require('../middlewares/authentication');

const router = express.Router();

router.get('/buy-premium', userAuthentication.authenticate, premiumController.buyPremium);

router.post('/transaction', userAuthentication.authenticate, premiumController.onTransaction);

router.get('/leaderboard', userAuthentication.authenticate, premiumController.getLeaderBoard);

module.exports = router;