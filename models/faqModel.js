const{DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Faq = sequelize.define('faqs',{
  sn:{
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  faq_id:{
    type: DataTypes.UUID,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  userId:{
    type: DataTypes.UUID,
    allowNull: false
  },
  faq_title:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  faq_body:{
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

module.exports = Faq;
