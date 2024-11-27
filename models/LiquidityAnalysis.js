const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LiquidityAnalysis = sequelize.define(
  "LiquidityAnalysis",
  {
    LiquidityID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    AnalysisDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    BankBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    PendingPayments: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    LiquidityStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SuggestedPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,

    tableName: "LiquidityAnalysis", // Especifica el nombre exacto de la tabla
    freezeTableName: true, // Esto desactiva la pluralización
  }
);

module.exports = LiquidityAnalysis;
