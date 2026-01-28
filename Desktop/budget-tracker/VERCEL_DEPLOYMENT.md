# Vercel Frontend Deployment Guide

Once your Heroku backend is deployed and running, deploy your React frontend to Vercel.

## Prerequisites

- Heroku backend deployed and tested ✅
- Your Heroku API URL (e.g., `https://budget-tracker-api-demo.herokuapp.com/api`)
- Vercel account (free)
- GitHub repository (optional but recommended)

## Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose sign-up method:
   - Sign up with GitHub (recommended)
   - Sign up with email
4. Complete verification

## Step 2: Install Vercel CLI (Optional but Recommended)

```powershell
npm install -g vercel
```

## Step 3: Update Client Environment Variables

Update your client's `.env.production` file:

```bash
# client/.env.production
REACT_APP_API_URL=https://budget-tracker-api-demo.herokuapp.com/api
```

Replace with your actual Heroku app URL!

## Step 4: Deploy Using Vercel Dashboard (Easiest)

### Option A: Deploy from GitHub

1. Push your code to GitHub
   ```powershell
   cd c:\Users\Shini\Desktop\budget-tracker
   git remote add origin https://github.com/yourusername/budget-tracker.git
   git branch -M main
   git push -u origin main
   ```

2. Go to https://vercel.com/dashboard
3. Click **"Add New..."** → **"Project"**
4. Click **"Import Git Repository"**
5. Search for and select `budget-tracker` repository
6. Configure:
   - **Project Name:** budget-tracker
   - **Root Directory:** `./client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

7. Add Environment Variables:
   - Name: `REACT_APP_API_URL`
   - Value: `https://budget-tracker-api-demo.herokuapp.com/api`
   - Click **"Add"**

8. Click **"Deploy"**
9. Wait for deployment (2-3 minutes)
10. Get your Vercel URL (e.g., `budget-tracker.vercel.app`)

### Option B: Deploy from Local Machine

1. Install Vercel CLI:
   ```powershell
   npm install -g vercel
   ```

2. Navigate to client folder:
   ```powershell
   cd c:\Users\Shini\Desktop\budget-tracker\client
   ```

3. Deploy:
   ```powershell
   vercel
   ```

4. Answer prompts:
   - Set up and deploy? → `Y`
   - Which scope? → Select your account
   - Link to existing project? → `N`
   - What's your project name? → `budget-tracker`
   - In which directory is your code? → `./` (current)
   - Want to override settings? → `N`
   - Add environment variables? → `Y`

5. Add `REACT_APP_API_URL`:
   - Name: `REACT_APP_API_URL`
   - Value: `https://budget-tracker-api-demo.herokuapp.com/api`

6. Deploy to production:
   ```powershell
   vercel --prod
   ```

## Step 5: Configure Environment Variables in Vercel

### Via Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project `budget-tracker`
3. Go to **Settings** → **Environment Variables**
4. Add:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-heroku-app.herokuapp.com/api`
   - Environments: Select **Production, Preview, Development**
   - Click **"Add"**

5. Redeploy with new variable:
   - Go to **Deployments**
   - Click on latest deployment
   - Click **"Redeploy"**

## Step 6: Test Frontend Deployment

1. Visit your Vercel URL: `https://budget-tracker.vercel.app`
2. Try these:
   - [ ] Page loads without errors
   - [ ] Signup form visible
   - [ ] Can create new account
   - [ ] Can login with credentials
   - [ ] Can create transaction
   - [ ] Can create budget
   - [ ] Dashboard loads with data
   - [ ] Can update/delete transactions
   - [ ] Data persists after refresh

## Step 7: Verify API Connection

Check that frontend is talking to your Heroku backend:

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Create a transaction
4. Look for requests to `https://budget-tracker-api-demo.herokuapp.com/api/transactions`
5. Should see `201 Created` response

If requests fail:
- Check `REACT_APP_API_URL` is set correctly
- Verify Heroku backend is running
- Check browser console for CORS errors

## Your Vercel Frontend Details

After deployment:

- **Project Name:** budget-tracker
- **Vercel URL:** https://budget-tracker.vercel.app (or your custom domain)
- **Dashboard:** https://vercel.com/dashboard
- **Settings:** https://vercel.com/budget-tracker/settings

## Useful Vercel Commands

```powershell
# Logout
vercel logout

# Switch project
vercel link

# Deploy to production
vercel --prod

# Check deployment status
vercel list

# View deployment logs
vercel logs https://budget-tracker.vercel.app

# Remove project
vercel remove budget-tracker
```

## Troubleshooting

### "Cannot connect to API"
- Check `REACT_APP_API_URL` in Vercel settings
- Verify Heroku backend is running: `heroku logs --tail`
- Check browser console (F12) for CORS errors

### Build fails with "module not found"
- Check `package.json` has all dependencies
- Reinstall locally: `npm install`
- Redeploy: `vercel --prod`

### Environment variables not loading
- Check variable name starts with `REACT_APP_`
- Redeploy after changing variables
- Clear browser cache

### Frontend shows blank page
- Check browser console (F12) for errors
- Verify build command is correct: `npm run build`
- Check `package.json` has `react-scripts`

### Dyno timeout (backend took too long)
- Heroku free tier has 30-second timeout
- Upgrade to paid tier
- Or optimize slow queries

## Automatic Deployments

Set up auto-deploy from GitHub:

1. Go to Vercel project **Settings**
2. Go to **Git** section
3. Enable **Deploy on push to main**
4. Now every git push to main branch auto-deploys

## Custom Domain (Optional)

To use custom domain (e.g., mybudgetapp.com):

1. Go to Vercel project **Settings**
2. Go to **Domains**
3. Enter your domain
4. Update DNS settings with your registrar
5. Vercel will verify and enable HTTPS

## Summary

| Component | Deployed URL | Status |
|-----------|--------------|--------|
| Frontend | https://budget-tracker.vercel.app | ✅ |
| Backend API | https://budget-tracker-api-demo.herokuapp.com/api | ✅ |
| Database | MongoDB Atlas | ✅ |

Your Budget Tracker app is now **LIVE** and accessible to anyone! 🎉

## Next Steps

1. Share your app URL with friends
2. Monitor logs for issues
3. Collect user feedback
4. Plan new features
5. Consider upgrading to paid tiers for reliability

## Monitoring & Maintenance

### Daily
- Check Vercel deployments for errors
- Monitor Heroku dyno status

### Weekly
- Review application logs
- Check error rates in browser console
- Monitor database size (MongoDB Atlas)

### Monthly
- Review performance metrics
- Plan feature updates
- Backup database (if needed)

---

**Deployment Complete!** 🚀

Your Budget Tracker is now live and ready for users!
