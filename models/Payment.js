const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const BankAccount = require("./BankAccount");
const Provider = require("./Provider");
const Invoice = require("./Invoice");

const Payment = sequelize.define(
  "Payment",
  {
    PaymentID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    BankAccountID: {
      type: DataTypes.INTEGER,
      references: {
        model: BankAccount,
        key: "BankAccountID",
      },
      allowNull: false,
    },
    PaymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    AmountPaid: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    ProviderID: {
      type: DataTypes.INTEGER,
      references: {
        model: Provider,
        key: "ProviderID",
      },
      allowNull: false,
    },
    InvoiceID: {
      type: DataTypes.INTEGER,
      references: {
        model: Invoice,
        key: "InvoiceID",
      },
      allowNull: false,
    },
    PaymentNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Payment;
