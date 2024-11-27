exports.getSuggestedPayments = (invoices) => {
  return invoices
    .filter((invoice) => invoice.PaymentStatus === "Unpaid")
    .map((invoice) => ({
      InvoiceNumber: invoice.InvoiceNumber,
      DueDate: invoice.DueDate,
      SuggestedPaymentDate: new Date(
        new Date(invoice.DueDate).setDate(
          new Date(invoice.DueDate).getDate() - 3
        )
      ), // 3 días antes
      AmountDue: invoice.TotalAmount - invoice.AmountPaid,
    }));
};
