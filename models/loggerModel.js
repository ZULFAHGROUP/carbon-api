const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const loggerModel = sequelize.define("log", {
  log_id: {
    type: DataTypes.UUID,
    allowNull: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = loggerModel;
