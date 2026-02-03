const dbHelpers = require('../../../config/dbHelpers');

/**
 * Create a new Wild Guess challenge
 * POST /api/wild-guess/create
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, timerDuration = 600 } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log('🔍 DEBUG: Received request to create Wild Guess challenge');
    console.log('   userId:', userId);
    console.log('   timerDuration:', timerDuration);
    console.log('   DB_HOST env:', process.env.DB_HOST || 'NOT SET');
    console.log('   DB_NAME env:', process.env.DB_NAME || 'NOT SET');
    
    const challenge = await dbHelpers.createWildGuessChallenge(userId, timerDuration);
    
    console.log('✓ Challenge created:', challenge.id);

    // Helper to encode share links
    const encodeShareLink = (baseLink, platform) => {
      const challengeMessage = `Can you guess who I am? I dare you to figure it out! 🎭`;
      
      const shareUrls = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(challengeMessage + '\n\n' + baseLink)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(baseLink)}&text=${encodeURIComponent(challengeMessage)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseLink)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(baseLink)}&text=${encodeURIComponent(challengeMessage)}`,
        instagram: baseLink,
        copy: baseLink
      };

      return shareUrls[platform] || baseLink;
    };

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
    console.error('❌ Error creating challenge:', error.message);
    console.error('   Stack:', error.stack);
    console.error('   DB_HOST:', process.env.DB_HOST);
    console.error('   DB_PORT:', process.env.DB_PORT);
    
    res.status(500).json({ 
      error: 'Failed to create challenge',
      details: error.message
    });
  }
}
