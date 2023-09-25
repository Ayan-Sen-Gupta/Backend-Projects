const Expense = require('../models/expense');

const getExpenses = (req,where) => {
    return req.user.getExpenses(where);
 }

 module.exports = {
    getExpenses
  }