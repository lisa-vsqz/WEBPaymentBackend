const express = require("express");
const router = express.Router();
const liquidityAnalysisController = require("../controllers/liquidityAnalysisController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);

router.get(
  "/status",
  authMiddleware,
  liquidityAnalysisController.getLiquidityStatus
);
router.post("/", liquidityAnalysisController.createLiquidityAnalysis);
router.get("/", liquidityAnalysisController.getLiquidityAnalyses);
router.get("/:id", liquidityAnalysisController.getLiquidityAnalysis);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  liquidityAnalysisController.updateLiquidityAnalysis
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  liquidityAnalysisController.deleteLiquidityAnalysis
);

module.exports = router;
