# Deploy from GitHub to Vercel (Easiest Method)

Deploy your Budget Tracker directly from your GitHub repo with automatic deployments on every push.

---

## ✅ What You Have Ready

- ✅ Vercel account
- ✅ GitHub repo: `https://github.com/shini-1/budget-tracker.git`
- ✅ MongoDB Atlas cluster
- ✅ All code ready to deploy

---

## Step 1: Push Your Code to GitHub

First, make sure all your code is in the GitHub repository:

```powershell
cd c:\Users\Shini\Desktop\budget-tracker

# Check git status
git status

# Add all files
git add .

# Commit
git commit -m "Initial budget tracker setup"

# Push to GitHub (if not already done)
git push origin main
```

If you get an error about the remote, set it up:

```powershell
git remote add origin https://github.com/shini-1/budget-tracker.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend API to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Paste: `https://github.com/shini-1/budget-tracker.git`
5. Click **"Continue"**
6. Vercel shows your repo. Click **"Import"**
7. Configure:
   - **Project Name:** `budget-tracker-api`
   - **Framework Preset:** `Other` (Node.js)
   - **Root Directory:** `./server`
   - **Build Command:** `npm install` (leave as is)
   - **Output Directory:** `.` (leave as is)
   - **Install Command:** `npm install`

8. Click **"Environment Variables"** section
9. Add three variables:
   - **Name:** `MONGODB_URI`
     **Value:** Your MongoDB connection string (from MongoDB Atlas)
   - **Name:** `JWT_SECRET`
     **Value:** Your JWT secret (or generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - **Name:** `NODE_ENV`
     **Value:** `production`

10. Click **"Deploy"**
11. Wait 2-3 minutes for deployment
12. **Copy your API URL** (e.g., `https://budget-tracker-api.vercel.app`)

---

## Step 3: Deploy Frontend to Vercel

### Option A: Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select the same repo: `budget-tracker` (should appear in "Recent")
5. Configure:
   - **Project Name:** `budget-tracker`
   - **Framework:** `Create React App`
   - **Root Directory:** `./client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

6. Click **"Environment Variables"**
7. Add one variable:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://budget-tracker-4mibt2obl-shinis-projects-5bd09239.vercel.app/api` (from Step 2)

8. Click **"Deploy"**
9. Wait for deployment (2-3 minutes)
10. **Your app is now live!** Click the link to visit it

---

## Step 4: Update Your Code with API URL

Update `client/.env.production` with your backend API URL:

```bash
REACT_APP_API_URL=https://budget-tracker-4mibt2obl-shinis-projects-5bd09239.vercel.app/api
```

Then push to GitHub:

```powershell
cd c:\Users\Shini\Desktop\budget-tracker
git add client/.env.production
git commit -m "Add production API URL"
git push origin main
```

This will automatically trigger redeployment on Vercel!

---

## Step 5: Test Your App

1. Visit your frontend URL (e.g., `https://budget-tracker.vercel.app`)
2. Test these features:
   - [ ] Page loads
   - [ ] Can create account
   - [ ] Can login
   - [ ] Can add transaction
   - [ ] Can create budget
   - [ ] Dashboard shows data
   - [ ] Charts work

---

## ✅ Your Deployed URLs

| Component | URL |
|-----------|-----|
| **Frontend** | https://budget-tracker.vercel.app |
| **Backend API** | https://budget-tracker-api.vercel.app |
| **GitHub Repo** | https://github.com/shini-1/budget-tracker |

---

## 🔄 Automatic Deployments Enabled

Every time you push to GitHub:

```powershell
git add .
git commit -m "Your message"
git push origin main
```

Vercel automatically deploys both frontend and backend! 🚀

---

## 📝 Update Environment Variables Later

If you need to change environment variables:

1. Go to https://vercel.com/dashboard
2. Select the project
3. Go to **Settings** → **Environment Variables**
4. Update the value
5. Click **"Redeploy"** in the Deployments tab

---

## 🔧 View Logs & Troubleshoot

### View Deployment Logs

```powershell
# Install Vercel CLI (if not already installed)
npm install -g vercel

# View logs
vercel logs https://budget-tracker-api.vercel.app --tail
vercel logs https://budget-tracker.vercel.app --tail
```

### Check Deployment Status

1. Go to https://vercel.com/dashboard
2. Click on the project
3. Go to **Deployments** tab
4. Click on latest deployment to see logs

### Fix CORS Issues

If frontend can't reach backend, update `server/server.js`:

```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://budget-tracker.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

Then:

```powershell
git add server/server.js
git commit -m "Update CORS for production"
git push origin main
```

---

## 📋 Checklist

- [ ] Code pushed to GitHub
- [ ] Backend API deployed to Vercel
- [ ] `MONGODB_URI` added to backend environment
- [ ] `JWT_SECRET` added to backend environment
- [ ] Frontend deployed to Vercel
- [ ] `REACT_APP_API_URL` added to frontend environment
- [ ] Frontend environment file has correct API URL
- [ ] Tested signup, login, and data features
- [ ] Automatic deployments working (push to GitHub triggers deploy)

---

## 🎉 You're Done!

Your Budget Tracker is now **live and automatically deploying from GitHub!**

**No payment required.** Vercel free tier gives you:
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Free tier generously supports hobby projects
- ✅ Auto-scaling

Share your app: **https://budget-tracker.vercel.app**

---

## Quick Commands

```powershell
# Push code to trigger auto-deploy
git push origin main

# View backend logs
vercel logs https://budget-tracker-api.vercel.app --tail

# View frontend logs
vercel logs https://budget-tracker.vercel.app --tail

# List all projects
vercel list
```

Enjoy your live app! 🚀
