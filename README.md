# FoodBridge 🍛
> Real-time food surplus rescue platform — built for **Feeding India by Zomato**

**Live Demo:** [foodbridge-client.vercel.app](https://foodbridgezomato.netlify.app) ← add your URL here  
**Backend API:** [foodbridge-server.onrender.com](https://foodbridge-fqcd.onrender.com/) ← add your URL here

---

## What it does

India wastes 40% of its food annually while 194 million people face food insecurity. FoodBridge fixes this by connecting restaurants with surplus food directly to NGOs and volunteers — in **real time**, in under 20 minutes.

- 🍱 **Donors** (restaurants/hotels) post surplus food in 60 seconds
- 🔔 **NGOs** receive instant WebSocket alerts and claim listings
- 🚗 **Volunteers** pick up and deliver — full lifecycle tracked
- 📊 **Impact dashboard** — meals saved, CO₂ offset, leaderboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Context API, custom hooks, Socket.io-client |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB Atlas with 2dsphere geospatial indexing |
| Auth | JWT with role-based access (donor / NGO / volunteer / admin) |
| Security | Helmet.js, express-rate-limit, express-validator |
| Real-time | WebSocket rooms scoped per city |
| Deployment | Vercel (client) + Render (server) + MongoDB Atlas |

---

## Key Engineering Decisions

**Atomic claim — no race conditions**  
`findOneAndUpdate` with `{ status: 'available' }` in the filter makes claiming a listing atomic. Two NGOs cannot claim the same listing simultaneously — the second request gets a 400.

**WebSocket rooms per city**  
Each city is a Socket.io room. Delhi listings only broadcast to Delhi clients. This scales cleanly — a Mumbai NGO never receives Bangalore updates.

**Geospatial NGO matching**  
MongoDB `$near` with `2dsphere` index finds the nearest surplus within a configurable radius in milliseconds — the same technology powering Zomato's restaurant proximity.

**Expiry cron job**  
`setInterval` runs every 5 minutes and batch-expires listings past their `expiresAt` window using `updateMany` — no stale "available" listings.

**JWT expiry on client**  
`atob` decodes the JWT payload client-side on every auth call. Expired tokens are cleared immediately — users get a clean logout instead of silent 401 errors.

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free M0 tier)

### 1. Clone
```bash
git clone https://github.com/disharathore/foodbridge.git
cd foodbridge
```

### 2. Backend
```bash
cd server
npm install
# Create server/.env:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/foodbridge?retryWrites=true&w=majority
# JWT_SECRET=your_secret_here
# PORT=5001
npm start
```

### 3. Frontend
```bash
cd client
npm install
# Create client/.env:
# REACT_APP_SERVER_URL=http://localhost:5001
npm start
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Register with role |
| POST | /api/auth/login | — | Get JWT token |
| GET | /api/listings?city=Delhi | — | Paginated listings |
| POST | /api/listings | donor | Create listing |
| PATCH | /api/listings/:id/claim | ngo | Atomic claim |
| PATCH | /api/listings/:id/status | volunteer | Update lifecycle |
| GET | /api/listings/stats/summary | — | Live impact metrics |
| GET | /api/impact/weekly | — | 7-day chart data |
| GET | /api/impact/categories | — | Food type breakdown |
| GET | /api/ngos/leaderboard | — | Top donors |

## Socket Events

| Event | Direction | Description |
|---|---|---|
| join:city | C→S | Subscribe to city room |
| listing:new | C→S | Donor posts surplus |
| listing:created | S→C | Broadcast to city |
| listing:claim | C→S | NGO claims |
| listing:claimed | S→C | Broadcast claim |
| listing:delivered | C→S | Mark delivered |
| metrics:update | S→C | Live impact update |

---

Built by **Disha Rathore** · IGDTUW · [@disharathore](https://github.com/disharathore)
