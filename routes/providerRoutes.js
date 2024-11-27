const express = require("express");
const router = express.Router();
const providerController = require("../controllers/providerController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);

router.get("/avoid", authMiddleware, providerController.getProvidersToAvoid);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  providerController.createProvider
);
router.get("/", providerController.getProviders);
router.get("/:id", providerController.getProvider);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  providerController.updateProvider
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  providerController.deleteProvider
);

module.exports = router;
