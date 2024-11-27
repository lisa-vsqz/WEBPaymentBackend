const Provider = require("../models/Provider");
const providerService = require("../services/providerService");
const ProviderHistory = require("../models/ProviderHistory");
const Invoice = require("../models/Invoice");
const BankAccount = require("../models/BankAccount");
const sequelize = require("../config/database");

exports.getProvidersToAvoid = async (req, res) => {
  try {
    // Fetch data from database
    const providerHistory = await ProviderHistory.findAll();
    const invoices = await Invoice.findAll();
    const bankAccounts = await BankAccount.findAll();

    // Calculate total balance
    const totalBalance = bankAccounts.reduce(
      (acc, account) => acc + account.Balance,
      0
    );

    // Get providers to avoid
    const providersToAvoid = providerService.getProvidersToAvoid(
      providerHistory,
      invoices,
      totalBalance
    );

    res.json(providersToAvoid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error analyzing providers to avoid." });
  }
};

exports.createProvider = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    const provider = await Provider.create(req.body, { transaction });

    // Create ProviderHistory for the new Provider
    await ProviderHistory.create(
      {
        ProviderID: provider.ProviderID,
        TotalPaid: 0, // Initialize with zero
        PaymentsCount: 0, // Initialize with zero
      },
      { transaction }
    );

    await transaction.commit(); // Commit the transaction
    res.status(201).json(provider);
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction if anything fails
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getProviders = async (req, res) => {
  try {
    const providers = await Provider.findAll();
    res.status(200).json(providers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProvider = async (req, res) => {
  try {
    const provider = await Provider.findByPk(req.params.id);
    res.status(200).json(provider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProvider = async (req, res) => {
  try {
    await Provider.update(req.body, { where: { ProviderID: req.params.id } });
    res.status(200).json({ message: "Provider updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProvider = async (req, res) => {
  try {
    await Provider.destroy({ where: { ProviderID: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
