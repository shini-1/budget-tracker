# Heroku Deployment - Quick Start Guide

Your MongoDB Atlas is ✅ **connected and verified** (all tests passing)!

Git is ✅ **ready** with your code committed!

Now we need to install Heroku CLI and deploy.

## Step 1: Install Heroku CLI

### Windows - Download Installer (Easiest)

1. Go to https://devcenter.heroku.com/articles/heroku-cli
2. Download the Windows installer (64-bit)
3. Run the installer and follow prompts
4. **Restart your terminal/PowerShell** after installation
5. Verify installation:
   ```powershell
   heroku --version
   ```

### Windows - Alternative (Using Chocolatey)

If you have Chocolatey installed:
```powershell
choco install heroku-cli
```

### Windows - Using npm

```powershell
npm install -g heroku
```

## Step 2: After Installing Heroku CLI

Close and reopen PowerShell, then run:

```powershell
# Login to Heroku (opens browser)
heroku login

# Verify you're logged in
heroku auth:whoami
```

## Step 3: Create Heroku App

```powershell
cd c:\Users\Shini\Desktop\budget-tracker\server

# Create new Heroku app with unique name
heroku create budget-tracker-api-demo

# Note: Replace "demo" with something unique (your name, date, etc.)
# Example: budget-tracker-api-shini, budget-tracker-api-2026, etc.
```

Save your app name: **_______________________**

## Step 4: Set Environment Variables

Replace `budget-tracker-api-demo` with your actual app name:

```powershell
# Set MongoDB Atlas connection string
heroku config:set MONGO_URI="mongodb+srv://budget-tracker-user:shinigami0819@cluster0.gbsq8qj.mongodb.net/budget-tracker?retryWrites=true&w=majority" --app budget-tracker-api-demo

# Set JWT secret (use a strong random string)
heroku config:set JWT_SECRET="super-secret-key-min-32-characters-long-12345678901234567890" --app budget-tracker-api-demo

# Set environment to production
heroku config:set NODE_ENV="production" --app budget-tracker-api-demo

# Verify variables
heroku config --app budget-tracker-api-demo
```

## Step 5: Deploy to Heroku

```powershell
cd c:\Users\Shini\Desktop\budget-tracker

# Add Heroku as remote (replace with your app name)
heroku git:remote -a budget-tracker-api-demo

# Deploy your server code
git push heroku main
```

**This will:**
- Upload your code to Heroku
- Install dependencies (npm install)
- Start your server
- Connect to MongoDB Atlas

## Step 6: Monitor Deployment

```powershell
# Watch deployment logs in real-time
heroku logs --tail --app budget-tracker-api-demo

# Stop watching: Press Ctrl+C
```

Look for these messages:
- `installed X packages`
- `Server running on port 5000`
- No error messages

## Step 7: Test Backend

```powershell
# Open your app in browser
heroku open --app budget-tracker-api-demo

# Or visit manually:
https://budget-tracker-api-demo.herokuapp.com/api/dashboard
# (You'll get 401 error - that's OK, means API is working)

# Test signup
$uri = "https://budget-tracker-api-demo.herokuapp.com/api/auth/signup"
$body = @{
    email = "test@example.com"
    password = "test123"
    name = "Test User"
} | ConvertTo-Json

$headers = @{"Content-Type" = "application/json"}
Invoke-WebRequest -Uri $uri -Method Post -Body $body -Headers $headers
```

## Your Deployed Backend URL

After successful deployment:

- **Heroku App Name:** budget-tracker-api-demo
- **Heroku App URL:** https://budget-tracker-api-demo.herokuapp.com
- **API Base URL:** https://budget-tracker-api-demo.herokuapp.com/api

## Common Issues & Solutions

### "heroku: command not found"
- Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
- **Restart PowerShell after installation**

### "Not authenticated"
```powershell
heroku logout
heroku login
```

### Deployment fails with "Cannot find module"
```powershell
heroku run npm install --app budget-tracker-api-demo
```

### "Connection timeout" to MongoDB
- Check MongoDB Atlas Network Access allows Heroku
- In MongoDB Atlas → Network Access → Add `0.0.0.0/0`

### "Dyno crashed"
```powershell
# Check logs
heroku logs --tail --app budget-tracker-api-demo

# Restart dyno
heroku restart --app budget-tracker-api-demo
```

## Next Steps

Once backend is deployed and tested:

1. ✅ Note your Heroku API URL: `https://budget-tracker-api-demo.herokuapp.com/api`
2. Create Vercel account
3. Deploy frontend with that backend URL
4. Test full integration

## Useful Commands

```powershell
# View all your apps
heroku apps

# View specific app info
heroku info --app budget-tracker-api-demo

# View logs (live)
heroku logs --tail --app budget-tracker-api-demo

# View logs (last 50 lines)
heroku logs -n 50 --app budget-tracker-api-demo

# Check dyno status
heroku ps --app budget-tracker-api-demo

# Add another config variable
heroku config:set KEY=value --app budget-tracker-api-demo

# View all config variables
heroku config --app budget-tracker-api-demo

# Restart app
heroku restart --app budget-tracker-api-demo

# Run one-off command
heroku run npm test --app budget-tracker-api-demo
```

## Important Notes

- **Free tier limits:** 512MB RAM, dyno sleeps after 30 min of inactivity
- **No automatic backups** on free tier (backup MongoDB manually)
- **Paid tiers start at $7/month** for always-on dyno

---

**Ready to deploy?**

1. Install Heroku CLI (if not done)
2. Run the commands in Step 2-5 above
3. Monitor logs with Step 6
4. Test with Step 7
5. Save your backend URL for frontend deployment

Need help? Refer to [HEROKU_SETUP.md](HEROKU_SETUP.md) for detailed instructions.
