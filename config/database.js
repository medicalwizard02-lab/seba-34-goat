const mysql = require('mysql2/promise');

// Use environment variables for production, fallback to local for development
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'j173s/20000/2025',
  database: process.env.DB_NAME || 'heart_buddy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Enable SSL for cloud databases (DigitalOcean, AWS, etc.)
if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
