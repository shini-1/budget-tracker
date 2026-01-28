# Complete Deployment Workflow

This document walks you through the complete process from local development to production deployment.

## Phase 1: Local Development (Your Current Setup)

### 1.1 Local MongoDB Setup
- **Currently:** Using MongoDB Compass locally
- ✅ Server `.env` already configured to use `mongodb://localhost:27017/budget-tracker`
- ✅ Tests passing with local MongoDB

### 1.2 Verify Local Setup Works
```bash
# Terminal 1: Start MongoDB (via Compass or mongod)
# Terminal 2: Start server
cd server
npm run dev

# Terminal 3: Start client
cd client
npm start
```

Test in browser at `http://localhost:3000`:
- ✅ Sign up
- ✅ Log in
- ✅ Create transaction
- ✅ Create budget
- ✅ View dashboard

## Phase 2: Prepare for Production

### 2.1 Set Up MongoDB Atlas (Cloud Database)

Follow the guide in `MONGODB_ATLAS_SETUP.md`:

1. Create MongoDB Atlas account (free)
2. Create cluster (Shared tier, free)
3. Create database user (username: `budget-tracker-user`)
4. Configure network access (allow 0.0.0.0/0 for now)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/budget-tracker`

### 2.2 Update Server Configuration for Production

Create `.env.production` in `server/` directory:
```
MONGO_URI=mongodb+srv://budget-tracker-user:YOUR_PASSWORD@cluster0.mongodb.net/budget-tracker?retryWrites=true&w=majority
JWT_SECRET=generate_a_secure_random_string_here_min_32_chars
NODE_ENV=production
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Important:** Replace `YOUR_PASSWORD` with actual password!

### 2.3 Test with MongoDB Atlas Locally

```bash
# Update server/.env to use MongoDB Atlas connection string
# (or manually test the connection)

node -e "
const mongoose = require('mongoose');
const uri = 'mongodb+srv://budget-tracker-user:PASSWORD@cluster0.mongodb.net/budget-tracker';
mongoose.connect(uri)
  .then(() => console.log('✅ Atlas connected!'))
  .catch(err => console.error('❌ Error:', err.message));
"
```

## Phase 3: Deploy Backend (Heroku)

### 3.1 Prepare Git Repository

```bash
# From project root
git add .
git commit -m "Setup deployment configuration"
git push origin main
```

### 3.2 Create Heroku App

```bash
# Install Heroku CLI if needed
# https://devcenter.heroku.com/articles/heroku-cli

heroku login
heroku create your-app-name
# Or via dashboard: https://dashboard.heroku.com
```

### 3.3 Configure Heroku Environment Variables

```bash
# Via CLI
heroku config:set MONGO_URI="mongodb+srv://budget-tracker-user:PASSWORD@cluster0.mongodb.net/budget-tracker?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="your_secure_random_string_min_32_chars"
heroku config:set NODE_ENV="production"

# Or via Dashboard:
# https://dashboard.heroku.com → Your App → Settings → Config Vars
# Add:
# - MONGO_URI
# - JWT_SECRET
# - NODE_ENV
```

### 3.4 Deploy Backend

```bash
# From server directory
cd server

# Deploy with Git
git subtree push --prefix server heroku main

# Or deploy entire repo if set up with Heroku Git
heroku create
git push heroku main
```

### 3.5 Verify Backend Deployment

```bash
# Check logs
heroku logs --tail

# Test endpoint
curl https://your-app-name.herokuapp.com/api/dashboard \
  -H "Authorization: Bearer test" \
  -H "Content-Type: application/json"
```

**Note:** You'll get 401 error (no auth) but the endpoint should respond, proving backend is running.

## Phase 4: Deploy Frontend (Vercel)

### 4.1 Get Backend URL

From Heroku dashboard, note your app URL:
```
https://your-app-name.herokuapp.com
```

### 4.2 Deploy Frontend

**Option A: Via Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
   - **Output Directory:** `build`
5. Add Environment Variables:
   ```
   REACT_APP_API_URL = https://your-app-name.herokuapp.com/api
   ```
