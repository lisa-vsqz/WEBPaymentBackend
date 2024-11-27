const Payment = require("../models/Payment");
const paymentService = require("../services/paymentService");
const Invoice = require("../models/Invoice");
const sequelize = require("../config/database");
const ProviderHistory = require("../models/ProviderHistory");
const BankAccount = require("../models/BankAccount");

exports.getSuggestedPaymentDates = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();

    // Calcular fechas sugeridas
    const suggestedPayments = paymentService.getSuggestedPayments(invoices);

    res.json(suggestedPayments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al calcular las fechas sugeridas de pago." });
  }
};

exports.createPayment = async (req, res) => {
  let transaction;
  try {
    console.log("Request Body:", req.body); // Log incoming request data

    // Start the transaction
    transaction = await sequelize.transaction();
    console.log("Transaction started:", transaction.id); // Log transaction ID

    // Ensure PaymentDate is in the correct format
    const paymentData = {
      ...req.body,
      PaymentDate: formatDate(req.body.PaymentDate), // Ensure 'YYYY-MM-DD' format
    };
    console.log("Formatted PaymentDate as string:", paymentData.PaymentDate);

    // Retrieve the corresponding Invoice
    const invoice = await Invoice.findByPk(req.body.InvoiceID, { transaction });
    if (!invoice) {
      throw new Error("Invoice not found for the given InvoiceID");
    }

    console.log("Retrieved Invoice:", invoice);

    // Dynamically calculate AmountDue
    const amountDue = invoice.TotalAmount - invoice.AmountPaid;

    // Check if the invoice is already fully paid
    if (amountDue <= 0 || isNaN(amountDue)) {
      // Mark the invoice as Paid
      await sequelize.query(
        `UPDATE Invoices SET PaymentStatus = 'Paid', UpdatedAt = GETDATE() WHERE InvoiceID = :InvoiceID`,
        {
          replacements: { InvoiceID: req.body.InvoiceID },
          transaction,
        }
      );
      throw new Error(
        "This invoice has already been fully paid. Payment cannot be processed."
      );
    }

    // Retrieve the corresponding BankAccount
    const bankAccount = await BankAccount.findByPk(req.body.BankAccountID, {
      transaction,
    });
    if (!bankAccount) {
      throw new Error("BankAccount not found for the given BankAccountID");
    }

    // Check if sufficient balance exists
    if (bankAccount.Balance < req.body.AmountPaid) {
      throw new Error("Insufficient balance in the bank account");
    }

    // Determine the actual payment amount
    const paymentAmount = Math.min(req.body.AmountPaid, amountDue);

    // Deduct the payment amount from the BankAccount's Balance
    bankAccount.Balance -= paymentAmount;
    console.log(
      `Updated BankAccount Balance: ${bankAccount.Balance} (deducted ${paymentAmount})`
    );

    // Save the updated BankAccount balance
    await bankAccount.save({ transaction });

    // Insert the payment into the database
    await sequelize.query(
      `INSERT INTO Payments (BankAccountID, PaymentDate, AmountPaid, ProviderID, InvoiceID, PaymentNotification, CreatedAt) 
       VALUES (:BankAccountID, :PaymentDate, :AmountPaid, :ProviderID, :InvoiceID, :PaymentNotification, GETDATE())`,
      {
        replacements: {
          ...paymentData,
          AmountPaid: paymentAmount, // Use the actual payment amount
        },
        transaction,
      }
    );
    console.log("Payment inserted successfully.");

    // Update ProviderHistory for the corresponding Provider
    const providerHistory = await ProviderHistory.findOne({
      where: { ProviderID: req.body.ProviderID },
      transaction,
    });

    if (!providerHistory) {
      throw new Error("ProviderHistory not found for the given ProviderID");
    }

    providerHistory.TotalPaid += paymentAmount;
    providerHistory.PaymentsCount += 1;
    console.log(
      "Updated ProviderHistory - TotalPaid:",
      providerHistory.TotalPaid
    );
    console.log(
      "Updated ProviderHistory - PaymentsCount:",
      providerHistory.PaymentsCount
    );
    await providerHistory.save({ transaction });

    // Update the Invoice based on the Payment
    invoice.AmountPaid += paymentAmount;

    if (invoice.AmountPaid >= invoice.TotalAmount) {
      console.log("Invoice fully paid. Marking as Paid.");
      invoice.PaymentStatus = "Paid";
    } else {
      console.log("Invoice partially paid. Updating PaymentStatus.");
      invoice.PaymentStatus = "Partially Paid";
    }

    // Update the UpdatedAt field explicitly
    await sequelize.query(
      `UPDATE Invoices SET AmountPaid = :AmountPaid, PaymentStatus = :PaymentStatus, UpdatedAt = GETDATE() WHERE InvoiceID = :InvoiceID`,
      {
        replacements: {
          AmountPaid: invoice.AmountPaid,
          PaymentStatus: invoice.PaymentStatus,
          InvoiceID: req.body.InvoiceID,
        },
        transaction,
      }
    );

    console.log(
      `Updated Invoice - TotalAmount: ${invoice.TotalAmount}, AmountPaid: ${invoice.AmountPaid}, PaymentStatus: ${invoice.PaymentStatus}`
    );

    // Commit the transaction
    await transaction.commit();
    console.log("Transaction committed successfully.");
    res.status(201).json({ message: "Payment created successfully." });
  } catch (error) {
    // Rollback the transaction only if it exists and is not already finished
    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
        console.log("Transaction rolled back successfully.");
      } catch (rollbackError) {
        console.error("Transaction rollback failed:", rollbackError.message);
      }
    }

    console.error("Error in createPayment:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format. Use 'YYYY-MM-DD'.");
  }
  // Return 'YYYY-MM-DD' string
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
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
    res.status(200).json({ message: "Payment updated successfully" });
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
