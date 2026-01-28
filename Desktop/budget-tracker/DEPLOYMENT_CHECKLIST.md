# Pre-Deployment Checklist

## Before Deploying

### Backend (Server)
- [ ] All tests passing: `npm test`
- [ ] `.env.example` file created with all required variables
- [ ] `Procfile` exists with correct entry point
- [ ] No hardcoded secrets in code
- [ ] MongoDB Atlas cluster created and connection string ready
- [ ] JWT_SECRET generated (use strong random string)
- [ ] CORS enabled (verified in server.js)
- [ ] Error handling in place for all routes
- [ ] Database models properly defined
- [ ] Authentication middleware working

### Frontend (Client)
- [ ] No hardcoded API URLs (using env variables)
- [ ] `.env.example` created
- [ ] Build passes: `npm run build`
- [ ] All components render without console errors
- [ ] Authentication context properly set up
- [ ] localStorage used for JWT token storage
- [ ] API client configured to use REACT_APP_API_URL
- [ ] Responsive design tested on mobile/desktop
- [ ] No console warnings

### General
- [ ] Code committed to git
- [ ] README.md updated
- [ ] DEPLOYMENT.md guide created
- [ ] Both frontend and backend are git-pushed
- [ ] No sensitive data in git history

## Deployment Steps

### 1. Backend Deployment
- [ ] Create Heroku account if not done
- [ ] Create new Heroku app
- [ ] Set environment variables in Heroku dashboard
- [ ] Deploy via GitHub or Heroku CLI
- [ ] Test backend endpoints
- [ ] Check Heroku logs for errors

### 2. Frontend Deployment
- [ ] Create Vercel account if not done
- [ ] Connect GitHub repository to Vercel
- [ ] Set `REACT_APP_API_URL` in Vercel environment variables
- [ ] Deploy frontend
- [ ] Test frontend with backend

### 3. Post-Deployment
- [ ] Test user signup/login
- [ ] Test transaction creation/update/delete
- [ ] Test budget creation/update/delete
- [ ] Test dashboard data loading
- [ ] Monitor logs for errors
- [ ] Check error tracking (if set up)

## Quick Commands

```bash
# Build frontend
cd client && npm run build

# Test backend
cd server && npm test

# Start server locally
cd server && npm run dev

# Start frontend locally
cd client && npm start
```

## Deployed URLs (Update After Deployment)
- Frontend: `https://your-vercel-app.vercel.app`
- Backend: `https://your-heroku-app.herokuapp.com/api`
- Database: MongoDB Atlas connection string

## Useful Links
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Heroku Deployment Docs](https://devcenter.heroku.com/articles/git)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started)
