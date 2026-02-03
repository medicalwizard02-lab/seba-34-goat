const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();

// ✅ Root API route for Vercel
app.get('/api', (req, res) => {
  res.json({ message: 'Heart Buddy API is live!' });
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import Wild Guess routes
const wildGuessRouter = require('../pages/api/wild-guess');

// Database file path
const dbPath = path.join('/tmp', 'database.json');

// Initialize database
function initDB() {
  let db = {
    users: [],
    relationships: [],
    trustSignals: [],
    checksHistory: [],
    nglMessages: [],
    nglGuesses: [],
    userGifts: []
  };

  // Try to load existing database
  if (fs.existsSync(dbPath)) {
    try {
      const loadedDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      // Ensure all required arrays exist
      db = {
        users: loadedDb.users || [],
        relationships: loadedDb.relationships || [],
        trustSignals: loadedDb.trustSignals || [],
        checksHistory: loadedDb.checksHistory || [],
        nglMessages: loadedDb.nglMessages || [],
        nglGuesses: loadedDb.nglGuesses || [],
        userGifts: loadedDb.userGifts || []
      };
    } catch (e) {
      console.log('Creating new database');
    }
  }

  // Add demo data if empty
  if (db.users.length === 0) {
    db.users = [
      {
        id: 1,
        phone: '+254711111111',
        created_at: new Date().toISOString(),
        free_checks_remaining: 3
      },
      {
        id: 2,
        phone: '+254722222222',
        created_at: new Date().toISOString(),
        free_checks_remaining: 3
      },
      {
        id: 3,
        phone: '+254733333333',
        created_at: new Date().toISOString(),
        free_checks_remaining: 3
      }
    ];

    const certId = crypto.randomBytes(16).toString('hex');
    db.relationships = [{
      id: 1,
      initiator_phone: '+254711111111',
      partner_phone: '+254722222222',
      status: 'verified',
      is_public: 1,
      certificate_id: certId,
      created_at: new Date().toISOString(),
      verified_at: new Date().toISOString()
    }];

    db.trustSignals = [{
      id: 1,
      phone: '+254733333333',
      signal_type: 'multiple_declarations',
      description: 'Multiple relationship declarations detected',
      severity: 'high',
      created_at: new Date().toISOString()
    }];
  }

  saveDB(db);
  return db;
}

function saveDB(db) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error('Error saving database:', e);
  }
}

function getDB() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {
    return initDB();
  }
}

// Initialize on startup
initDB();

// -------------------- ROUTES --------------------

// User signup/login
app.post('/api/auth/signup', (req, res) => {
  const { phone } = req.body;

  if (!phone || !phone.trim()) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!phone.match(/^\+254\d{9}$/)) {
    return res.status(400).json({ 
      error: 'Invalid phone format. Use: +254XXXXXXXXX' 
    });
  }

  const db = getDB();
  const user = db.users.find(u => u.phone === phone);

  if (user) {
    return res.json({ 
      message: 'Login successful',
      user: {
        phone: user.phone,
        freeChecksRemaining: user.free_checks_remaining
      }
    });
  }

  const newUser = {
    id: db.users.length + 1,
    phone,
    created_at: new Date().toISOString(),
    free_checks_remaining: 3
  };

  db.users.push(newUser);
  saveDB(db);

  res.json({ 
    message: 'Registration successful',
    user: {
      phone: newUser.phone,
      freeChecksRemaining: newUser.free_checks_remaining
    }
  });
});

// Check if someone is taken
app.post('/api/check', (req, res) => {
  const { checkerPhone, checkPhone } = req.body;

  if (!checkerPhone || !checkPhone) {
    return res.status(400).json({ error: 'Both phone numbers are required' });
  }

  if (!checkPhone.match(/^\+254\d{9}$/)) {
    return res.status(400).json({ 
      error: 'Invalid phone format. Use: +254XXXXXXXXX' 
    });
  }

  const db = getDB();
  const checker = db.users.find(u => u.phone === checkerPhone);

  if (!checker) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (checker.free_checks_remaining <= 0) {
    return res.status(402).json({ 
      error: 'No free checks remaining',
      message: 'KES 100 required for additional checks'
    });
  }

  const relationship = db.relationships.find(r => 
    (r.initiator_phone === checkPhone || r.partner_phone === checkPhone) && 
    r.status === 'verified'
  );

  const signals = db.trustSignals.filter(s => s.phone === checkPhone);

  let result = {
    phone: checkPhone,
    status: 'Not Declared',
    details: null,
    trustSignals: null
  };

  if (relationship) {
    result.status = 'Taken – Verified';
    result.details = {
      verifiedAt: relationship.verified_at,
      isPublic: relationship.is_public === 1
    };
  } else if (signals.length > 0) {
    result.status = 'Trust Risk Signals Detected';
    result.trustSignals = signals.map(s => ({
      type: s.signal_type,
      description: s.description,
      severity: s.severity
    }));
  }

  checker.free_checks_remaining--;
  db.checksHistory.push({
    id: db.checksHistory.length + 1,
    checker_phone: checkerPhone,
    checked_phone: checkPhone,
    result: result.status,
    created_at: new Date().toISOString()
  });

  saveDB(db);

  res.json({
    result,
    freeChecksRemaining: checker.free_checks_remaining
  });
});

