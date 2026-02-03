const pool = require('./database');
const crypto = require('crypto');

// ========== USERS ==========
async function getUserByPhone(phone) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE phone = ?', [phone]);
  return rows[0];
}

async function getUserById(userId) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0];
}

async function createUser(phone, username = null) {
  const [result] = await pool.execute(
    'INSERT INTO users (phone, username, free_checks_remaining) VALUES (?, ?, ?)',
    [phone, username, 3]
  );
  return { id: result.insertId, phone, username, free_checks_remaining: 3 };
}

async function updateUserProfile(userId, { username, bio, avatar_url }) {
  await pool.execute(
    'UPDATE users SET username = ?, bio = ?, avatar_url = ? WHERE id = ?',
    [username, bio, avatar_url, userId]
  );
}

// ========== RELATIONSHIPS ==========
async function getRelationship(user1Id, user2Id) {
  const [rows] = await pool.execute(
    'SELECT * FROM relationships WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
    [user1Id, user2Id, user2Id, user1Id]
  );
  return rows[0];
}

async function createRelationship(user1Id, user2Id, isPublic = true) {
  const [result] = await pool.execute(
    'INSERT INTO relationships (user1_id, user2_id, is_public) VALUES (?, ?, ?)',
    [user1Id, user2Id, isPublic]
  );
  return { id: result.insertId, user1_id: user1Id, user2_id: user2Id, status: 'pending' };
}

async function updateRelationshipStatus(relationshipId, status) {
  await pool.execute(
    'UPDATE relationships SET status = ? WHERE id = ?',
    [status, relationshipId]
  );
}

// ========== CHECKS HISTORY ==========
async function addCheckHistory(userId, partnerPhone, result) {
  const [res] = await pool.execute(
    'INSERT INTO checks_history (user_id, partner_phone, result) VALUES (?, ?, ?)',
    [userId, partnerPhone, result]
  );
  return res.insertId;
}

