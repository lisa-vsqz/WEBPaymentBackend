const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BankAccount = sequelize.define('BankAccount', {
  BankAccountID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  AccountName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  InstitutionNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  BranchNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AccountNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: false,
});

module.exports = BankAccount;