// Declare relationship
app.post('/api/relationships/declare', (req, res) => {
  const { initiatorPhone, partnerPhone } = req.body;

  if (!initiatorPhone || !partnerPhone) {
    return res.status(400).json({ error: 'Both phone numbers are required' });
  }

  if (initiatorPhone === partnerPhone) {
    return res.status(400).json({ error: 'Cannot declare relationship with yourself' });
  }

  if (!partnerPhone.match(/^\+254\d{9}$/)) {
    return res.status(400).json({ 
      error: 'Invalid phone format. Use: +254XXXXXXXXX' 
    });
  }

  const db = getDB();
  const user = db.users.find(u => u.phone === initiatorPhone);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const existingRel = db.relationships.find(r => 
    ((r.initiator_phone === initiatorPhone || r.partner_phone === initiatorPhone) ||
     (r.initiator_phone === partnerPhone || r.partner_phone === partnerPhone)) &&
    r.status === 'verified'
  );

  if (existingRel) {
    return res.status(409).json({ 
      error: 'One or both parties already in a verified relationship' 
    });
  }

  const pending = db.relationships.find(r => 
    ((r.initiator_phone === initiatorPhone && r.partner_phone === partnerPhone) ||
     (r.initiator_phone === partnerPhone && r.partner_phone === initiatorPhone)) &&
    r.status === 'pending'
  );

  if (pending) {
    return res.status(409).json({ 
      error: 'A pending relationship request already exists' 
    });
  }

  const certificateId = crypto.randomBytes(16).toString('hex');
  const relationshipId = db.relationships.length + 1;

  const newRelationship = {
    id: relationshipId,
    initiator_phone: initiatorPhone,
    partner_phone: partnerPhone,
    certificate_id: certificateId,
    status: 'pending',
    is_public: 1,
    created_at: new Date().toISOString(),
    verified_at: null
  };

  db.relationships.push(newRelationship);
  saveDB(db);

  res.json({ 
    message: 'Relationship declaration sent',
    relationshipId: relationshipId,
    certificateId: certificateId,
    status: 'pending'
  });
});

// Approve relationship
app.post('/api/relationships/approve', (req, res) => {
  const { partnerPhone, relationshipId } = req.body;

  if (!partnerPhone || !relationshipId) {
    return res.status(400).json({ error: 'Partner phone and relationship ID are required' });
  }

  const db = getDB();
  const relationship = db.relationships.find(r => r.id === relationshipId);

  if (!relationship) {
    return res.status(404).json({ error: 'Relationship request not found' });
  }

  if (relationship.partner_phone !== partnerPhone) {
    return res.status(403).json({ error: 'Unauthorized to approve this request' });
  }

  if (relationship.status === 'verified') {
    return res.status(400).json({ error: 'Relationship already verified' });
  }

  relationship.status = 'verified';
  relationship.verified_at = new Date().toISOString();
  saveDB(db);

  res.json({ 
    message: 'Relationship verified successfully',
    certificateId: relationship.certificate_id,
    verifiedAt: relationship.verified_at
  });
});

// Get user relationships
app.get('/api/relationships/:phone', (req, res) => {
  const { phone } = req.params;
  const db = getDB();
  
  const relationships = db.relationships
    .filter(r => r.initiator_phone === phone || r.partner_phone === phone)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({ relationships });
});

// Update relationship privacy
app.patch('/api/relationships/:relationshipId/privacy', (req, res) => {
  const { relationshipId } = req.params;
  const { isPublic, userPhone } = req.body;

  const db = getDB();
  const relationship = db.relationships.find(r => r.id === parseInt(relationshipId));

  if (!relationship) {
    return res.status(404).json({ error: 'Relationship not found' });
  }

  if (relationship.initiator_phone !== userPhone && relationship.partner_phone !== userPhone) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  relationship.is_public = isPublic ? 1 : 0;
  saveDB(db);

  res.json({ 
    message: 'Privacy settings updated',
    isPublic: isPublic
  });
});

// Get certificate
app.get('/api/certificate/:certificateId', (req, res) => {
  const { certificateId } = req.params;
  const db = getDB();
  
  const relationship = db.relationships.find(r => 
    r.certificate_id === certificateId && r.status === 'verified'
  );

  if (!relationship) {
    return res.status(404).json({ error: 'Certificate not found' });
  }

  if (!relationship.is_public) {
    return res.status(403).json({ error: 'This certificate is private' });
  }

  res.json({ 
    certificate: {
      id: relationship.certificate_id,
      partner1: relationship.initiator_phone,
      partner2: relationship.partner_phone,
      verifiedAt: relationship.verified_at,
      isPublic: relationship.is_public === 1
    }
  });
});

