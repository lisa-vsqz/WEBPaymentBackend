// exports.getProvidersToAvoid = (providerHistory, invoices, totalBalance) => {
//   const providersToAvoid = [];

//   // Sort providers by cost (descending) and frequency (ascending)
//   const sortedByCost = [...providerHistory].sort(
//     (a, b) => b.TotalPaid - a.TotalPaid
//   );
//   const sortedByFrequency = [...providerHistory].sort(
//     (a, b) => a.PaymentsCount - b.PaymentsCount
//   );

//   // Cross-reference with invoices due this month
//   const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
//   const dueProviders = invoices
//     .filter(
//       (invoice) => new Date(invoice.DueDate).getMonth() + 1 === currentMonth
//     )
//     .map((invoice) => invoice.ProviderID);

//   // Iterate over sorted providers
//   sortedByCost.forEach((provider) => {
//     if (dueProviders.includes(provider.ProviderID)) {
//       if (provider.TotalPaid > totalBalance * 0.5) {
//         // Too expensive
//         providersToAvoid.push({
//           ProviderID: provider.ProviderID,
//           Reason: "Too expensive",
//           TotalPaid: provider.TotalPaid,
//           PaymentsCount: provider.PaymentsCount,
//         });
//       } else if (
//         sortedByFrequency.find((p) => p.ProviderID === provider.ProviderID)
//           .PaymentsCount < 5
//       ) {
//         // Less critical
//         providersToAvoid.push({
//           ProviderID: provider.ProviderID,
//           Reason: "Less critical",
//           TotalPaid: provider.TotalPaid,
//           PaymentsCount: provider.PaymentsCount,
//         });
//       }
//     }
//   });

//   return providersToAvoid;
// };

exports.getProvidersToAvoid = (providerHistory, invoices, totalBalance) => {
  const providersToAvoid = [];

  // Sort providers by cost (descending) and frequency (ascending)
  const sortedByCost = [...providerHistory].sort(
    (a, b) => b.TotalPaid - a.TotalPaid
  );
  const sortedByFrequency = [...providerHistory].sort(
    (a, b) => a.PaymentsCount - b.PaymentsCount
  );

  // Calculate averages
  const totalPaidSum = providerHistory.reduce(
    (sum, provider) => sum + provider.TotalPaid,
    0
  );
  const paymentCountSum = providerHistory.reduce(
    (sum, provider) => sum + provider.PaymentsCount,
    0
  );

  const averageTotalPaid = totalPaidSum / providerHistory.length;
  const averagePaymentsCount = paymentCountSum / providerHistory.length;

  // Cross-reference with invoices due this month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  const dueProviders = invoices
    .filter(
      (invoice) => new Date(invoice.DueDate).getMonth() + 1 === currentMonth
    )
    .map((invoice) => invoice.ProviderID);

  // Iterate over sorted providers to classify them
  sortedByCost.forEach((provider) => {
    const relatedInvoices = invoices.filter(
      (invoice) => invoice.ProviderID === provider.ProviderID
    );

    // Use a fixed threeMonthsAgo calculation
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Check if the provider hasn't been hired in the last 3 months
    const hasRecentInvoices = relatedInvoices.some((invoice) => {
      const invoiceDate = new Date(invoice.DueDate);
      return invoiceDate >= threeMonthsAgo;
    });

    if (!hasRecentInvoices) {
      providersToAvoid.push({
        ProviderID: provider.ProviderID,
        Reason: "Haven't hired in a long time",
        TotalPaid: provider.TotalPaid,
        PaymentsCount: provider.PaymentsCount,
      });
    } else if (provider.PaymentsCount < averagePaymentsCount) {
      // Uncommon provider
      providersToAvoid.push({
        ProviderID: provider.ProviderID,
        Reason: "Uncommon provider",
        TotalPaid: provider.TotalPaid,
        PaymentsCount: provider.PaymentsCount,
      });
    } else if (provider.TotalPaid > averageTotalPaid) {
      // Too expensive
      providersToAvoid.push({
        ProviderID: provider.ProviderID,
        Reason: "Too expensive",
        TotalPaid: provider.TotalPaid,
        PaymentsCount: provider.PaymentsCount,
      });
    }
  });

  return providersToAvoid;
};
