const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const Claim   = require('../models/Claim');   // Fix #7: actually use Claim model
const User    = require('../models/User');
const auth    = require('../middleware/auth');

// GET /api/listings — paginated + geo/city filter
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 10000, city, status = 'available', page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Only filter expiry for available — claimed/in_transit/delivered always show
    const activeStatuses = ['claimed', 'in_transit', 'delivered'];
    let filter = activeStatuses.includes(status)
      ? { status }
      : { status, expiresAt: { $gt: new Date() } };

    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      };
    } else if (city) {
      filter['location.city'] = city;
    }

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('donor', 'name organization')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Listing.countDocuments(filter),
    ]);

    res.json({ listings, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/listings/stats/summary — before /:id
router.get('/stats/summary', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalDelivered, todayDelivered, activeNow, topDonors] = await Promise.all([
      Listing.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: null, meals: { $sum: '$portions' } } }]),
      Listing.aggregate([{ $match: { status: 'delivered', deliveredAt: { $gte: today } } }, { $group: { _id: null, meals: { $sum: '$portions' } } }]),
      Listing.countDocuments({ status: { $in: ['available', 'claimed', 'in_transit'] } }),
      User.find({ role: 'donor' }).sort({ 'stats.totalMealsDonated': -1 }).limit(5).select('name organization stats'),
    ]);

    res.json({
      totalMealsSaved: totalDelivered[0]?.meals || 0,
      mealsTodaySaved: todayDelivered[0]?.meals || 0,
      activeListings:  activeNow,
      co2Offset:       Math.round((totalDelivered[0]?.meals || 0) * 0.25),
      topDonors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('donor', 'name organization phone')
      .populate('claimedBy', 'name organization');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/listings — create with validation
const createRules = [
  body('restaurantName').trim().notEmpty().withMessage('Restaurant name is required'),
  body('foodType').isIn(['main_course','bread','dessert','salad','beverage','other']).withMessage('Invalid food type'),
  body('portions').isInt({ min: 1, max: 10000 }).withMessage('Portions must be between 1 and 10,000'),
  body('expiresAt').isISO8601().withMessage('Valid expiry date required'),
];

router.post('/', auth, createRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  try {
    const listing = await Listing.create({ ...req.body, donor: req.user._id });
    const populated = await listing.populate('donor', 'name organization');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/listings/:id/claim — atomic, no race conditions
router.patch('/:id/claim', auth, async (req, res) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, status: 'available' },
      { $set: { status: 'claimed', claimedBy: req.user._id, claimedAt: new Date() } },
      { new: true }
    ).populate('donor', 'name organization');

    if (!listing) return res.status(400).json({ error: 'Listing is no longer available' });

    // Fix #7: Write to Claim collection — track full claim lifecycle
    await Claim.create({
      listing:   listing._id,
      claimedBy: req.user._id,
      status:    'claimed',
    });

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/listings/:id/status — in_transit | delivered
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['in_transit', 'delivered', 'expired'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });

    const update = { status };
    if (status === 'in_transit') update.pickedUpAt  = new Date();
    if (status === 'delivered')  update.deliveredAt = new Date();

    const listing = await Listing.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // Fix #7: Update Claim record too
    const claimUpdate = { status: status === 'in_transit' ? 'picked_up' : 'delivered' };
    if (status === 'in_transit') claimUpdate.pickedUpAt  = new Date();
    if (status === 'delivered')  claimUpdate.deliveredAt = new Date();
    await Claim.findOneAndUpdate({ listing: listing._id }, { $set: claimUpdate });

    if (status === 'delivered') {
      await User.findByIdAndUpdate(listing.donor, {
        $inc: { 'stats.totalMealsDonated': listing.portions, 'stats.co2Saved': listing.portions * 0.25 },
      });
      if (listing.claimedBy) {
        await User.findByIdAndUpdate(listing.claimedBy, {
          $inc: { 'stats.totalMealsClaimed': listing.portions },
        });
      }
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
