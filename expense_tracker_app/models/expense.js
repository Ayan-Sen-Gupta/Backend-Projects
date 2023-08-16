const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');

const Expense = sequelize.define('expense', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    itemName: {
      type: Sequelize.STRING,
      allowNull: false,
      
    },
    expenseAmount: {
       type: Sequelize.DOUBLE, 
       allowNull: false, 
     
    },
    description: {
        type: Sequelize.STRING,   
      },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },

});

module.exports = Expense; 
