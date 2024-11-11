const Invoice = require('../models/Invoice');

exports.createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    await Invoice.update(req.body, { where: { InvoiceID: req.params.id } });
    res.status(200).json({ message: 'Invoice updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    await Invoice.destroy({ where: { InvoiceID: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
