const BankAccount = require('../models/BankAccount');

exports.createBankAccount = async (req, res) => {
  try {
    const bankAccount = await BankAccount.create(req.body);
    res.status(201).json(bankAccount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBankAccounts = async (req, res) => {
  try {
    const bankAccounts = await BankAccount.findAll();
    res.status(200).json(bankAccounts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBankAccount = async (req, res) => {
  try {
    const bankAccount = await BankAccount.findByPk(req.params.id);
    res.status(200).json(bankAccount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBankAccount = async (req, res) => {
  try {
    await BankAccount.update(req.body, { where: { BankAccountID: req.params.id } });
    res.status(200).json({ message: 'Bank account updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBankAccount = async (req, res) => {
  try {
    await BankAccount.destroy({ where: { BankAccountID: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
