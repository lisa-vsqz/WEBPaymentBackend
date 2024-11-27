const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);

router.get(
  "/suggested-payments",
  authMiddleware,
  paymentController.getSuggestedPaymentDates
);
router.post("/", paymentController.createPayment);
router.get("/", paymentController.getPayments);
router.get("/:id", paymentController.getPayment);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  paymentController.updatePayment
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  paymentController.deletePayment
);

module.exports = router;
