const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');

const Chat = sequelize.define('chat', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
      
    },
    message: {
        type: Sequelize.STRING,   
      }

});

module.exports = Chat; 
