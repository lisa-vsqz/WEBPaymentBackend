const express = require("express");
const router = express.Router();
const bankAccountController = require("../controllers/bankAccountController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  bankAccountController.createBankAccount
);
router.get("/", bankAccountController.getBankAccounts);
router.get("/:id", bankAccountController.getBankAccount);
router.put("/:id", bankAccountController.updateBankAccount);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  bankAccountController.deleteBankAccount
);

module.exports = router;
