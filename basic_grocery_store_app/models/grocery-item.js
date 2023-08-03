const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');

const GroceryItem = sequelize.define('groceryItem', {
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
    description: {
       type: Sequelize.STRING, 
       allowNull: false, 
       
    },
    price: {
        type: Sequelize.DOUBLE, 
        allowNull: false,
      
      },
    quantity: {
       type: Sequelize.DOUBLE,
       allowNull: false,
    
    },

});

module.exports = GroceryItem; 
