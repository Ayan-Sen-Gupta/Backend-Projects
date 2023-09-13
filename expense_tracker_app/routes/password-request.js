
const express = require('express');

const passwordController = require('../controllers/password-request');


const router = express.Router();


router.post('/forgot-password',  passwordController.forgotPassword);

router.get('/reset-password/:id', passwordController.resetPassword);

router.post('/update-password/:id', passwordController.updatePassword);

module.exports = router;