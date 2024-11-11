const LiquidityAnalysis = require('../models/LiquidityAnalysis');

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
    await LiquidityAnalysis.update(req.body, { where: { LiquidityID: req.params.id } });
    res.status(200).json({ message: 'Liquidity analysis updated successfully' });
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
