const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:     { type: String, required: true, minlength: 6 },
  role:         { type: String, enum: ['donor', 'ngo', 'volunteer', 'admin'], required: true },
  organization: { type: String, default: '' },
  phone:        { type: String, default: '' },
  location: {
    type:        { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [77.2090, 28.6139] },
    city:        { type: String, default: 'Delhi' },
  },
  stats: {
    totalMealsDonated: { type: Number, default: 0 },
    totalMealsClaimed: { type: Number, default: 0 },
    co2Saved:          { type: Number, default: 0 },
  },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

// Sparse index — skips docs without valid coordinates (fixes geo crash)
UserSchema.index({ location: '2dsphere' }, { sparse: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', UserSchema);
