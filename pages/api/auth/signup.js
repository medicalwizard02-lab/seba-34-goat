const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const dbPath = path.join('/tmp', 'database.json');

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

  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
      console.log('Creating new database');
    }
  }

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

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { phone } = req.body || {};

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
        id: user.id,
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

  return res.json({
    message: 'Account created successfully',
    user: {
      id: newUser.id,
      phone: newUser.phone,
      freeChecksRemaining: newUser.free_checks_remaining
    }
  });
}
