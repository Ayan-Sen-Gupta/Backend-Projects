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
      type: Sequelize.STRING(25),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
    },
      
    },
    createdBy: {
        type: Sequelize.STRING, 
        allowNull: false,  
      }

});

module.exports = Group; 
