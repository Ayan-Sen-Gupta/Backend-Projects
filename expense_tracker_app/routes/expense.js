
const express = require('express');

const expenseController = require('../controllers/expense');
const userAuthentication = require('../middlewares/authentication');

const router = express.Router();


router.get('/get-expense', userAuthentication.authenticate, expenseController.getExpense);

router.post('/add-expense', userAuthentication.authenticate, expenseController.addExpense);

router.delete('/delete-expense/:expenseId', userAuthentication.authenticate, expenseController.deleteExpense);

module.exports = router;