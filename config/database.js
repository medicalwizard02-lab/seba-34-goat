const mysql = require('mysql2/promise');

// Use environment variables for production, fallback to local for development
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'j173s/20000/2025',
  database: process.env.DB_NAME || 'heart_buddy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
