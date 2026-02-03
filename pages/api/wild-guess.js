const express = require('express');
const router = express.Router();
const dbHelpers = require('../../config/dbHelpers');

// ========== WILD GUESS SHARE ENDPOINTS ==========

/**
 * Create a new Wild Guess challenge
 * POST /api/wild-guess/create
 */
router.post('/create', async (req, res) => {
  try {
    const { userId, timerDuration = 300 } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const challenge = await dbHelpers.createWildGuessChallenge(userId, timerDuration);

    return res.status(201).json({
      success: true,
      challenge,
      shareLinks: {
        app: challenge.share_link,
        whatsapp: encodeShareLink(challenge.share_link, 'whatsapp'),
        twitter: encodeShareLink(challenge.share_link, 'twitter'),
        facebook: encodeShareLink(challenge.share_link, 'facebook'),
        telegram: encodeShareLink(challenge.share_link, 'telegram'),
        copy: challenge.share_link
      }
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

/**
 * Get challenge details
 * GET /api/wild-guess/:challengeToken
 */
router.get('/:challengeToken', async (req, res) => {
  try {
    const { challengeToken } = req.params;
    const challenge = await dbHelpers.getChallengeByChallengeToken(challengeToken);

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Get messages, guesses, gifts for this challenge
    const [messages, guesses, gifts, clues] = await Promise.all([
      dbHelpers.getChallengeMessages(challenge.id),
      dbHelpers.getChallengeGuesses(challenge.id),
      dbHelpers.getChallengeGifts(challenge.id),
      dbHelpers.getChallengeClues(challenge.id)
    ]);

    res.json({
      challenge,
      messages,
      guesses,
      gifts,
      clues
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

/**
 * Send message in challenge
 * POST /api/wild-guess/:challengeId/message
 */
router.post('/:challengeId/message', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { senderId, senderType, messageText, messageType = 'text' } = req.body;

    const messageId = await dbHelpers.addWildGuessMessage(
      challengeId,
      senderId,
      senderType,
      messageText,
      messageType
    );

    res.status(201).json({
      success: true,
      messageId,
      message: {
        id: messageId,
        challenge_id: challengeId,
        sender_user_id: senderId,
        sender_type: senderType,
        message_text: messageText,
        message_type: messageType
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/**
 * Make a guess
 * POST /api/wild-guess/:challengeId/guess
 */
router.post('/:challengeId/guess', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { guessedUserId, targetUserId } = req.body;

    const challenge = await dbHelpers.getChallenge(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const isCorrect = guessedUserId === challenge.anonymous_user_id;
    const pointsEarned = isCorrect ? 100 : 0;

    const guessId = await dbHelpers.addWildGuessGuess(
      challengeId,
      guessedUserId,
      isCorrect,
      pointsEarned
    );

    // If correct, update challenge status
    if (isCorrect) {
      await dbHelpers.updateChallengeStatus(challengeId, 'identity_guessed', {
        target_guessed_user_id: guessedUserId,
        guess_was_correct: true
      });
    }

    res.json({
      success: true,
      guessId,
      isCorrect,
      pointsEarned,
      message: isCorrect ? '🎉 Correct guess!' : '❌ Wrong guess, try again!'
    });
  } catch (error) {
    console.error('Error processing guess:', error);
    res.status(500).json({ error: 'Failed to process guess' });
  }
});

/**
 * Request a gift for identity reveal
 * POST /api/wild-guess/:challengeId/request-gift
 */
router.post('/:challengeId/request-gift', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { requestedByUserId, recipientUserId, giftType } = req.body;

    const challenge = await dbHelpers.getChallenge(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const giftData = {
      gift_type: giftType,
      gift_name: GIFT_CONFIG[giftType]?.name || giftType,
      gift_emoji: GIFT_CONFIG[giftType]?.emoji || '🎁',
      gift_description: GIFT_CONFIG[giftType]?.description || 'Mystery gift'
    };

    const giftId = await dbHelpers.addWildGuessGift(
      challengeId,
      requestedByUserId,
      recipientUserId,
      giftData
    );

    res.status(201).json({
      success: true,
      giftId,
      gift: giftData
    });
  } catch (error) {
    console.error('Error requesting gift:', error);
    res.status(500).json({ error: 'Failed to request gift' });
  }
});

/**
 * Accept a gift
 * POST /api/wild-guess/gift/:giftId/accept
 */
router.post('/gift/:giftId/accept', async (req, res) => {
  try {
    const { giftId } = req.params;
    await dbHelpers.acceptWildGuessGift(giftId);

    res.json({
      success: true,
      message: '🎁 Gift accepted! The user can now use it to reveal their identity.'
    });
  } catch (error) {
    console.error('Error accepting gift:', error);
    res.status(500).json({ error: 'Failed to accept gift' });
  }
});

/**
 * Use gift to reveal identity
 * POST /api/wild-guess/gift/:giftId/reveal
 */
router.post('/gift/:giftId/reveal', async (req, res) => {
  try {
    const { giftId } = req.params;
    const { challengeId } = req.body;

    await dbHelpers.useGiftToReveal(giftId, challengeId);

    res.json({
      success: true,
      message: '🎉 Identity revealed with gift reward!'
    });
  } catch (error) {
    console.error('Error revealing identity:', error);
    res.status(500).json({ error: 'Failed to reveal identity' });
  }
});

/**
 * Get user leaderboard
 * GET /api/wild-guess/stats/leaderboard
 */
router.get('/stats/leaderboard', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const leaderboard = await dbHelpers.getLeaderboard(parseInt(limit));

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

/**
 * Get user stats
 * GET /api/wild-guess/stats/:userId
 */
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await dbHelpers.getOrCreateUserStats(userId);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * Get challenge messages
 * GET /api/wild-guess/:challengeId/messages
 */
router.get('/:challengeId/messages', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const messages = await dbHelpers.getChallengeMessages(challengeId);

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * Get user challenges
 * GET /api/wild-guess/user/:userId/challenges
 */
router.get('/user/:userId/challenges', async (req, res) => {
  try {
    const { userId } = req.params;
    const challenges = await dbHelpers.getUserChallenges(userId);

    res.json({
      success: true,
      challenges
    });
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// ========== HELPER FUNCTION ==========

const GIFT_CONFIG = {
  heart_gem: { name: 'Heart Gem', emoji: '💎', description: 'A precious gem of love' },
  chocolate: { name: 'Chocolate', emoji: '🍫', description: 'Sweet treat for you' },
  iphone17: { name: 'iPhone 17', emoji: '📱', description: 'Latest iPhone model' },
  iphone16: { name: 'iPhone 16', emoji: '📱', description: 'Premium smartphone' },
  bouquet: { name: 'Bouquet', emoji: '💐', description: 'Beautiful flowers' },
  flowers: { name: 'Flowers', emoji: '🌸', description: 'Fresh blooms' },
  pradotx: { name: 'Pradotx Luxury', emoji: '👜', description: 'Luxury gift' },
  lion: { name: 'Lion Badge', emoji: '🦁', description: 'Wild & fierce' }
};

/**
 * Encode challenge link for different social platforms
 */
function encodeShareLink(baseLink, platform) {
  const challengeMessage = "Can you guess who I am? 🎭 Send me anonymous messages and try to figure out my identity! 👀";
  
  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(challengeMessage + '\n\n' + baseLink)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(baseLink)}&text=${encodeURIComponent(challengeMessage)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseLink)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(baseLink)}&text=${encodeURIComponent(challengeMessage)}`,
    instagram: baseLink, // Instagram doesn't support direct sharing via URL
    copy: baseLink
  };

  return shareUrls[platform] || baseLink;
}

module.exports = router;
