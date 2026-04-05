const router = require('express').Router();
const User = require('../models/User');

// GET /api/ngos  — all verified NGOs, optionally filtered by location
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 20000 } = req.query;
    let query = { role: 'ngo', isVerified: true };

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      };
    }

    const ngos = await User.find(query).select('-password').limit(30);
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ngos/leaderboard  — top donors by meals
router.get('/leaderboard', async (req, res) => {
  try {
    const donors = await User.find({ role: 'donor' })
      .sort({ 'stats.totalMealsDonated': -1 })
      .limit(10)
      .select('name organization stats');
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
