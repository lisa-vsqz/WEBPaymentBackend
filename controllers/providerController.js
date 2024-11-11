const Provider = require('../models/Provider');

exports.createProvider = async (req, res) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json(provider);
  } catch (error) {
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
    res.status(200).json({ message: 'Provider updated successfully' });
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
