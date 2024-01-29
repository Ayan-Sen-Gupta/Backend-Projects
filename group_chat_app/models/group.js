const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');

const Group = sequelize.define('group', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    groupName: {
      type: Sequelize.STRING,
      allowNull: false,
      
    },
    createdBy: {
        type: Sequelize.STRING, 
        allowNull: false,  
      }

});

module.exports = Group; 
