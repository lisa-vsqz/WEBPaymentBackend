const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Provider = sequelize.define('Provider', {
  ProviderID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ProviderName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PhoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
});

module.exports = Provider;
