const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const pool = require('../config/database');
const dbHelpers = require('../config/dbHelpers');

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

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('⚠️  Make sure MySQL is running and database "heart_buddy" exists');
  }
}

// Initialize on startup
testDatabaseConnection();

// -------------------- ROUTES --------------------

// User signup/login
app.post('/api/auth/signup', async (req, res) => {
  const { phone } = req.body;

  if (!phone || !phone.trim()) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!phone.match(/^\+254\d{9}$/)) {
    return res.status(400).json({ 
      error: 'Invalid phone format. Use: +254XXXXXXXXX' 
    });
  }

  try {
    // Check if user exists
    let user = await dbHelpers.getUserByPhone(phone);

    if (user) {
      return res.json({ 
        message: 'Login successful',
        user: {
          id: user.id,
          phone: user.phone,
          username: user.username,
          freeChecksRemaining: user.free_checks_remaining
        }
      });
    }

    // Create new user
    user = await dbHelpers.createUser(phone);

    res.json({ 
      message: 'Registration successful',
      user: {
        id: user.id,
        phone: user.phone,
        username: user.username,
        freeChecksRemaining: user.free_checks_remaining
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to process signup' });
  }
});

// Check if someone is taken
app.post('/api/check', async (req, res) => {
  const { checkerPhone, checkPhone } = req.body;

  if (!checkerPhone || !checkPhone) {
    return res.status(400).json({ error: 'Both phone numbers are required' });
  }

  if (!checkPhone.match(/^\+254\d{9}$/)) {
    return res.status(400).json({ 
      error: 'Invalid phone format. Use: +254XXXXXXXXX' 
    });
  }

  try {
    // Get checker user
    const checker = await dbHelpers.getUserByPhone(checkerPhone);

    if (!checker) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (checker.free_checks_remaining <= 0) {
      return res.status(402).json({ 
        error: 'No free checks remaining',
        message: 'KES 100 required for additional checks'
      });
    }

    // Get checked user
    const checkedUser = await dbHelpers.getUserByPhone(checkPhone);
    
    let result = {
      phone: checkPhone,
      status: 'Not Declared',
      details: null,
      trustSignals: null
    };

    if (checkedUser) {
      // Check for relationships
      const [relationships] = await pool.execute(
        `SELECT * FROM relationships 
         WHERE (user1_id = ? OR user2_id = ?) 
         AND status = 'confirmed'`,
        [checkedUser.id, checkedUser.id]
      );

      // Check for trust signals
      const [signals] = await pool.execute(
        'SELECT * FROM trust_signals WHERE user_id = ?',
        [checkedUser.id]
      );

      if (relationships.length > 0) {
        const rel = relationships[0];
        result.status = 'Taken – Verified';
        result.details = {
          verifiedAt: rel.created_at,
          isPublic: rel.is_public === 1
        };
      } else if (signals.length > 0) {
        result.status = 'Trust Risk Signals Detected';
        result.trustSignals = signals.map(s => ({
          type: s.signal_type,
          confidence: s.confidence_score
        }));
      }
    }

    // Update free checks remaining
    await pool.execute(
      'UPDATE users SET free_checks_remaining = free_checks_remaining - 1 WHERE phone = ?',
      [checkerPhone]
    );

    // Log check history
    await dbHelpers.addCheckHistory(checker.id, checkPhone, result.status);

    res.json({
      result,
      freeChecksRemaining: checker.free_checks_remaining - 1
    });
  } catch (error) {
    console.error('Check error:', error);
    res.status(500).json({ error: 'Failed to process check' });
  }
});

// Declare relationship
app.post('/api/relationships/declare', async (req, res) => {
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

  try {
    const initiator = await dbHelpers.getUserByPhone(initiatorPhone);

    if (!initiator) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if partner exists, if not create them
    let partner = await dbHelpers.getUserByPhone(partnerPhone);
    if (!partner) {
      partner = await dbHelpers.createUser(partnerPhone);
    }

    // Check for existing relationships
    const existingRel = await dbHelpers.getRelationship(initiator.id, partner.id);

    if (existingRel && existingRel.status === 'confirmed') {
      return res.status(409).json({ 
        error: 'A confirmed relationship already exists' 
      });
    }

    if (existingRel && existingRel.status === 'pending') {
      return res.status(409).json({ 
        error: 'A pending relationship request already exists' 
      });
    }

    // Create new relationship
    const relationship = await dbHelpers.createRelationship(initiator.id, partner.id);

    res.json({ 
      message: 'Relationship declaration sent',
      relationshipId: relationship.id,
      status: relationship.status
    });
  } catch (error) {
    console.error('Declare relationship error:', error);
    res.status(500).json({ error: 'Failed to declare relationship' });
  }
});

// Approve relationship
app.post('/api/relationships/approve', async (req, res) => {
  const { partnerPhone, relationshipId } = req.body;

  if (!partnerPhone || !relationshipId) {
    return res.status(400).json({ error: 'Partner phone and relationship ID are required' });
  }

  try {
    const partner = await dbHelpers.getUserByPhone(partnerPhone);
    
    if (!partner) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [relationships] = await pool.execute(
      'SELECT * FROM relationships WHERE id = ?',
      [relationshipId]
    );

    if (relationships.length === 0) {
      return res.status(404).json({ error: 'Relationship request not found' });
    }

    const relationship = relationships[0];

    if (relationship.user2_id !== partner.id && relationship.user1_id !== partner.id) {
      return res.status(403).json({ error: 'Unauthorized to approve this request' });
    }

    if (relationship.status === 'confirmed') {
      return res.status(400).json({ error: 'Relationship already confirmed' });
    }

    await dbHelpers.updateRelationshipStatus(relationshipId, 'confirmed');

    res.json({ 
      message: 'Relationship verified successfully',
      relationshipId: relationshipId
    });
  } catch (error) {
    console.error('Approve relationship error:', error);
    res.status(500).json({ error: 'Failed to approve relationship' });
  }
});

// Get user relationships
app.get('/api/relationships/:phone', async (req, res) => {
  const { phone } = req.params;
  
  try {
    const user = await dbHelpers.getUserByPhone(phone);
    
    if (!user) {
      return res.json({ relationships: [] });
    }

    const [relationships] = await pool.execute(
      `SELECT r.*, 
              u1.phone as user1_phone, u1.username as user1_name,
              u2.phone as user2_phone, u2.username as user2_name
       FROM relationships r
       JOIN users u1 ON r.user1_id = u1.id
       JOIN users u2 ON r.user2_id = u2.id
       WHERE r.user1_id = ? OR r.user2_id = ?
       ORDER BY r.created_at DESC`,
      [user.id, user.id]
    );

    res.json({ relationships });
  } catch (error) {
    console.error('Get relationships error:', error);
    res.status(500).json({ error: 'Failed to get relationships' });
  }
});

// Update relationship privacy
app.patch('/api/relationships/:relationshipId/privacy', async (req, res) => {
  const { relationshipId } = req.params;
  const { isPublic, userPhone } = req.body;

  try {
    const user = await dbHelpers.getUserByPhone(userPhone);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [relationships] = await pool.execute(
      'SELECT * FROM relationships WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
      [relationshipId, user.id, user.id]
    );

    if (relationships.length === 0) {
      return res.status(404).json({ error: 'Relationship not found or unauthorized' });
    }

    await pool.execute(
      'UPDATE relationships SET is_public = ? WHERE id = ?',
      [isPublic ? 1 : 0, relationshipId]
    );

    res.json({ 
      message: 'Privacy settings updated',
      isPublic: isPublic
    });
  } catch (error) {
    console.error('Update privacy error:', error);
    res.status(500).json({ error: 'Failed to update privacy' });
  }
});

// Register Wild Guess routes
app.use('/api/wild-guess', wildGuessRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Heart Buddy API is running',
    database: 'MySQL',
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
