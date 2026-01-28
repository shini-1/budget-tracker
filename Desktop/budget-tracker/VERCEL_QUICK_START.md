# Vercel Quick Start (5 Minutes)

**Skip Heroku payment issues entirely.** Deploy to Vercel for free.

---

## Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

---

## Step 2: Deploy Backend API

```powershell
# Go to root directory
cd c:\Users\Shini\Desktop\budget-tracker

# Deploy backend
vercel

# Answer prompts:
# - "Set up and deploy?" → Y
# - "Which scope?" → Your account
# - "Link to existing project?" → N
# - "Project name?" → budget-tracker-api
# - "Root directory?" → ./server
# - "Want to override?" → Y
# - "Build Command" → npm start
# - "Output directory" → ./
```

**Save the URL** it gives you (e.g., `https://budget-tracker-api.vercel.app`)

---

## Step 3: Add Environment Variables to Backend

```powershell
# Add MongoDB URI
vercel env add MONGODB_URI
# Paste your MongoDB connection string

# Add JWT Secret
vercel env add JWT_SECRET
# Paste your JWT secret

# Redeploy with environment variables
vercel --prod
```

Or use Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Click `budget-tracker-api` project
3. Settings → Environment Variables
4. Add `MONGODB_URI` and `JWT_SECRET`
5. Redeploy

---

## Step 4: Update Frontend Environment

Update `client/.env.production`:

```bash
REACT_APP_API_URL=https://budget-tracker-4mibt2obl-shinis-projects-5bd09239.vercel.app/api
```

Replace with your actual backend URL from Step 2!

---

## Step 5: Deploy Frontend

```powershell
# Deploy frontend
cd c:\Users\Shini\Desktop\budget-tracker\client
vercel

# Answer prompts:
# - "Set up and deploy?" → Y
# - "Which scope?" → Your account
# - "Link to existing project?" → N
# - "Project name?" → budget-tracker
# - "Root directory?" → ./
# - Override settings? → N
```

---

## Step 6: Redeploy Frontend with Environment Variable

```powershell
vercel env add REACT_APP_API_URL
# Paste your backend API URL

vercel --prod
```

---

## ✅ Done!

| What | URL |
|------|-----|
| **App** | https://budget-tracker.vercel.app |
| **API** | https://budget-tracker-api.vercel.app |
| **Dashboard** | https://vercel.com/dashboard |

---

## Test It

1. Visit https://budget-tracker.vercel.app
2. Sign up
3. Add transaction
4. Check if it works

---

## Commands Reference

```powershell
# Redeploy
vercel --prod

# View logs
vercel logs https://budget-tracker-api.vercel.app --tail

# List projects
vercel list

# Logout
vercel logout
```

**That's it! Your app is now live without paying anything!** 🎉
