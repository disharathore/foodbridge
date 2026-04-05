const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// ── Fix #5: Validate required env vars at boot ───────────────────────────────
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
  console.error('   Create server/.env with these values set.');
  process.exit(1);
}
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI.includes('<password>') || MONGO_URI.includes('xxxxx')) {
  console.error('❌ MONGO_URI still has placeholder values. Update server/.env');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || '*' } });

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

// ── Rate limiting ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests from this IP. Try again in 15 minutes.' },
});
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Slow down.' },
});
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/listings', require('./routes/listings'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/impact',   require('./routes/impact'));
app.use('/api/ngos',     require('./routes/ngos'));

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Fix #6: MongoDB with explicit TLS ───────────────────────────────────────
const Listing = require('./models/Listing');

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  tls: true,                    // explicit TLS — Atlas requires this
})
  .then(async () => {
    console.log('✅ MongoDB connected successfully');

    // Drop old non-sparse geo index (one-time fix)
    try {
      const indexes = await mongoose.connection.db.collection('users').indexes();
      const bad = indexes.find(i => i.key?.location === '2dsphere' && !i.sparse);
      if (bad) {
        await mongoose.connection.db.collection('users').dropIndex(bad.name);
        console.log('✅ Cleaned up old geo index');
      }
    } catch (_) {}

    // Sync all model indexes
    await Promise.all(
      Object.values(mongoose.models).map(m => m.syncIndexes())
    ).catch(() => {});

    // ── Fix #1: Expired listings cron job ─────────────────────────────────
    const expireListings = async () => {
      try {
        const result = await Listing.updateMany(
          { status: 'available', expiresAt: { $lt: new Date() } },
          { $set: { status: 'expired' } }
        );
        if (result.modifiedCount > 0) {
          console.log(`⏰ Expired ${result.modifiedCount} listing(s)`);
        }
      } catch (err) {
        console.error('Cron error:', err.message);
      }
    };

    // Run immediately on startup, then every 5 minutes
    expireListings();
    setInterval(expireListings, 5 * 60 * 1000);
    console.log('✅ Listing expiry cron job started (every 5 min)');
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── Socket.io — real-time events ─────────────────────────────────────────────
io.on('connection', (socket) => {
  socket.on('join:city', (city) => socket.join(city));
  socket.on('listing:new',       (data) => io.to(data.city).emit('listing:created',   data));
  socket.on('listing:claim',     (data) => io.to(data.city).emit('listing:claimed',   data));
  socket.on('listing:pickup',    (data) => io.to(data.city).emit('listing:in_transit',data));
  socket.on('listing:delivered', (data) => {
    io.to(data.city).emit('listing:completed', data);
    io.to(data.city).emit('metrics:update', { mealsAdded: data.portions });
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 FoodBridge server running on port ${PORT}`));
