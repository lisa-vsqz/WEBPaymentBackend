const express = require('express');
const router = express.Router();
const liquidityAnalysisController = require('../controllers/liquidityAnalysisController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', liquidityAnalysisController.createLiquidityAnalysis);
router.get('/', liquidityAnalysisController.getLiquidityAnalyses);
router.get('/:id', liquidityAnalysisController.getLiquidityAnalysis);
router.put('/:id', liquidityAnalysisController.updateLiquidityAnalysis);
router.delete('/:id', liquidityAnalysisController.deleteLiquidityAnalysis);

module.exports = router;
