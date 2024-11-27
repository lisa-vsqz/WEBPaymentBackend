const Invoice = require("../models/Invoice");
const sequelize = require("../config/database");

exports.createInvoice = async (req, res) => {
  try {
    const {
      ProviderID,
      InvoiceNumber,
      DueDate,
      TotalAmount,
      AmountPaid,
      PaymentStatus,
    } = req.body;

    // Validate input (optional, but recommended)
    if (!ProviderID || !InvoiceNumber || !DueDate || !TotalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Use Sequelize's raw query to insert the invoice
    await sequelize.query(
      `
      INSERT INTO Invoices
        (ProviderID, InvoiceNumber, DueDate, TotalAmount, AmountPaid, PaymentStatus, CreatedAt, UpdatedAt)
      VALUES
        (:ProviderID, :InvoiceNumber, :DueDate, :TotalAmount, :AmountPaid, :PaymentStatus, GETDATE(), GETDATE())
      `,
      {
        replacements: {
          ProviderID,
          InvoiceNumber,
          DueDate,
          TotalAmount,
          AmountPaid: AmountPaid || 0, // Default to 0 if not provided
          PaymentStatus: PaymentStatus || "Unpaid", // Default to 'Unpaid'
        },
      }
    );

    res.status(201).json({ message: "Invoice created successfully" });
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
    res.status(200).json({ message: "Invoice updated successfully" });
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
