const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const bankAccountRoutes = require('./routes/bankAccountRoutes');
const providerRoutes = require('./routes/providerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const providerHistoryRoutes = require('./routes/providerHistoryRoutes');
const liquidityAnalysisRoutes = require('./routes/liquidityAnalysisRoutes');
const sequelize = require('./config/database');

dotenv.config();



// Middleware
app.use(cors());
app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// Routes
app.use('/api/users', userRoutes);
app.use('/api/bankaccounts', bankAccountRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/providerhistory', providerHistoryRoutes);
app.use('/api/liquidityanalysis', liquidityAnalysisRoutes);

// Test Database Connection and Sync Models
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync(); // Sync all defined models to the DB
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
