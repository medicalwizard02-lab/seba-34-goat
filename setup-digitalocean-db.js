/**
 * Setup script for DigitalOcean MySQL Database
 * 
 * Usage:
 * 1. Set environment variables with your DigitalOcean database credentials
 * 2. Run: node setup-digitalocean-db.js
 */

const mysql = require('mysql2/promise');

async function setupDatabase() {
  // Get credentials from command line arguments or environment
  const config = {
    host: process.env.DO_DB_HOST || process.argv[2],
    port: process.env.DO_DB_PORT || process.argv[3] || 25060,
    user: process.env.DO_DB_USER || process.argv[4] || 'doadmin',
    password: process.env.DO_DB_PASSWORD || process.argv[5],
    database: process.env.DO_DB_NAME || process.argv[6] || 'heart_buddy',
    ssl: {
      rejectUnauthorized: false
    }
  };

  if (!config.host || !config.password) {
    console.error('❌ Missing database credentials!');
    console.log('\nUsage:');
    console.log('  node setup-digitalocean-db.js <host> <port> <user> <password> <database>');
    console.log('\nOr set environment variables:');
    console.log('  DO_DB_HOST, DO_DB_PORT, DO_DB_USER, DO_DB_PASSWORD, DO_DB_NAME');
    console.log('\nExample:');
    console.log('  node setup-digitalocean-db.js db-mysql-nyc1-12345.ondigitalocean.com 25060 doadmin your-password heart_buddy');
    process.exit(1);
  }

  console.log('🔌 Connecting to DigitalOcean MySQL...');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Database: ${config.database}`);

  let connection;

  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connected successfully!\n');

    // Create users table
    console.log('📋 Creating users table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        username VARCHAR(100),
        avatar_url VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_verified BOOLEAN DEFAULT FALSE,
        free_checks_remaining INT DEFAULT 3
      )
    `);
    console.log('✅ Users table created');

    // Create relationships table
    console.log('📋 Creating relationships table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS relationships (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user1_id INT NOT NULL,
        user2_id INT NOT NULL,
        status ENUM('pending', 'confirmed', 'declined') DEFAULT 'pending',
        is_public BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_relationship (user1_id, user2_id)
      )
    `);
    console.log('✅ Relationships table created');

    // Create trust signals table
    console.log('📋 Creating trust_signals table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS trust_signals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        relationship_id INT,
        signal_type VARCHAR(100),
        confidence_score DECIMAL(3,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Trust signals table created');

    // Create checks history table
    console.log('📋 Creating checks_history table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS checks_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        partner_phone VARCHAR(20),
        result VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Checks history table created');

    // Create wild guess challenges table
    console.log('📋 Creating wild_guess_challenges table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wild_guess_challenges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        target_user_id INT NOT NULL,
        anonymous_user_id INT,
        challenge_token VARCHAR(255) UNIQUE NOT NULL,
        share_link VARCHAR(255),
        status ENUM('active', 'identity_guessed', 'identity_revealed', 'expired', 'completed') DEFAULT 'active',
        timer_duration_seconds INT DEFAULT 300,
        timer_started_at TIMESTAMP,
        timer_ends_at TIMESTAMP,
        is_identity_revealed BOOLEAN DEFAULT FALSE,
        revealed_by ENUM('correct_guess', 'gift_reward', 'manual') DEFAULT NULL,
        target_guessed_user_id INT,
        guess_was_correct BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (anonymous_user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (target_guessed_user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_target_user (target_user_id),
        INDEX idx_status (status),
        INDEX idx_anonymous_user (anonymous_user_id)
      )
    `);
    console.log('✅ Wild guess challenges table created');

    // Create wild guess messages table
    console.log('📋 Creating wild_guess_messages table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wild_guess_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        sender_user_id INT,
        sender_type ENUM('anonymous', 'registered') NOT NULL,
        sender_name VARCHAR(100),
        message_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES wild_guess_challenges(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_challenge (challenge_id),
        INDEX idx_created_at (created_at)
      )
    `);
    console.log('✅ Wild guess messages table created');

    // Create wild guess guesses table
    console.log('📋 Creating wild_guess_guesses table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wild_guess_guesses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        guessed_user_id INT NOT NULL,
        is_correct BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES wild_guess_challenges(id) ON DELETE CASCADE,
        FOREIGN KEY (guessed_user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_challenge (challenge_id)
      )
    `);
    console.log('✅ Wild guess guesses table created');

    // Create wild guess gifts table
    console.log('📋 Creating wild_guess_gifts table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wild_guess_gifts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        gift_type VARCHAR(50) NOT NULL,
        gift_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES wild_guess_challenges(id) ON DELETE CASCADE,
        INDEX idx_challenge (challenge_id)
      )
    `);
    console.log('✅ Wild guess gifts table created');

    // Create wild guess clues table
    console.log('📋 Creating wild_guess_clues table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wild_guess_clues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        clue_text TEXT NOT NULL,
        revealed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES wild_guess_challenges(id) ON DELETE CASCADE,
        INDEX idx_challenge (challenge_id)
      )
    `);
    console.log('✅ Wild guess clues table created');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to your Vercel project dashboard');
    console.log('2. Navigate to Settings → Environment Variables');
    console.log('3. Add these variables:');
    console.log(`   DB_HOST=${config.host}`);
    console.log(`   DB_PORT=${config.port}`);
    console.log(`   DB_USER=${config.user}`);
    console.log(`   DB_PASSWORD=your-password`);
    console.log(`   DB_NAME=${config.database}`);
    console.log('4. Redeploy your Vercel app');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Connection closed');
    }
  }
}

setupDatabase();
