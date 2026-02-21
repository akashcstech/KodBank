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
        origin: ["https://kod-bank-lemon.vercel.app/","https://kod-bank-skycstech-7679s-projects.vercel.app/","http://localhost:5173", "http://localhost:8080"],
        credentials: true,
    })
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
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await initTables();
        app.listen(PORT, () => {
            console.log(`🚀 Kodnest server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err.message);
        process.exit(1);
    }
}

startServer();
