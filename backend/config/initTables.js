const db = require("./db");

/**
 * Creates KodUser and UserToken tables if they don't exist.
 * Called once when the server starts.
 */
async function initTables() {
  const createKodUser = `
    CREATE TABLE IF NOT EXISTS KodUser (
      uid INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) UNIQUE,
      email VARCHAR(100),
      password VARCHAR(255),
      balance DECIMAL(10,2) DEFAULT 100000.00,
      phone VARCHAR(20),
      role VARCHAR(20) DEFAULT 'customer'
    )
  `;

  const createUserToken = `
    CREATE TABLE IF NOT EXISTS UserToken (
      tid INT PRIMARY KEY AUTO_INCREMENT,
      token TEXT,
      uid INT,
      expiry DATETIME,
      FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
    )
  `;

  try {
    await db.query(createKodUser);
    console.log("✅ KodUser table ready");
    await db.query(createUserToken);
    console.log("✅ UserToken table ready");
  } catch (err) {
    console.error("❌ Table creation failed:", err.message);
    process.exit(1);
  }
}

module.exports = initTables;
