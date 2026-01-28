# Deployment Guide

## Prerequisites
- GitHub account with repository pushed
- MongoDB Atlas account (for cloud database)
- Vercel account (for front-end)
- Heroku account (for back-end)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project and cluster
3. Create a database user with username and password
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/budget-tracker?retryWrites=true&w=majority`)
5. Whitelist your IP address (or allow all: 0.0.0.0/0)

## Step 2: Deploy Backend (Heroku)

### Option A: Using Heroku CLI

```bash
# Install Heroku CLI if not already installed
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Navigate to server directory
cd server

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/budget-tracker?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="your_super_secret_key_change_this"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option B: Using GitHub Integration

1. Go to [Heroku Dashboard](https://dashboard.heroku.com)
2. Create new app
3. Connect to GitHub repository
4. Enable automatic deployments from `main` branch
5. Go to Settings → Config Vars and add:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a secure random string
   - `NODE_ENV`: `production`

## Step 3: Deploy Frontend (Vercel)

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client directory
cd client

# Deploy
vercel

# When prompted, connect to GitHub and select the repository
```

### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework: React
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add Environment Variables:
   - `REACT_APP_API_URL`: Your Heroku backend URL (e.g., `https://your-app-name.herokuapp.com/api`)
6. Deploy

## Step 4: Update Client Configuration

After deploying backend, update the client's environment:

1. Create `client/.env.production` with:
```
REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api
```

2. Update the API client in `client/src/utils/api.js`:
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});
```

## Step 5: Verify Deployment

1. **Test Backend:**
   ```bash
   curl https://your-heroku-app.herokuapp.com/api/auth/signup -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test","name":"Test"}'
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try signing up and logging in
   - Create transactions and budgets

## Troubleshooting

### Backend Issues
- Check Heroku logs: `heroku logs --tail -a your-app-name`
- Verify MongoDB connection string in config vars
- Ensure JWT_SECRET is set
- Check that `server.js` is the entry point

### Frontend Issues
- Check that `REACT_APP_API_URL` is correct
- Ensure CORS is enabled in backend (check `server.js`)
- Clear browser cache and rebuild: `npm run build`
- Check Vercel deployment logs

### Database Issues
- Verify IP whitelist in MongoDB Atlas (0.0.0.0/0 for all)
- Test connection string locally: `node` → `require('mongoose').connect('your_string')`
- Ensure database user has correct permissions

## Environment Variables Summary

### Server (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/budget-tracker
JWT_SECRET=your_secret_key
NODE_ENV=production
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Client (.env.production)
```
REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api
```

## Rollback

If something goes wrong:

**Heroku:**
```bash
heroku releases
heroku rollback v<number>
```

**Vercel:**
- Dashboard → Deployments → Click on previous deployment → Redeploy

## Next Steps
- Monitor application in production
- Set up error tracking (Sentry)
- Monitor database performance
- Implement automated backups
- Set up CI/CD pipeline for automated tests before deployment
