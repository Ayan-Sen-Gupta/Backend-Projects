const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');

const ArchivedChat = sequelize.define('archived-chat', {
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
        allowNull: false,  
      },

    type: {
        type: Sequelize.STRING, 
        allowNull: false, 
        defaultValue: "text" 
      }

});

module.exports = ArchivedChat; 
