const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Provider = require("./Provider"); // Importar para la relación

const Invoice = sequelize.define(
  "Invoice",
  {
    InvoiceID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ProviderID: {
      type: DataTypes.INTEGER,
      references: {
        model: Provider,
        key: "ProviderID",
      },
      allowNull: false,
    },
    InvoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    TotalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    AmountPaid: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    AmountDue: {
      type: DataTypes.VIRTUAL, // Virtual column
      get() {
        return this.TotalAmount - this.AmountPaid;
      },
    },
    PaymentStatus: {
      type: DataTypes.STRING,
      defaultValue: "Unpaid",
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Invoice;
