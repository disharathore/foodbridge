# Deployment Guide — FoodBridge

## Step 1: Push to GitHub

```bash
# Inside your foodbridge folder
git init
git add .
git commit -m "Initial commit: FoodBridge full-stack food rescue platform"

# Go to github.com → New repository → name: foodbridge → Create
# Then:
git remote add origin https://github.com/disharathore/foodbridge.git
git branch -M main
git push -u origin main
```

**Make 3-4 meaningful commits instead of one — looks better:**
```bash
# After git init, do it in stages:
git add server/
git commit -m "feat: Node.js + Express backend with JWT auth and MongoDB"

git add client/src/context/ client/src/hooks/
git commit -m "feat: real-time WebSocket integration with Socket.io rooms per city"

git add client/src/
git commit -m "feat: React frontend with role-based donor/NGO/volunteer flows"

git add .
git commit -m "feat: security hardening — helmet, rate limiting, input validation"
git push -u origin main
```

---

## Step 2: Deploy Backend to Render (free)

1. Go to **render.com** → Sign up with GitHub
2. New → Web Service → Connect your `foodbridge` repo
3. Settings:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment: Node
4. Add environment variables:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = your secret
   - `CLIENT_URL` = https://your-app.vercel.app (add after step 3)
5. Deploy → copy the URL: `https://foodbridge-server.onrender.com`

---

## Step 3: Deploy Frontend to Vercel (free)

1. Go to **vercel.com** → Sign up with GitHub
2. New Project → Import `foodbridge` repo
3. Settings:
   - Root directory: `client`
   - Framework: Create React App (auto-detected)
4. Add environment variable:
   - `REACT_APP_SERVER_URL` = https://foodbridge-server.onrender.com
5. Deploy → copy the URL: `https://foodbridge-client.vercel.app`

---

## Step 4: Update CORS

Go back to Render → your backend service → Environment:
- Set `CLIENT_URL` = `https://foodbridge-client.vercel.app`
- Redeploy

---

## Step 5: Update README

Replace the placeholder URLs in README.md with your real Vercel and Render URLs.

```bash
git add README.md
git commit -m "docs: add live demo links"
git push
```

Done! Share the Vercel URL in your application email.
