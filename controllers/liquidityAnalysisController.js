const LiquidityAnalysis = require("../models/LiquidityAnalysis");
const BankAccount = require("../models/BankAccount");
const Invoice = require("../models/Invoice");
const liquidityService = require("../services/liquidityService");
const sequelize = require("../config/database");
const { Op } = require("sequelize"); // Import Op for Sequelize operators

exports.getLiquidityStatus = async (req, res) => {
  let transaction;
  try {
    // Start a transaction
    transaction = await sequelize.transaction();
    console.log("Transaction started:", transaction.id);

    // Retrieve all bank accounts
    const bankAccounts = await BankAccount.findAll({ transaction });

    // Retrieve all invoices (excluding those with "Paid" status)
    const invoices = await Invoice.findAll({
      where: { PaymentStatus: { [Op.ne]: "Paid" } },
      transaction,
    });

    // Use the liquidity service to calculate liquidity
    const { totalBalance, totalPendingPayments, liquidityStatus } =
      liquidityService.calculateLiquidity(bankAccounts, invoices);

    // Determine the closest due date using sequelize.query
    const suggestedPaymentDateQuery = await sequelize.query(
      `SELECT TOP 1 CONVERT(VARCHAR, DueDate, 23) AS DueDate
       FROM Invoices 
       WHERE PaymentStatus != 'Paid'
       ORDER BY DueDate ASC`,
      { type: sequelize.QueryTypes.SELECT, transaction }
    );
    const closestDueDate =
      suggestedPaymentDateQuery.length > 0
        ? suggestedPaymentDateQuery[0].DueDate
        : null;

    // Insert the liquidity analysis record into the database
    const analysisDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    await sequelize.query(
      `INSERT INTO LiquidityAnalysis 
       (AnalysisDate, BankBalance, PendingPayments, LiquidityStatus, SuggestedPaymentDate, CreatedAt) 
       VALUES (:AnalysisDate, :BankBalance, :PendingPayments, :LiquidityStatus, :SuggestedPaymentDate, :CreatedAt)`,
      {
        replacements: {
          AnalysisDate: analysisDate,
          BankBalance: totalBalance,
          PendingPayments: totalPendingPayments,
          LiquidityStatus: liquidityStatus,
          SuggestedPaymentDate: closestDueDate,
          CreatedAt: createdAt,
        },
        transaction,
      }
    );

    console.log("LiquidityAnalysis record created successfully.");

    // Commit the transaction
    await transaction.commit();
    console.log("Transaction committed successfully.");

    // Respond with the liquidity analysis result
    res.status(200).json({
      AnalysisDate: analysisDate,
      BankBalance: totalBalance,
      PendingPayments: totalPendingPayments,
      LiquidityStatus: liquidityStatus,
      SuggestedPaymentDate: closestDueDate,
    });
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
        console.log("Transaction rolled back successfully.");
      } catch (rollbackError) {
        console.error("Rollback transaction failed:", rollbackError.message);
      }
    }

    console.error("Error in getLiquidityStatus:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.createLiquidityAnalysis = async (req, res) => {
  try {
    const liquidityAnalysis = await LiquidityAnalysis.create(req.body);
    res.status(201).json(liquidityAnalysis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLiquidityAnalyses = async (req, res) => {
  try {
    const liquidityAnalyses = await LiquidityAnalysis.findAll();
    res.status(200).json(liquidityAnalyses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLiquidityAnalysis = async (req, res) => {
  try {
    const liquidityAnalysis = await LiquidityAnalysis.findByPk(req.params.id);
    res.status(200).json(liquidityAnalysis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLiquidityAnalysis = async (req, res) => {
  try {
    await LiquidityAnalysis.update(req.body, {
      where: { LiquidityID: req.params.id },
    });
    res
      .status(200)
      .json({ message: "Liquidity analysis updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteLiquidityAnalysis = async (req, res) => {
  try {
    await LiquidityAnalysis.destroy({ where: { LiquidityID: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
