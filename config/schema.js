const pool = require('./database');

async function initializeDatabase() {
  const connection = await pool.getConnection();
  
  try {
    // Create users table
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

    // Create relationships table
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

    // Create trust signals table
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

    // Create checks history table
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

    // ========== WILD GUESS FEATURE TABLES ==========

    // Create wild guess challenge sessions
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

    // Create wild guess messages (real-time chat)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wild_guess_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        sender_user_id INT,
        sender_type ENUM('anonymous', 'registered') NOT NULL,
        message_text TEXT NOT NULL,
        message_type ENUM('text', 'emoji', 'hint', 'system') DEFAULT 'text',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES wild_guess_challenges(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_challenge (challenge_id),
        INDEX idx_created_at (created_at)
      )
    `);

    // Create wild guess guesses/attempts
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wild_guess_guesses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        guessed_user_id INT NOT NULL,
        is_correct BOOLEAN DEFAULT FALSE,
        guess_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        points_earned INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES wild_guess_challenges(id) ON DELETE CASCADE,
        FOREIGN KEY (guessed_user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_challenge (challenge_id),
        INDEX idx_correct (is_correct)
      )
    `);

    // Create wild guess gifts (reward system)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wild_guess_gifts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        requested_by_user_id INT NOT NULL,
        recipient_user_id INT NOT NULL,
        gift_type VARCHAR(100),
        gift_name VARCHAR(255),
        gift_emoji VARCHAR(10),
        gift_description TEXT,
        is_accepted BOOLEAN DEFAULT FALSE,
        acceptance_timestamp TIMESTAMP NULL,
        used_to_reveal BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES wild_guess_challenges(id) ON DELETE CASCADE,
        FOREIGN KEY (requested_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_challenge (challenge_id),
        INDEX idx_recipient (recipient_user_id)
      )
    `);

    // Create user stats/leaderboard
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wild_guess_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        total_challenges INT DEFAULT 0,
        correct_guesses INT DEFAULT 0,
        wrong_guesses INT DEFAULT 0,
        identities_revealed INT DEFAULT 0,
        gifts_received INT DEFAULT 0,
        gifts_used INT DEFAULT 0,
        total_points INT DEFAULT 0,
        win_streak INT DEFAULT 0,
        rank_position INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_points (total_points),
        INDEX idx_rank (rank_position)
      )
    `);

    // Create anonymous user profiles/hints
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wild_guess_clues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        clue_text TEXT,
        clue_type ENUM('personality', 'hobby', 'location', 'work', 'physical', 'emoji') DEFAULT 'personality',
        revealed_by_gift BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES wild_guess_challenges(id) ON DELETE CASCADE,
        INDEX idx_challenge (challenge_id)
      )
    `);

    console.log('✅ All database tables created successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { initializeDatabase };
