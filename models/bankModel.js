const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db')


const Bank = sequelize.define('bank',
{


    bank_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },

    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    bank_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    bank_account_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    account_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
//ali is annoyed of bar
})
Bank.removeAttribute(['id'])
module.exports = Bank