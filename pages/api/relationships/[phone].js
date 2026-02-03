const dbHelpers = require('../../../config/dbHelpers');

/**
 * Get relationships for a phone number
 * GET /api/relationships/[phone]
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const relationships = await dbHelpers.getUserRelationships(phone);

    res.json({ relationships });
  } catch (error) {
    console.error('Error fetching relationships:', error);
    res.status(500).json({ error: 'Failed to fetch relationships' });
  }
}
