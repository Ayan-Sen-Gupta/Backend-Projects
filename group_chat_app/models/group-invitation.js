const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');


const GroupInvitation  = sequelize.define('group-invitation', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    requestActive: Sequelize.BOOLEAN,
    expiresBy: Sequelize.DATE
    
});

module.exports = GroupInvitation;