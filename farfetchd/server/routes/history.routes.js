const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');

/**
 * History Routes
 * /api/history/*
 */

// Save new snapshot
router.post('/snapshots', historyController.saveSnapshot);

// Get all snapshots (with pagination)
router.get('/snapshots', historyController.getAllSnapshots);

// Get snapshot by ID
router.get('/snapshots/:id', historyController.getSnapshotById);

// Get snapshots by session ID
router.get('/sessions/:sessionId', historyController.getSnapshotsBySession);

// Delete snapshot by ID
router.delete('/snapshots/:id', historyController.deleteSnapshot);

// Delete all snapshots (dangerous)
router.delete('/snapshots', historyController.deleteAllSnapshots);

// Get overall statistics
router.get('/statistics', historyController.getStatistics);

module.exports = router;