async function getCheckHistory(userId) {
  const [rows] = await pool.execute(
    'SELECT * FROM checks_history WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
}

// ========== WILD GUESS CHALLENGES ==========
async function createWildGuessChallenge(targetUserId, timerDuration = 300) {
  const challengeToken = crypto.randomBytes(32).toString('hex');
  const shareLink = `${process.env.APP_URL || 'http://localhost:3000'}/wild-guess/${challengeToken}`;
  
  const [result] = await pool.execute(
    'INSERT INTO wild_guess_challenges (target_user_id, challenge_token, share_link, timer_duration_seconds, timer_started_at, timer_ends_at, status) VALUES (?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? SECOND), "active")',
    [targetUserId, challengeToken, shareLink, timerDuration, timerDuration]
  );
  
  return {
    id: result.insertId,
    target_user_id: targetUserId,
    challenge_token: challengeToken,
    share_link: shareLink,
    status: 'active'
  };
}

async function getChallenge(challengeId) {
  const [rows] = await pool.execute(
    'SELECT * FROM wild_guess_challenges WHERE id = ?',
    [challengeId]
  );
  return rows[0];
}

async function getChallengeByChallengeToken(token) {
  const [rows] = await pool.execute(
    'SELECT * FROM wild_guess_challenges WHERE challenge_token = ?',
    [token]
  );
  return rows[0];
}

async function getUserChallenges(userId) {
  const [rows] = await pool.execute(
    'SELECT * FROM wild_guess_challenges WHERE target_user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
}

async function updateChallengeStatus(challengeId, status, additionalData = {}) {
  const updates = [];
  const values = [];
  
  updates.push('status = ?');
  values.push(status);
  
  Object.keys(additionalData).forEach(key => {
    updates.push(`${key} = ?`);
    values.push(additionalData[key]);
  });
  
  updates.push('updated_at = NOW()');
  values.push(challengeId);
  
  const query = `UPDATE wild_guess_challenges SET ${updates.join(', ')} WHERE id = ?`;
  await pool.execute(query, values);
}

async function revealChallengeIdentity(challengeId, revealedByUserId, revealMethod = 'manual') {
  await updateChallengeStatus(challengeId, 'identity_revealed', {
    anonymous_user_id: revealedByUserId,
    is_identity_revealed: true,
    revealed_by: revealMethod
  });
}

// ========== WILD GUESS MESSAGES ==========
async function addWildGuessMessage(challengeId, senderId, senderType, messageText, messageType = 'text') {
  const [result] = await pool.execute(
    'INSERT INTO wild_guess_messages (challenge_id, sender_user_id, sender_type, message_text, message_type) VALUES (?, ?, ?, ?, ?)',
    [challengeId, senderId, senderType, messageText, messageType]
  );
  return result.insertId;
}

async function getChallengeMessages(challengeId) {
  const [rows] = await pool.execute(
    'SELECT * FROM wild_guess_messages WHERE challenge_id = ? ORDER BY created_at ASC',
    [challengeId]
  );
  return rows;
}

async function markMessagesAsRead(challengeId) {
  await pool.execute(
    'UPDATE wild_guess_messages SET is_read = TRUE WHERE challenge_id = ?',
    [challengeId]
  );
}

// ========== WILD GUESS GUESSES ==========
async function addWildGuessGuess(challengeId, guessedUserId, isCorrect, pointsEarned = 0) {
  const [result] = await pool.execute(
    'INSERT INTO wild_guess_guesses (challenge_id, guessed_user_id, is_correct, points_earned) VALUES (?, ?, ?, ?)',
    [challengeId, guessedUserId, isCorrect, pointsEarned]
  );
  return result.insertId;
}

async function getChallengeGuesses(challengeId) {
  const [rows] = await pool.execute(
    'SELECT * FROM wild_guess_guesses WHERE challenge_id = ? ORDER BY guess_timestamp DESC',
    [challengeId]
  );
  return rows;
}

// ========== WILD GUESS GIFTS ==========
async function addWildGuessGift(challengeId, requestedByUserId, recipientUserId, giftData) {
  const { gift_type, gift_name, gift_emoji, gift_description } = giftData;
  
  const [result] = await pool.execute(
    'INSERT INTO wild_guess_gifts (challenge_id, requested_by_user_id, recipient_user_id, gift_type, gift_name, gift_emoji, gift_description) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [challengeId, requestedByUserId, recipientUserId, gift_type, gift_name, gift_emoji, gift_description]
  );
  return result.insertId;
}

async function acceptWildGuessGift(giftId) {
  await pool.execute(
    'UPDATE wild_guess_gifts SET is_accepted = TRUE, acceptance_timestamp = NOW() WHERE id = ?',
    [giftId]
  );
}

async function useGiftToReveal(giftId, challengeId) {
  await pool.execute(
    'UPDATE wild_guess_gifts SET used_to_reveal = TRUE WHERE id = ?',
    [giftId]
  );
  await updateChallengeStatus(challengeId, 'identity_revealed', {
    is_identity_revealed: true,
    revealed_by: 'gift_reward'
  });
}

async function getChallengeGifts(challengeId) {
  const [rows] = await pool.execute(
    'SELECT * FROM wild_guess_gifts WHERE challenge_id = ? ORDER BY created_at DESC',
    [challengeId]
  );
  return rows;
}

async function getUserGifts(userId) {
  const [rows] = await pool.execute(
    'SELECT * FROM wild_guess_gifts WHERE recipient_user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
}

// ========== WILD GUESS CLUES ==========
async function addWildGuessClue(challengeId, clueText, clueType = 'personality') {
  const [result] = await pool.execute(
    'INSERT INTO wild_guess_clues (challenge_id, clue_text, clue_type) VALUES (?, ?, ?)',
    [challengeId, clueText, clueType]
  );
  return result.insertId;
}

async function getChallengeClues(challengeId) {
  const [rows] = await pool.execute(
    'SELECT * FROM wild_guess_clues WHERE challenge_id = ? ORDER BY created_at ASC',
    [challengeId]
  );
  return rows;
}

// ========== WILD GUESS STATS ==========
async function getOrCreateUserStats(userId) {
  const [existing] = await pool.execute(
    'SELECT * FROM wild_guess_stats WHERE user_id = ?',
    [userId]
  );
  
  if (existing.length === 0) {
    await pool.execute(
      'INSERT INTO wild_guess_stats (user_id) VALUES (?)',
      [userId]
    );
  }
  
  const [rows] = await pool.execute(
    'SELECT * FROM wild_guess_stats WHERE user_id = ?',
    [userId]
  );
  return rows[0];
}

async function updateUserStats(userId, updates) {
  const setClause = Object.keys(updates)
    .map(key => `${key} = ?`)
    .join(', ');
  
  const values = [...Object.values(updates), userId];
  
  await pool.execute(
    `UPDATE wild_guess_stats SET ${setClause}, updated_at = NOW() WHERE user_id = ?`,
    values
  );
}

async function getLeaderboard(limit = 50) {
  const [rows] = await pool.execute(
    'SELECT u.*, s.total_points, s.total_challenges, s.correct_guesses, s.rank_position FROM wild_guess_stats s JOIN users u ON s.user_id = u.id ORDER BY s.total_points DESC LIMIT ?',
    [limit]
  );
  return rows;
}

module.exports = {
  // Users
  getUserByPhone,
  getUserById,
  createUser,
  updateUserProfile,
  
  // Relationships
  getRelationship,
  createRelationship,
  updateRelationshipStatus,
  
  // Checks History
  addCheckHistory,
  getCheckHistory,
  
  // Wild Guess Challenges
  createWildGuessChallenge,
  getChallenge,
  getChallengeByChallengeToken,
  getUserChallenges,
  updateChallengeStatus,
  revealChallengeIdentity,
  
  // Wild Guess Messages
  addWildGuessMessage,
  getChallengeMessages,
  markMessagesAsRead,
  
  // Wild Guess Guesses
  addWildGuessGuess,
  getChallengeGuesses,
  
  // Wild Guess Gifts
  addWildGuessGift,
  acceptWildGuessGift,
  useGiftToReveal,
  getChallengeGifts,
  getUserGifts,
  
  // Wild Guess Clues
  addWildGuessClue,
  getChallengeClues,
  
  // Wild Guess Stats
  getOrCreateUserStats,
  updateUserStats,
  getLeaderboard
};
