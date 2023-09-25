const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');


const ExpenseFile  = sequelize.define('expense-file', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
    fileUrl: Sequelize.STRING
    
})

module.exports = ExpenseFile;