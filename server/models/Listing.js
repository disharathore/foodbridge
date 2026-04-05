const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantName: { type: String, required: true },
  foodType: {
    type: String,
    enum: ['main_course', 'bread', 'dessert', 'salad', 'beverage', 'other'],
    required: true,
  },
  description: String,
  portions: { type: Number, required: true, min: 1 },
  expiresAt: { type: Date, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],   // [lng, lat]
    address: String,
    city: String,
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'in_transit', 'delivered', 'expired'],
    default: 'available',
  },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimedAt: Date,
  deliveredAt: Date,
  images: [String],
}, { timestamps: true });

ListingSchema.index({ location: '2dsphere' });
ListingSchema.index({ status: 1, expiresAt: 1 });

module.exports = mongoose.model('Listing', ListingSchema);
