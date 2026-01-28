# MongoDB Atlas Setup Guide

MongoDB Compass is great for local development, but MongoDB Atlas is the cloud-hosted solution needed for production deployment. Follow these steps:

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Create account with:
   - Email address
   - Password
   - Accept terms and continue
4. You'll be asked about your deployment preference (choose cloud-hosted)

## Step 2: Create Organization & Project

1. After signup, you'll see the welcome screen
2. Create a new organization (or use default)
3. Create a new project (e.g., "budget-tracker")
4. Click **"Create Project"** button

## Step 3: Create Cluster

1. Click **"Create a Deployment"** or **"Build a Database"**
2. Choose **"Shared"** (Free tier - perfect for testing)
3. Select cloud provider and region:
   - Provider: AWS (or your preference)
   - Region: Choose closest to you (or US East for standard)
4. Click **"Create Deployment"**
5. Wait for cluster to be created (2-5 minutes)

## Step 4: Create Database User

1. Once cluster is created, go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter username: `budget-tracker-user` (or your choice)
5. Enter password: Generate secure password (or create your own)
   - **SAVE THIS PASSWORD - You'll need it for connection string!**
6. Database User Privileges: Keep as **"Read and write to any database"**
7. Click **"Add User"**

## Step 5: Configure Network Access

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Choose one option:
   - **Option A (Recommended for Development):** Add your current IP
     - Click **"Add Current IP Address"**
   - **Option B (Broader Access):** Allow from anywhere
     - Enter `0.0.0.0/0` to allow connections from any IP
4. Click **"Confirm"**

## Step 6: Get Connection String

1. Go back to **"Databases"** or **"Clusters"**
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select:
   - Driver: **Node.js**
   - Version: **3.6 or later**
5. Copy the connection string
6. It will look like:
   ```
   mongodb+srv://budget-tracker-user:PASSWORD@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 7: Update Your .env File

1. Create `.env` file in your `server` directory (copy from `.env.example`)
2. Replace the connection string:
   ```
   MONGO_URI=mongodb+srv://budget-tracker-user:YOUR_PASSWORD@cluster0.mongodb.net/budget-tracker?retryWrites=true&w=majority
   JWT_SECRET=generate_a_secure_random_string_here
   NODE_ENV=development
   PORT=5000
   ```

3. **Important:** Replace:
   - `YOUR_PASSWORD` with the password you created for the database user
   - Add database name: `/budget-tracker` (after cluster URL)

## Step 8: Create Database & Collections

MongoDB Atlas automatically creates them on first write, but you can pre-create:

1. Click **"Browse Collections"** in your cluster
2. Click **"Add My Own Data"**
3. Create database: `budget-tracker`
4. Create collections:
   - `users`
   - `transactions`
   - `budgets`

These will be created automatically when your app first writes data, so this step is optional.

## Step 9: Test Connection Locally

Test your connection before deploying:

### Option A: Using Node.js
```bash
cd server
node -e "
const mongoose = require('mongoose');
const uri = 'mongodb+srv://budget-tracker-user:PASSWORD@cluster0.mongodb.net/budget-tracker';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
  });
"
```

### Option B: Using MongoDB Compass (you have this!)
1. Open MongoDB Compass
2. Click **"New Connection"**
3. Paste your connection string: `mongodb+srv://budget-tracker-user:PASSWORD@cluster0.mongodb.net/budget-tracker`
4. Click **"Connect"**
5. If successful, you'll see your database

### Option C: Start your server
```bash
cd server
npm run dev
```
If no connection errors appear, you're good!

## Step 10: Run Application with Atlas

1. Make sure `.env` has your MongoDB Atlas connection string
2. Start server:
   ```bash
   cd server
   npm run dev
   ```
3. Start client (in another terminal):
   ```bash
   cd client
   npm start
   ```
4. Test signup/login - data will be stored in MongoDB Atlas

## Important Notes

- **Keep your password safe** - Don't commit `.env` to git
- **IP Whitelist:** If you get "connection refused", check Network Access settings
- **Connection String:** Format is case-sensitive
- **Database Name:** Always add `/budget-tracker` after cluster URL
- **Free Tier Limits:** 512MB storage, no backup (enough for testing)

## Troubleshooting

### "Authentication failed" Error
- Check username and password are correct
- Ensure password in connection string is URL-encoded (special chars may need encoding)
- Verify database user exists in "Database Access"

### "IP not whitelisted" Error
- Go to Network Access
- Add your IP address or use `0.0.0.0/0`
- Wait a few seconds for changes to propagate

### "Cannot connect" Error
- Verify MongoDB Atlas cluster is running (green status)
- Check internet connection
- Try using `0.0.0.0/0` in Network Access temporarily

## Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

Example:
```
mongodb+srv://budget-tracker-user:MySecurePass123@cluster0.mongodb.net/budget-tracker?retryWrites=true&w=majority
```

## Next Steps

After confirming Atlas connection:
1. Delete local MongoDB data (no longer needed for production)
2. Keep `.env` file locally only (add to `.gitignore`)
3. You're ready to deploy to Heroku
