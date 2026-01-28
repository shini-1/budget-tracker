# Complete Vercel Deployment Guide (Frontend + Backend)

Deploy your entire Budget Tracker app to Vercel with no payment required!

---

## 📋 Prerequisites

- Vercel account (free at https://vercel.com)
- GitHub account (recommended) or local git setup
- MongoDB Atlas cluster already set up ✅
- Node.js installed locally

---

## Part 1: Deploy Backend to Vercel (API)

### Step 1: Create `vercel.json` in Server Folder

Your server already has `app.yaml`. Create a `vercel.json` file in the server folder:

```powershell
cd c:\Users\Shini\Desktop\budget-tracker\server
```

Create file: `server/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret",
    "NODE_ENV": "production"
  }
}
```

### Step 2: Create API Routes Handler

Create `server/api/index.js`:

```javascript
const express = require('express');
const app = require('../server.js');

module.exports = app;
```

Wait, let me check your current server.js structure first to ensure compatibility:

### Step 3: Update `server.js` (If Needed)

Your `server.js` should export the app:

```javascript
// At the end of server.js, add:
module.exports = app;
```

### Step 4: Update `package.json` Scripts

Ensure your server's `package.json` has the correct start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

✅ Your package.json already has this!

### Step 5: Deploy Backend to Vercel

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Navigate to root of project
cd c:\Users\Shini\Desktop\budget-tracker

# Deploy
vercel

# When prompted:
# - "Set up and deploy?" → Y
# - "Which scope?" → Select your account
# - "Link to existing project?" → N
# - "What's your project name?" → budget-tracker-api
# - "In which directory is your code?" → ./server
# - "Want to override settings?" → Y
# - "Command to override" → npm start
# - "Output directory?" → Press Enter (or ./)
```

### Step 6: Add Environment Variables to Backend

After deployment, add your MongoDB and JWT secrets:

```powershell
# From project root
vercel env add MONGODB_URI
# Paste your MongoDB Atlas connection string

vercel env add JWT_SECRET
# Paste your JWT secret

vercel env add NODE_ENV
# Type: production
```

Or via Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select `budget-tracker-api` project
3. Settings → Environment Variables
4. Add:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `NODE_ENV`: `production`
5. **Redeploy** after adding variables

### Step 7: Redeploy with Environment Variables

```powershell
vercel --prod --yes
```

Your backend API is now live! Note the URL it gives you (e.g., `https://budget-tracker-api.vercel.app`)

---

## Part 2: Deploy Frontend to Vercel (React App)

### Step 1: Update Frontend Environment Variables

Create/update `client/.env.production`:

```bash
REACT_APP_API_URL=https://budget-tracker-api.vercel.app/api
```

Replace the URL with your actual Vercel backend URL from Part 1!

### Step 2: Deploy Frontend

```powershell
# Navigate to client folder
cd c:\Users\Shini\Desktop\budget-tracker\client

# If not already installed
npm install

# Deploy to Vercel
vercel

# When prompted:
# - "Set up and deploy?" → Y
# - "Which scope?" → Select your account
# - "Link to existing project?" → N
# - "What's your project name?" → budget-tracker
# - "In which directory is your code?" → ./ (current)
# - "Want to override settings?" → N
# - Deploy to production? → Y
```

### Step 3: Set Frontend Environment Variables

```powershell
# Add API URL to production environment
vercel env add REACT_APP_API_URL
# Paste your Vercel backend API URL (from Part 1)
```

Or via Dashboard:

1. Go to https://vercel.com/dashboard
2. Select `budget-tracker` project
3. Settings → Environment Variables
4. Add:
   - Name: `REACT_APP_API_URL`
   - Value: `https://budget-tracker-api.vercel.app/api`
   - Scope: Production, Preview, Development
5. **Redeploy**

### Step 4: Redeploy Frontend

```powershell
vercel --prod --yes
```

Your frontend is now live!

---

## ✅ Verify Deployment

### Test Frontend

1. Visit your frontend URL (e.g., `https://budget-tracker.vercel.app`)
2. Check:
   - [ ] Page loads
   - [ ] Signup form visible
   - [ ] Can create account
   - [ ] Can login
   - [ ] Can add transactions
   - [ ] Can create budgets
   - [ ] Dashboard loads
   - [ ] Charts display

### Test Backend API

```powershell
# Test health check
curl https://budget-tracker-api.vercel.app/api/health

# Should return: {"status": "OK"}
```

### Monitor Logs

```powershell
# Frontend logs
vercel logs https://budget-tracker.vercel.app

# Backend logs
vercel logs https://budget-tracker-api.vercel.app
```

---

## 🚀 Your Deployment Summary

| Component | Deployed To | URL |
|-----------|-------------|-----|
| **Frontend** | Vercel | `https://budget-tracker.vercel.app` |
| **Backend API** | Vercel | `https://budget-tracker-api.vercel.app` |
| **Database** | MongoDB Atlas | Your cluster |

---

## 📝 Important Notes

### Environment Variables

**Backend needs:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `NODE_ENV` - Set to `production`

**Frontend needs:**
- `REACT_APP_API_URL` - Your backend API URL

### CORS Configuration

Your backend should have CORS enabled. Check `server.js`:

```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://budget-tracker.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### Automatic Deployments

Enable auto-deploy on git push:

```powershell
# Link your GitHub repo
vercel link

# Enable git integration in Vercel Dashboard
# Settings → Git → "Deploy on push to main"
```

### Custom Domain (Optional)

To use your own domain:

1. In Vercel Dashboard → Settings → Domains
2. Enter your domain
3. Update DNS settings at your registrar
4. Vercel verifies and enables HTTPS

---

## 🔧 Troubleshooting

### Frontend shows blank page

```powershell
# Check browser console (F12) for errors
# Verify REACT_APP_API_URL is set correctly
# Try rebuilding locally
cd client
npm run build
```

### API calls fail with 404/500

```powershell
# Check backend logs
vercel logs https://budget-tracker-api.vercel.app

# Verify API routes
curl https://budget-tracker-api.vercel.app/api/health
```

### CORS errors in browser console

Update your backend `server.js` CORS configuration to include your Vercel frontend URL:

```javascript
app.use(cors({
  origin: ['https://budget-tracker.vercel.app'],
  credentials: true
}));
```

### Environment variables not loading

1. Verify they're set in Vercel Dashboard
2. Redeploy after adding variables: `vercel --prod`
3. Check variable names are correct

### "Cannot find module" errors

1. Ensure `package.json` has all dependencies
2. Rebuild: `npm install && npm run build`
3. Redeploy: `vercel --prod`

---

## 📊 Monitoring & Maintenance

### Check Deployment Status

```powershell
# View all deployments
vercel list

# View specific project
vercel list -p budget-tracker
```

### View Logs

```powershell
# Real-time logs
vercel logs https://budget-tracker-api.vercel.app --tail

# Frontend logs
vercel logs https://budget-tracker.vercel.app
```

### Redeploy Latest Version

```powershell
# Redeploy to production
vercel --prod

# Or from specific project directory
cd c:\Users\Shini\Desktop\budget-tracker\server
vercel --prod
```

---

## 🎉 You're Done!

Your Budget Tracker is now **live and free** on Vercel!

- ✅ No payment required
- ✅ Automatic HTTPS
- ✅ Auto-scaling
- ✅ Free tier includes plenty of usage
- ✅ Easy deployments from git push

**Share your app:** `https://budget-tracker.vercel.app`

---

## Quick Command Reference

```powershell
# Install Vercel globally
npm install -g vercel

# Deploy from scratch
vercel

# Redeploy to production
vercel --prod

# View logs
vercel logs <url> --tail

# Logout
vercel logout

# List deployments
vercel list
```

---

**Next:** Monitor your app and collect user feedback! 🚀
