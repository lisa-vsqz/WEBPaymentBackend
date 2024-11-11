const ProviderHistory = require('../models/ProviderHistory');

exports.createProviderHistory = async (req, res) => {
  try {
    const providerHistory = await ProviderHistory.create(req.body);
    res.status(201).json(providerHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProviderHistories = async (req, res) => {
  try {
    const providerHistories = await ProviderHistory.findAll();
    res.status(200).json(providerHistories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProviderHistory = async (req, res) => {
  try {
    const providerHistory = await ProviderHistory.findByPk(req.params.id);
    res.status(200).json(providerHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProviderHistory = async (req, res) => {
  try {
    await ProviderHistory.update(req.body, { where: { ProviderHistoryID: req.params.id } });
    res.status(200).json({ message: 'Provider history updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProviderHistory = async (req, res) => {
  try {
    await ProviderHistory.destroy({ where: { ProviderHistoryID: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
