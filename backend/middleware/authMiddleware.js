const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authMiddleware = async (req, res, next) => {
    try {
        // ── 1. Read token from cookie ────────────────────
        const token = req.cookies.token;

        if (!token) {
            console.log("⚠️  No token in cookies");
            return res.status(401).json({ message: "Unauthorized" });
        }

        // ── 2. Verify JWT ────────────────────────────────
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtErr) {
            console.log("⚠️  JWT verification failed:", jwtErr.message);
            return res.status(401).json({ message: "Unauthorized" });
        }

        // ── 3. Extract username ──────────────────────────
        const username = payload.sub;

        // ── 4. Check token exists in UserToken table ─────
        const [tokens] = await db.query(
            "SELECT * FROM UserToken WHERE token = ?",
            [token]
        );

        if (tokens.length === 0) {
            console.log(`⚠️  Token not found in DB for "${username}"`);
            return res.status(401).json({ message: "Invalid token" });
        }

        // ── 5. Check expiry in DB ────────────────────────
        const dbToken = tokens[0];
        if (new Date(dbToken.expiry) < new Date()) {
            console.log(`⚠️  Token expired for "${username}"`);
            return res.status(401).json({ message: "Token expired" });
        }

        // ── 6. Attach username and proceed ───────────────
        req.user = username;
        console.log(`🔐 Auth verified for "${username}"`);
        next();
    } catch (err) {
        console.error("❌ Auth middleware error:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = authMiddleware;
