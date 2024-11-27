exports.calculateLiquidity = (bankAccounts, invoices) => {
  let totalBalance = 0;
  let totalPendingPayments = 0;

  // Sumar saldos de cuentas bancarias
  bankAccounts.forEach((account) => {
    totalBalance += account.Balance;
  });

  // Sumar montos pendientes de facturas
  invoices.forEach((invoice) => {
    totalPendingPayments += invoice.TotalAmount - invoice.AmountPaid;
  });

  // Determinar el estado de liquidez
  let liquidityStatus = "Fondos insuficientes";
  if (totalBalance >= totalPendingPayments) {
    liquidityStatus = "Suficiente liquidez";
  } else if (totalBalance > 0 && totalBalance < totalPendingPayments) {
    liquidityStatus = "Límite cercano";
  }

  return { totalBalance, totalPendingPayments, liquidityStatus };
};
