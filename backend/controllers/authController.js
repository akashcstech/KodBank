const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ── POST /api/register ───────────────────────────────
const register = async (req, res) => {

    try {
        const { username, email, phone, password } = req.body;

        // ── Validate fields ──────────────────────────────
        if (!username || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ── Check if username already exists ─────────────
        const [existing] = await db.query(
            "SELECT uid FROM KodUser WHERE username = ?",
            [username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // ── Hash password ────────────────────────────────
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ── Insert new user ──────────────────────────────
        const [result] = await db.query(
            "INSERT INTO KodUser (username, email, phone, password) VALUES (?, ?, ?, ?)",
            [username, email, phone, hashedPassword]
        );

        console.log(`✅ User "${username}" registered with uid: ${result.insertId}`);

        return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("❌ Registration error:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── POST /api/login ──────────────────────────────────
const login = async (req, res) => {

    try {
        const { username, password } = req.body;

        // ── Validate fields ──────────────────────────────
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ── Check if user exists (by username OR email) ──
        const [users] = await db.query(
            "SELECT * FROM KodUser WHERE username = ? OR email = ?",
            [username, username]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = users[0];

        // ── Compare password ─────────────────────────────
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ── Generate JWT ─────────────────────────────────
        const token = jwt.sign(
            {
                sub: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // ── Calculate expiry (1 hour from now) ───────────
        const expiry = new Date(Date.now() + 60 * 60 * 1000);

        // ── Store token in UserToken table ───────────────
        await db.query(
            "INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)",
            [token, user.uid, expiry]
        );

        console.log(`✅ Token stored for user "${username}" (uid: ${user.uid})`);

        // ── Set cookie ───────────────────────────────────
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 60 * 60 * 1000,
        });

        console.log(`✅ User "${username}" logged in successfully`);

        return res.status(200).json({ message: "Login successful" });
    } catch (err) {
        console.error("❌ Login error:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── POST /api/logout ─────────────────────────────────
const logout = async (req, res) => {

    try {
        const token = req.cookies.token;

        if (token) {
            await db.query("DELETE FROM UserToken WHERE token = ?", [token]);
            console.log("✅ Token deleted from UserToken table");
        }

        res.clearCookie("token", {
            httpOnly: false,
            secure: false,
            sameSite: "lax",
        });

        console.log("✅ User logged out successfully");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("❌ Logout error:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { register, login, logout };
