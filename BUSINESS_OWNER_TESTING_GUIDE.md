# Business Owner Testing Guide

## Overview
This guide provides instructions for testing the Business Owner features in the Foodventurer app, including authentication, profile management, business management, and the Add Business Marker functionality.

## Mock Credentials for Testing

### Business Owner Accounts
All business owner accounts use the password: `password123`

| Email | Owner Name | Business | Business ID |
|-------|-----------|----------|-------------|
| `atiathan@foodventurer.com` | Maria Santos | Ati-Atihan Restaurant | owner1 |
| `pansi@foodventurer.com` | Roberto Cruz | Pansi Restaurant | owner2 |
| `boracay@foodventurer.com` | Elena Reyes | Boracay Breeze Café | owner3 |
| `linamon@foodventurer.com` | Carlos Mendoza | Linamon Seafood House | owner4 |
| `lechon@foodventurer.com` | Rosa Garcia | Aklan Lechon Haus | owner5 |
| `fastfood@foodventurer.com` | Miguel Torres | Kalibo Fast Food Corner | owner6 |
| `maria@foodventurer.com` | Maria Lopez | Maria's Bakery & Bakeshop | owner7 |
| `pizza@foodventurer.com` | Antonio Fernandez | Island Hop Pizza | owner8 |
| `icecream@foodventurer.com` | Sofia Ramos | Tropical Ice Cream Parlor | owner9 |
| `sukip@foodventurer.com` | Luis Morales | Sukip Café | owner10 |

### Other Test Accounts
| Email | Password | Role | Notes |
|-------|----------|------|-------|
| `user@foodventurer.com` | `password123` | User | Regular food explorer |
| `owner@foodventurer.com` | `password123` | Business Owner | No business assigned |
| `admin@foodventurer.com` | `password123` | Admin | Administrator account |

## Testing Features

### 1. Authentication & Login
1. Open the Foodventurer app
2. Navigate to Login screen
3. Use any of the business owner credentials above
4. Verify successful login and redirect to Business Owner Dashboard

**Expected Result:**
- User is logged in successfully
- Redirected to Business Owner Home Page (Dashboard Tab)
- User information is displayed correctly

### 2. Business Owner Profile Tab (Settings Tab)

#### Accessing Profile Tab
1. Login with a business owner account
2. Navigate to the **Settings** tab (bottom navigation)
3. Verify the Profile Tab displays:
   - Owner's avatar with initials
   - Full name
   - Email address
   - Role badge showing "Business Owner"
   - Edit Profile button

#### Profile Features
- **Owner Information**: Displays first name, last name, and email
- **Edit Profile Button**: Navigates to Edit Owner Profile screen
- **Logout Button**: Red button at the bottom with logout confirmation

#### Business Information Section
If the owner has a business:
- Business name and status (Active/Inactive)
- Business description
- Statistics: Rating, Reviews, Price Range
- **Edit Business Info** button (navigates to Edit Business screen)
- **Add Business Marker** button (navigates to Add Business Marker screen)

If the owner has NO business:
- "No business created yet" message
- **Create Business** button

#### Settings Options
- Notifications
- Privacy & Security
- Help & Support

#### Logout Functionality
1. Click the **Logout** button at the bottom
2. Confirm logout in the alert dialog
3. Verify user is logged out and redirected to Login screen

**Expected Result:**
- Profile information is displayed correctly
- Logout button works and clears authentication
- Business information is shown if owner has a business

### 3. Business Dashboard Tab

