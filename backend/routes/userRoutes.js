const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getBalance } = require("../controllers/userController");

// GET /api/balance (protected)
router.get("/balance", authMiddleware, getBalance);

module.exports = router;
