const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');

const UserGroup = sequelize.define('user-group', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

});

module.exports = UserGroup; 
