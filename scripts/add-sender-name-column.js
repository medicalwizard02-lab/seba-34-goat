/**
 * Migration Script: Add sender_name column to wild_guess_messages table
 * This allows anonymous users to include their name with messages
 */

const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'j173s/20000/2025',
  database: 'heart_buddy'
};

async function migrate() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL database');

    // Check if column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'heart_buddy' 
        AND TABLE_NAME = 'wild_guess_messages' 
        AND COLUMN_NAME = 'sender_name'
    `);

    if (columns.length > 0) {
      console.log('⚠️  Column sender_name already exists in wild_guess_messages table');
      return;
    }

    // Add the column
    console.log('🔄 Adding sender_name column to wild_guess_messages table...');
    await connection.execute(`
      ALTER TABLE wild_guess_messages 
      ADD COLUMN sender_name VARCHAR(100) AFTER sender_type
    `);

    console.log('✅ Migration completed successfully!');
    console.log('📝 Added: sender_name VARCHAR(100) to wild_guess_messages');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run migration
migrate();
