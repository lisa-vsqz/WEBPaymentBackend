const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER, // Primary Key
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true, // Puede ser opcional
  },
  role: {
    type: DataTypes.ENUM('admin', 'client'),
    defaultValue: 'client',
  },
}, {
  timestamps: false, // Adds createdAt and updatedAt fields
});

module.exports = User;
