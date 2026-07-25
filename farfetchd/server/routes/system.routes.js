const express = require('express');
const router = express.Router();
const systemController = require('../controllers/system.controller');

/**
 * System Routes
 * GET /api/system/*
 */

// Get static system information
router.get('/info', systemController.getSystemInfo);

// Get current metrics snapshot
router.get('/snapshot', systemController.getCurrentMetrics);

// Get specific metric type
router.get('/metrics/:type', systemController.getMetricByType);

module.exports = router;
