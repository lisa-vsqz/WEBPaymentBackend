const express = require("express");
const router = express.Router();
const providerHistoryController = require("../controllers/providerHistoryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);

router.get("/", providerHistoryController.getProviderHistories);
router.get("/:id", providerHistoryController.getProviderHistory);
router.put("/:id", providerHistoryController.updateProviderHistory);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  providerHistoryController.deleteProviderHistory
);

module.exports = router;
