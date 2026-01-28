# Heroku Deployment Setup Guide

Your MongoDB Atlas is now connected and verified (all tests passing!). Now let's deploy your backend to Heroku.

## Prerequisites

- MongoDB Atlas configured ✅
- Heroku account (free)
- Git installed
- GitHub repository with your code

## Step 1: Create Heroku Account

1. Go to [Heroku.com](https://www.heroku.com)
2. Click **"Sign Up"**
3. Enter your email and password
4. Complete email verification

## Step 2: Install Heroku CLI

### Windows
```powershell
# Install using chocolatey (if installed)
choco install heroku-cli

# Or download from:
# https://devcenter.heroku.com/articles/heroku-cli
# and run the installer
```

### Verify Installation
```bash
heroku --version
heroku login
```

## Step 3: Login to Heroku

```bash
heroku login
# Opens browser to login
# After logging in, you'll see: "Logged in as your-email@example.com"
```

## Step 4: Create Heroku App

### Option A: Using Heroku CLI (Recommended)

```bash
cd c:\Users\Shini\Desktop\budget-tracker\server

# Create app with unique name
heroku create budget-tracker-api-yourname

# Or create with auto-generated name
heroku create
```

### Option B: Using Heroku Dashboard

1. Go to https://dashboard.heroku.com/apps
2. Click **"New"** → **"Create new app"**
3. App name: `budget-tracker-api-yourname` (must be unique)
4. Region: Select your region
5. Click **"Create app"**

**Note:** Your app URL will be `https://budget-tracker-api-yourname.herokuapp.com`

## Step 5: Set Environment Variables in Heroku

These variables must match your `.env` file.

### Using Heroku CLI
```bash
cd c:\Users\Shini\Desktop\budget-tracker\server

heroku config:set MONGO_URI="mongodb+srv://budget-tracker-user:shinigami0819@cluster0.gbsq8qj.mongodb.net/budget-tracker?retryWrites=true&w=majority"

heroku config:set JWT_SECRET="generate-a-very-secure-random-string-here-min-32-chars"

heroku config:set NODE_ENV="production"

heroku config:set PORT="5000"
```

### Verify Variables Set
```bash
heroku config
```

You should see all 4 variables listed.

### Using Heroku Dashboard

1. Go to https://dashboard.heroku.com/apps
2. Select your app: `budget-tracker-api-yourname`
3. Go to **Settings**
4. Click **"Reveal Config Vars"**
5. Add these key-value pairs:
   - Key: `MONGO_URI` → Value: `mongodb+srv://budget-tracker-user:shinigami0819@cluster0.gbsq8qj.mongodb.net/budget-tracker?retryWrites=true&w=majority`
   - Key: `JWT_SECRET` → Value: `your-secure-secret-key`
   - Key: `NODE_ENV` → Value: `production`
   - Key: `PORT` → Value: `5000`

## Step 6: Deploy to Heroku

### Option A: Deploy Using Git (Recommended)

```bash
cd c:\Users\Shini\Desktop\budget-tracker

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Add Heroku remote
cd server
heroku git:remote -a budget-tracker-api-yourname

# Deploy
git push heroku main
```

### Option B: Deploy Using GitHub Integration

1. Push code to GitHub first:
```bash
cd c:\Users\Shini\Desktop\budget-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/budget-tracker.git
git push -u origin main
```

2. In Heroku Dashboard:
   - Go to your app
   - Click **"Deploy"** tab
   - Select **"GitHub"** as deployment method
   - Search for your repository
   - Click **"Connect"**
   - Enable automatic deployments from `main` branch

## Step 7: Monitor Deployment

### Watch Logs
```bash
heroku logs --tail -a budget-tracker-api-yourname
```

Look for these messages:
- `Server running on port 5000`
- MongoDB connection successful
- No error messages

### Check Deployment Status
```bash
# See if app is running
heroku open -a budget-tracker-api-yourname

# Or manually visit:
# https://budget-tracker-api-yourname.herokuapp.com/api/dashboard
```

## Step 8: Test Backend Deployment

### Test Health Check
```bash
# In PowerShell
$headers = @{"Content-Type" = "application/json"}
$uri = "https://budget-tracker-api-yourname.herokuapp.com/api/dashboard"
Invoke-WebRequest -Uri $uri -Headers $headers

# Expected response: 401 error (no token) - but proves API is running
```

### Test Signup Endpoint
```bash
$uri = "https://budget-tracker-api-yourname.herokuapp.com/api/auth/signup"
$body = @{
    email = "test@example.com"
    password = "testpassword123"
    name = "Test User"
} | ConvertTo-Json

Invoke-WebRequest -Uri $uri -Method Post -Headers @{"Content-Type" = "application/json"} -Body $body
```

## Troubleshooting

### App Crashes Immediately
```bash
# Check logs
heroku logs --tail -a budget-tracker-api-yourname

# Check if Procfile is correct
cat Procfile
# Should contain: web: node server.js
```

### Connection to MongoDB Fails
- Verify `MONGO_URI` in config vars: `heroku config -a budget-tracker-api-yourname`
- Check MongoDB Atlas allows Heroku IPs:
  - Go to MongoDB Atlas → Network Access
  - Add `0.0.0.0/0` temporarily for testing
  - Or add Heroku's IP range

### "Cannot find module" Errors
```bash
# Ensure dependencies installed
heroku run npm install -a budget-tracker-api-yourname

# View installed packages
heroku run npm list -a budget-tracker-api-yourname
```

### "Port already in use"
- Check `PORT` environment variable is set to `5000`
- Heroku assigns a port automatically via `process.env.PORT`

## Useful Heroku Commands

```bash
# View all apps
heroku apps

# View app info
heroku info -a budget-tracker-api-yourname

# View logs
heroku logs --tail -a budget-tracker-api-yourname

# Run a one-off command
heroku run npm test -a budget-tracker-api-yourname

# See all config variables
heroku config -a budget-tracker-api-yourname

# Add/update config variable
heroku config:set KEY=value -a budget-tracker-api-yourname

# Delete app
heroku apps:destroy --app budget-tracker-api-yourname

# Check dyno status
heroku ps -a budget-tracker-api-yourname
```

## Your Heroku Backend Details

After deployment, save these:

- **App Name:** budget-tracker-api-yourname
- **App URL:** https://budget-tracker-api-yourname.herokuapp.com
- **API Base URL:** https://budget-tracker-api-yourname.herokuapp.com/api
- **Log Command:** `heroku logs --tail -a budget-tracker-api-yourname`

## Next Steps

Once backend is deployed and tested:
1. Save your backend URL
2. Proceed to deploy frontend on Vercel
3. Update `REACT_APP_API_URL` to your Heroku URL
4. Test full integration

## Free Dyno Sleep

Note: Heroku free tier dynos sleep after 30 minutes of inactivity. This is normal behavior for free accounts.

If you need always-on:
- Upgrade to paid dyno ($7/month)
- Or use a free monitoring service like UptimeRobot

Congratulations! Your backend is ready for deployment! 🚀
