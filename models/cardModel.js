const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const card = sequelize.define("cards", {
  card_id: {
    type: DataTypes.UUID,
    allowNull: false,
    //primaryKey: true
  },
  authorization_code: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  last_name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    //unique: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    //unique: true
  },
  account_name: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  last4: {
    type: DataTypes.STRING(4),
    allowNull: true,
  },
  exp_month: {
    type: DataTypes.STRING(4),
    allowNull: true,
  },
  exp_year: {
    type: DataTypes.STRING(4),
    allowNull: true,
  },
  card_type: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  bank: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
});

module.exports = card;
