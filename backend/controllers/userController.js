const db = require("../config/db");

// ── GET /api/balance ─────────────────────────────────
const getBalance = async (req, res) => {
    console.log(`💰 Balance request for "${req.user}"`);

    try {
        const [users] = await db.query(
            "SELECT username, balance FROM KodUser WHERE username = ?",
            [req.user]
        );

        if (users.length === 0) {
            console.log(`⚠️  User "${req.user}" not found`);
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`✅ Balance fetched for "${req.user}": ${users[0].balance}`);

        return res.status(200).json({
            username: users[0].username,
            balance: users[0].balance,
            message: "Balance fetched successfully",
        });
    } catch (err) {
        console.error("❌ Balance fetch error:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getBalance };
