const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Provider = require('./Provider');

const ProviderHistory = sequelize.define('ProviderHistory', {
  ProviderHistoryID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ProviderID: {
    type: DataTypes.INTEGER,
    references: {
      model: Provider,
      key: 'ProviderID',
    },
    allowNull: false,
  },
  TotalPaid: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  PaymentsCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'ProviderHistory', // Especifica el nombre exacto de la tabla
  freezeTableName: true, // Esto desactiva la pluralización
});

module.exports = ProviderHistory;
