# Deployment Commands - Copy & Paste Ready

## 🔍 IMPORTANT: First Check

Your setup is verified ✅:
- MongoDB Atlas: Connected
- Tests: All 41 passing
- Git: Committed and ready

## 🔧 STEP 1: Install Heroku CLI

**Source:** https://devcenter.heroku.com/articles/heroku-cli

Download Windows installer and run it. After installation, **restart PowerShell**.

Verify:
```powershell
heroku --version
```

---

## 🔐 STEP 2: Login to Heroku

```powershell
heroku login
```

Browser will open. Login with your Heroku account.

After login, verify:
```powershell
heroku auth:whoami
```

---

## 🏗️ STEP 3: Create Heroku App

```powershell
cd c:\Users\Shini\Desktop\budget-tracker\server
heroku create budget-tracker-api-demo
```

**⚠️ IMPORTANT:** Replace `budget-tracker-api-demo` with a UNIQUE name!
- Options: `budget-tracker-api-shini`, `budget-tracker-demo-2026`, etc.

**Save your app name:** ___________________________

---

## 🔑 STEP 4: Set Environment Variables

**Replace `budget-tracker-api-demo` with YOUR app name in all commands below:**

### Command 1: MongoDB Connection String
```powershell
heroku config:set MONGO_URI="mongodb+srv://budget-tracker-user:shinigami0819@cluster0.gbsq8qj.mongodb.net/budget-tracker?retryWrites=true&w=majority" --app budget-tracker-api-demo
```

### Command 2: JWT Secret
```powershell
heroku config:set JWT_SECRET="my-super-secret-jwt-key-min-32-characters-12345678901234" --app budget-tracker-api-demo
```

### Command 3: Node Environment
```powershell
heroku config:set NODE_ENV="production" --app budget-tracker-api-demo
```

### Verify All Variables Are Set
```powershell
heroku config --app budget-tracker-api-demo
```

You should see:
```
MONGO_URI:    mongodb+srv://...
JWT_SECRET:   my-super-secret...
NODE_ENV:     production
```

---

## 🚀 STEP 5: Deploy Your Backend

```powershell
cd c:\Users\Shini\Desktop\budget-tracker

# Add Heroku as remote
heroku git:remote -a budget-tracker-api-demo

# Deploy!
git push heroku main
```

This will:
1. Upload your code
2. Install dependencies
3. Start your server
4. Connect to MongoDB

---

## 👀 STEP 6: Monitor Deployment

```powershell
heroku logs --tail --app budget-tracker-api-demo
```

Look for:
- ✅ `installed X packages`
- ✅ `Server running on port 5000`
- ❌ No ERROR messages

Stop monitoring: Press `Ctrl+C`

---

## ✅ STEP 7: Test Your Backend

### Test 1: Open app in browser
```powershell
heroku open --app budget-tracker-api-demo
```

Or visit manually: `https://budget-tracker-api-demo.herokuapp.com`

### Test 2: Test API endpoint (should show 401 - that's OK!)
```powershell
$uri = "https://budget-tracker-api-demo.herokuapp.com/api/dashboard"
Invoke-WebRequest -Uri $uri
```

### Test 3: Test signup
```powershell
$uri = "https://budget-tracker-api-demo.herokuapp.com/api/auth/signup"
$body = @{
    email = "test@example.com"
    password = "test123456"
    name = "Test User"
} | ConvertTo-Json

$headers = @{"Content-Type" = "application/json"}
Invoke-WebRequest -Uri $uri -Method Post -Body $body -Headers $headers
```

If signup succeeds, you'll see a response with user data and token.

---

## 💾 Save Your Backend URL

After successful deployment, save this:

```
https://budget-tracker-api-demo.herokuapp.com/api
```

(Replace `budget-tracker-api-demo` with YOUR actual app name)

---

## 📱 NEXT: Deploy Frontend to Vercel

Once backend is confirmed working:

1. Create Vercel account: https://vercel.com
2. Update client `.env`:
   ```
   REACT_APP_API_URL=https://budget-tracker-api-demo.herokuapp.com/api
   ```
3. Deploy to Vercel (see VERCEL_DEPLOYMENT.md)

---

## 🔧 Useful Commands (Keep These!)

```powershell
# View logs
heroku logs --tail --app budget-tracker-api-demo

# View specific number of lines
heroku logs -n 50 --app budget-tracker-api-demo

# Check app status
heroku ps --app budget-tracker-api-demo

# Restart app
heroku restart --app budget-tracker-api-demo

# View all config variables
heroku config --app budget-tracker-api-demo

# Update a config variable
heroku config:set KEY=value --app budget-tracker-api-demo

# Remove app
heroku apps:destroy --app budget-tracker-api-demo

# Open app in browser
heroku open --app budget-tracker-api-demo

# View all your apps
heroku apps

# Check who you're logged in as
heroku auth:whoami
```

---

## ⚠️ Common Mistakes to Avoid

❌ **DON'T:** Commit `.env` file to git
```powershell
# If you did: git rm --cached server/.env
```

❌ **DON'T:** Use same app name as someone else
```
# App names must be GLOBALLY unique across all Heroku users
```

❌ **DON'T:** Forget to set environment variables
```
# Must set: MONGO_URI, JWT_SECRET, NODE_ENV
```

❌ **DON'T:** Deploy without testing locally first
```powershell
# Always run: npm test  # before deployment
```

---

## 🎯 Success Checklist

- [ ] Heroku CLI installed
- [ ] Logged in to Heroku: `heroku auth:whoami`
- [ ] App created: `heroku apps`
- [ ] Environment variables set: `heroku config`
- [ ] Code deployed: `git push heroku main`
- [ ] Logs show no errors: `heroku logs --tail`
- [ ] Signup endpoint works
- [ ] Backend URL saved

---

## 🆘 If Something Goes Wrong

### Check logs first:
```powershell
heroku logs --tail --app budget-tracker-api-demo
```

### Common fixes:

**"Cannot find module"**
```powershell
heroku run npm install --app budget-tracker-api-demo
```

**"Connection to MongoDB failed"**
- Check MongoDB Atlas Network Access allows `0.0.0.0/0`
- Verify MONGO_URI is correct: `heroku config --app budget-tracker-api-demo`

**"Dyno crashed"**
```powershell
heroku restart --app budget-tracker-api-demo
heroku logs --tail --app budget-tracker-api-demo
```

**"Port already in use"**
- Heroku sets PORT automatically via `process.env.PORT`
- Check server.js uses: `const PORT = process.env.PORT || 5000`

---

## 📞 Need Help?

1. Check logs: `heroku logs --tail --app your-app-name`
2. Read: [HEROKU_SETUP.md](HEROKU_SETUP.md)
3. Read: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)
4. Heroku Docs: https://devcenter.heroku.com

---

**You're ready to deploy!** Start with Step 1. 🚀
