const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');


const PasswordRequest  = sequelize.define('password-request', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    requestActive: Sequelize.BOOLEAN,
    expiresBy: Sequelize.DATE
    
})

module.exports = PasswordRequest;