const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const db = require("./config/db");
const initTables = require("./config/initTables");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ── Middleware ────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({ 
        origin: "https://kod-bank-sigma.vercel.app",
        credentials: true,})
);

// ── Request Logger (dev) ─────────────────────────────
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// ── Auth Routes ──────────────────────────────────────
app.use("/api", authRoutes);

// ── User Routes (protected) ──────────────────────────
app.use("/api", userRoutes);

// ── Global Error Handler ─────────────────────────────
app.use((err, req, res, next) => {
    console.error("💥 Unhandled error:", err.stack);
    res.status(500).json({ message: "Something went wrong" });
});

// ── Start Server ─────────────────────────────────────
// Initialize tables once
initTables().catch((err) => {
    console.error("❌ Failed to initialize tables:", err.message);
});

// Export app for Vercel
module.exports = app;