6. Click "Deploy"

**Option B: Via Vercel CLI**

```bash
cd client
vercel --prod
# Follow prompts, select your project, add environment variables
```

### 4.3 Verify Frontend Deployment

1. Go to your Vercel URL (e.g., `your-app.vercel.app`)
2. Sign up with test account
3. Create transaction
4. Check dashboard
5. Data should persist in MongoDB Atlas

## Phase 5: Testing & Validation

### 5.1 Full Integration Test

From deployed frontend:
- [ ] Signup with new account
- [ ] Login with created account
- [ ] Create income transaction
- [ ] Create expense transaction
- [ ] Create budget
- [ ] View transactions list
- [ ] View dashboard with balance
- [ ] Update transaction
- [ ] Delete transaction
- [ ] Check data persists after page refresh

### 5.2 Check Logs

```bash
# Backend logs
heroku logs --tail -a your-app-name

# Frontend logs
# Vercel Dashboard → Deployments → Logs
```

### 5.3 Database Verification

Check MongoDB Atlas:
1. Go to MongoDB Atlas dashboard
2. Click "Collections" on your cluster
3. Verify `budget-tracker` database has:
   - `users` collection with your test account
   - `transactions` collection with your data
   - `budgets` collection with your budgets

## Phase 6: Post-Deployment

### 6.1 Monitor Performance

- Monitor Heroku dyno usage
- Monitor Vercel bandwidth
- Monitor MongoDB Atlas storage

### 6.2 Update Documentation

Update README.md with:
- Live deployed URLs
- How to access the application
- Any deployment-specific notes

### 6.3 Set Up Alerts (Optional)

- Heroku: Set up alerts for dyno restarts
- Vercel: Monitor failed deployments
- MongoDB Atlas: Monitor storage usage

## Troubleshooting Common Issues

### Frontend Can't Connect to Backend
- Check `REACT_APP_API_URL` is set correctly in Vercel
- Check backend is running: `heroku logs --tail`
- Check CORS is enabled in server

### Authentication Fails on Production
- Verify JWT_SECRET is set in Heroku config
- Verify MONGO_URI connection string is correct
- Check database user has correct permissions

### Database Errors
- Verify IP whitelist in MongoDB Atlas (add Heroku IP range)
- Check connection string in Heroku config vars
- Verify database user password

### Deployment Fails
- Check for hardcoded paths or environment variables
- Review deployment logs
- Ensure all dependencies are in package.json

## Rollback

### Rollback Frontend (Vercel)
1. Dashboard → Deployments
2. Click on previous successful deployment
3. Click "Redeploy"

### Rollback Backend (Heroku)
```bash
heroku releases
heroku rollback v10  # Replace with version number
```

## URLs to Update

After deployment, save these URLs:

- **Frontend:** https://[your-vercel-app].vercel.app
- **Backend API:** https://[your-heroku-app].herokuapp.com/api
- **MongoDB Atlas Dashboard:** https://cloud.mongodb.com
- **Heroku Dashboard:** https://dashboard.heroku.com
- **Vercel Dashboard:** https://vercel.com/dashboard

## Maintenance

### Regular Tasks
- Monitor application logs
- Check error rates
- Verify backups (MongoDB Atlas free tier doesn't backup automatically)
- Update dependencies monthly

### Before Making Changes
1. Create a feature branch
2. Test locally
3. Run `npm test`
4. Create pull request
5. After review, merge and auto-deploy

## Security Checklist

- [ ] Never commit `.env` file
- [ ] JWT_SECRET is strong (min 32 characters)
- [ ] Database user password is strong
- [ ] MongoDB Atlas IP whitelist is restricted (not 0.0.0.0/0 in production)
- [ ] HTTPS enabled (automatic with Vercel and Heroku)
- [ ] No console.log() with sensitive data in production code
- [ ] Environment variables are different for dev/prod

## Success!

Once all tests pass, your Budget Tracker app is live! 🎉

Users can now:
- Create accounts
- Track income and expenses
- Set budgets
- View financial dashboard
- Manage their personal finances

Congratulations! 🚀