// -------------------- NGL FEATURE ROUTES --------------------

// Send anonymous message
app.post('/api/ngl/send', (req, res) => {
  const { recipientPhone, message } = req.body;

  if (!recipientPhone || !message || !message.trim()) {
    return res.status(400).json({ error: 'Recipient phone and message are required' });
  }

  if (!recipientPhone.match(/^\+254\d{9}$/)) {
    return res.status(400).json({ 
      error: 'Invalid phone format. Use: +254XXXXXXXXX' 
    });
  }

  const db = getDB();
  const recipient = db.users.find(u => u.phone === recipientPhone);

  if (!recipient) {
    return res.status(404).json({ error: 'Recipient not found' });
  }

  const nglMessage = {
    id: (db.nglMessages.length + 1),
    recipient_phone: recipientPhone,
    message: message,
    anonymous_id: crypto.randomBytes(8).toString('hex'),
    created_at: new Date().toISOString(),
    guessed: false,
    guessed_by: null
  };

  db.nglMessages.push(nglMessage);
  saveDB(db);

  res.json({ 
    message: 'Anonymous message sent successfully!',
    messageId: nglMessage.id
  });
});

// Get anonymous messages for a user
app.get('/api/ngl/messages/:phone', (req, res) => {
  const { phone } = req.params;
  const db = getDB();

  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const messages = db.nglMessages
    .filter(m => m.recipient_phone === phone)
    .map(m => ({
      id: m.id,
      message: m.message,
      created_at: m.created_at,
      guessed: m.guessed,
      anonymous_id: m.anonymous_id
    }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({ messages });
});

// Guess who sent an anonymous message
app.post('/api/ngl/guess', (req, res) => {
  const { messageId, recipientPhone, guessedPhone } = req.body;

  if (!messageId || !recipientPhone || !guessedPhone) {
    return res.status(400).json({ error: 'Message ID, recipient phone, and guessed phone are required' });
  }

  const db = getDB();
  const nglMessage = db.nglMessages.find(m => m.id === messageId);

  if (!nglMessage) {
    return res.status(404).json({ error: 'Message not found' });
  }

  if (nglMessage.guessed) {
    return res.status(400).json({ error: 'This message has already been guessed' });
  }

  if (nglMessage.recipient_phone !== recipientPhone) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Check if guess is correct (stored in guesses table)
  const guess = {
    id: (db.nglGuesses.length + 1),
    message_id: messageId,
    recipient_phone: recipientPhone,
    guessed_phone: guessedPhone,
    created_at: new Date().toISOString()
  };

  const guessedUser = db.users.find(u => u.phone === guessedPhone);
  if (!guessedUser) {
    return res.status(404).json({ error: 'Guessed user not found' });
  }

  db.nglGuesses.push(guess);

  // Mark message as guessed
  nglMessage.guessed = true;
  nglMessage.guessed_by = guessedPhone;

  saveDB(db);

  res.json({ 
    message: 'Guess recorded!',
    correct: true,
    guessId: guess.id
  });
});

// Send gift to user
app.post('/api/ngl/gift', (req, res) => {
  const { fromPhone, toPhone, giftType, messageId } = req.body;

  if (!toPhone || !giftType || !messageId) {
    return res.status(400).json({ error: 'Recipient phone, gift type, and message ID are required' });
  }

  const db = getDB();

  const recipient = db.users.find(u => u.phone === toPhone);
  if (!recipient) {
    return res.status(404).json({ error: 'Recipient not found' });
  }

  const messageExists = db.nglMessages.find(m => m.id === messageId);
  if (!messageExists) {
    return res.status(404).json({ error: 'Message not found' });
  }

  const gift = {
    id: (db.userGifts.length + 1),
    from_phone: fromPhone || 'anonymous',
    to_phone: toPhone,
    gift_type: giftType,
    message_id: messageId,
    created_at: new Date().toISOString()
  };

  db.userGifts.push(gift);
  saveDB(db);

  res.json({ 
    message: 'Gift sent successfully!',
    giftId: gift.id,
    giftType: giftType
  });
});

// Get user's received gifts
app.get('/api/ngl/gifts/:phone', (req, res) => {
  const { phone } = req.params;
  const db = getDB();

  const user = db.users.find(u => u.phone === phone);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const gifts = db.userGifts
    .filter(g => g.to_phone === phone)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({ 
    gifts,
    totalGifts: gifts.length
  });
});

// Register Wild Guess routes
app.use('/api/wild-guess', wildGuessRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Heart Buddy API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel
module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Heart Buddy Backend running on port ${PORT}`);
  });
}
