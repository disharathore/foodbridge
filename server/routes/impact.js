const router = require('express').Router();
const Listing = require('../models/Listing');

// GET /api/impact/hourly
router.get('/hourly', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const data = await Listing.aggregate([
      { $match: { status: 'delivered', deliveredAt: { $gte: today } } },
      { $group: { _id: { $hour: '$deliveredAt' }, meals: { $sum: '$portions' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { hour: '$_id', meals: 1, count: 1, _id: 0 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/impact/weekly
router.get('/weekly', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const data = await Listing.aggregate([
      { $match: { status: 'delivered', deliveredAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$deliveredAt' } }, meals: { $sum: '$portions' } } },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', meals: 1, _id: 0 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/impact/categories
router.get('/categories', async (req, res) => {
  try {
    const data = await Listing.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: '$foodType', meals: { $sum: '$portions' } } },
      { $sort: { meals: -1 } },
      { $project: { foodType: '$_id', meals: 1, _id: 0 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