#### Accessing Dashboard
1. Login with a business owner account
2. The Dashboard tab is the default landing page
3. Verify dashboard displays:
   - Welcome message with business name (or owner's name if no business)
   - Period selector (Today, This Week, This Month)
   - Statistics cards (Views, Clicks, Calls, Reviews)
   - Quick Actions section
   - Recent Reviews
   - Performance Insights

#### Quick Actions
The Quick Actions section includes:

1. **Edit Info / Create Business Button**
   - If business exists: Shows "Edit Info" and navigates to Edit Business screen
   - If no business: Shows "Create Business" and navigates to Create Business screen
   
2. **Add Marker Button**
   - If business exists: Shows confirmation dialog, then navigates to Add Business Marker screen
   - If no business: Shows alert "Please create a business first"

3. **Menu Button**
   - Navigates to Menu Management tab

4. **Analytics Button**
   - Navigates to Analytics tab

**Expected Result:**
- Dashboard loads with correct business information
- Quick Actions respond appropriately based on business existence
- Add Marker button is accessible from Dashboard

### 4. Edit Business Info Feature

#### Testing with Existing Business
1. Login with `atiathan@foodventurer.com` (has Ati-Atihan Restaurant)
2. Go to Dashboard tab
3. Click **Edit Info** in Quick Actions
4. Verify navigation to Edit Business screen
5. Business details should be pre-populated

**Expected Result:**
- Edit Info button shows when business exists
- Navigates to Edit Business screen with business ID
- Business information is loaded for editing

#### Testing without Business
1. Login with `owner@foodventurer.com` (no business)
2. Go to Dashboard tab
3. Click **Create Business** in Quick Actions
4. Verify navigation to Create Business screen

**Expected Result:**
- Create Business button shows when no business exists
- Navigates to Create Business screen

### 5. Add Business Marker Feature

#### From Dashboard Tab
1. Login with a business owner who has a business
2. Go to Dashboard tab
3. Click **Add Marker** in Quick Actions
4. Confirm in the alert dialog
5. Verify navigation to Add Business Marker screen

#### From Profile Tab (Settings)
1. Login with a business owner who has a business
2. Go to Settings tab
3. Scroll to "My Business" section
4. Click **Add Business Marker** button
5. Confirm in the alert dialog
6. Verify navigation to Add Business Marker screen

**Expected Result:**
- Add Marker button is available in both Dashboard and Profile tabs
- Confirmation dialog appears before navigation
- Business ID is passed to the Add Business Marker screen
- If no business exists, shows appropriate error message

### 6. Testing Business Data Integration

#### Verify Business Owner Data
1. Login with `lechon@foodventurer.com`
2. Check Profile Tab:
   - Name: Rosa Garcia
   - Business: Aklan Lechon Haus
   - Rating: 4.8
   - Reviews: 278
   - Price: $$$
3. Check Dashboard Tab:
   - Header shows "Aklan Lechon Haus"
   - Edit Info button is available

**Expected Result:**
- Business owner's data matches the mock data
- Business information is correctly associated with the owner
- All features work with the linked business

### 7. Testing Authentication Persistence

1. Login with any business owner account
2. Close the app (don't logout)
3. Reopen the app
4. Verify user is still logged in
5. Verify correct role-based navigation (Business Owner tabs)

**Expected Result:**
- Authentication persists across app restarts
- User remains logged in
- Correct navigation for business owner role

## Common Test Scenarios

### Scenario 1: New Business Owner
**Account:** `owner@foodventurer.com`
1. Login
2. Verify no business is shown
3. Click "Create Business" from Dashboard
4. Complete business creation
5. Verify business appears in Profile and Dashboard

### Scenario 2: Existing Business Owner
**Account:** `atiathan@foodventurer.com`
1. Login
2. Verify business information is displayed
3. Test Edit Info button
4. Test Add Marker button
5. Test logout functionality

### Scenario 3: Multiple Business Owners
Test with different accounts to verify:
- Each owner sees only their own business
- Business data is correctly isolated per owner
- Navigation works correctly for each account

## Troubleshooting

### Issue: Business not showing
- Verify the owner ID matches between mockAuthService and mockBusinessService
- Check console logs for errors
- Ensure you're logged in with the correct account

### Issue: Navigation not working
- Verify navigation routes are defined in navigation types
- Check for TypeScript errors in navigation calls
- Ensure screens are properly registered in navigators

### Issue: Logout not working
- Check if logout action is dispatched correctly
- Verify auth state is cleared
- Check navigation redirect after logout

## Notes for Developers

### Mock Data Structure
- Business owners are defined in `src/services/mockAuthService.ts`
- Businesses are defined in `src/services/mockBusinessService.ts`
- Owner IDs must match between the two services

### Key Files Modified
1. `src/screens/business/BusinessSettingsScreen.tsx` - Profile Tab with logout
2. `src/screens/business/BusinessDashboardScreen.tsx` - Dashboard with Edit Info and Add Marker
3. `src/services/mockAuthService.ts` - Added business owner credentials

### Authentication Flow
1. User logs in with business owner credentials
2. Auth state stores user information including ID
3. Business screens query businesses by owner ID
4. Business data is loaded and displayed
5. Navigation adapts based on business existence

## Research & Presentation Tips

### For Research
- Document the authentication flow with screenshots
- Show the relationship between users and businesses
- Demonstrate data persistence and state management
- Highlight security features (logout, role-based access)

### For Presentation
- Prepare demo accounts for each feature
- Create a demo flow: Login → View Profile → Edit Business → Add Marker → Logout
- Show both scenarios: with business and without business
- Demonstrate the responsive UI and user feedback (alerts, loading states)

## Contact & Support
For issues or questions during testing, check:
- Console logs for error messages
- Redux DevTools for state inspection
- Network tab for API calls (if using real backend)
