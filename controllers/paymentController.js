const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    console.log(providerHistories);
    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    res.status(200).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    await Payment.update(req.body, { where: { PaymentID: req.params.id } });
    res.status(200).json({ message: 'Payment updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    await Payment.destroy({ where: { PaymentID: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
