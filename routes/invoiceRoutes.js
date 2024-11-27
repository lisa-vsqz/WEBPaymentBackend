const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Apply authentication middleware for all routes
router.use(authMiddleware);

// CRUD Routes for invoices
router.post("/", invoiceController.createInvoice);
router.get("/", invoiceController.getInvoices);
router.get("/:id", invoiceController.getInvoice);
router.put("/:id", invoiceController.updateInvoice);
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
