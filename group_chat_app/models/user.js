const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');

const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      
    },
    email: {
       type: Sequelize.STRING, 
       allowNull: false, 
       unique: true
       
    },
    contact: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    
    },
    password: {
        type: Sequelize.CHAR, 
        allowNull: false,
      
      },

});

module.exports = User; 
