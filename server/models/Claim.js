const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['claimed', 'picked_up', 'delivered'],
    default: 'claimed',
  },
  pickupRoute: {
    distance: Number,      // km
    duration: Number,      // minutes
    polyline: String,      // encoded Google Maps route
  },
  pickedUpAt: Date,
  deliveredAt: Date,
  proofImage: String,
}, { timestamps: true });

module.exports = mongoose.model('Claim', ClaimSchema);
