# Business Owner Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Login Screen                                                    │
│  ↓                                                               │
│  mockAuthService.login(email, password)                         │
│  ↓                                                               │
│  Returns: { user, token, refreshToken }                         │
│  ↓                                                               │
│  Redux Store (authSlice)                                        │
│  - user: { id, email, firstName, lastName, role }              │
│  - token: "mock_jwt_token_..."                                 │
│  - isAuthenticated: true                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      NAVIGATION LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Role Check: user.role === 'business_owner'                     │
│  ↓                                                               │
│  Navigate to: BusinessNavigator                                 │
│  ↓                                                               │
│  Bottom Tabs:                                                   │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐     │
│  │Dashboard │  Menu    │ Reviews  │Analytics │ Settings │     │
│  │  (Home)  │          │          │          │(Profile) │     │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  mockBusinessService.getBusinesses()                            │
│  ↓                                                               │
│  Filter: businesses.find(b => b.ownerId === user.id)           │
│  ↓                                                               │
│  Returns: Business | null                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                     USER AUTHENTICATION                           │
└──────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  Email: lechon@foodventurer.com         │
        │  Password: password123                   │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  mockAuthService.login()                │
        │  - Validates credentials                │
        │  - Returns user object                  │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  User Object:                           │
        │  {                                      │
        │    id: 'owner5',                        │
        │    email: 'lechon@foodventurer.com',   │
        │    firstName: 'Rosa',                   │
        │    lastName: 'Garcia',                  │
        │    role: 'business_owner'               │
        │  }                                      │
        └─────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                     BUSINESS DATA LOADING                         │
└──────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  mockBusinessService.getBusinesses()    │
        │  - Fetches all businesses               │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  Filter by owner ID:                    │
        │  businesses.find(                       │
        │    b => b.ownerId === 'owner5'         │
        │  )                                      │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  Business Object:                       │
        │  {                                      │
        │    id: '5',                             │
        │    name: 'Aklan Lechon Haus',          │
        │    ownerId: 'owner5',                   │
        │    rating: 4.8,                         │
        │    reviewCount: 278,                    │
        │    priceRange: '$$$',                   │
        │    ...                                  │
        │  }                                      │
        └─────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                     UI RENDERING                                  │
└──────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  Dashboard Screen                       │
        │  - Header: "Aklan Lechon Haus"         │
        │  - Stats: 4.8★, 278 reviews            │
        │  - Quick Actions: Edit Info, Add Marker│
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  Profile Screen (Settings Tab)          │
        │  - Owner: Rosa Garcia                   │
        │  - Business: Aklan Lechon Haus         │
        │  - Edit Business Info button            │
        │  - Add Business Marker button           │
        │  - Logout button                        │
        └─────────────────────────────────────────┘
```

## Component Hierarchy

```
App
└── RootNavigator
    └── BusinessNavigator (if role === 'business_owner')
        ├── BusinessTabNavigator
        │   ├── Dashboard Tab
        │   │   └── BusinessDashboardScreen
        │   │       ├── Header (with business name)
        │   │       ├── Period Selector
        │   │       ├── Stats Grid
        │   │       ├── Quick Actions
        │   │       │   ├── Edit Info Button
        │   │       │   ├── Add Marker Button
        │   │       │   ├── Menu Button
        │   │       │   └── Analytics Button
        │   │       ├── Recent Reviews
        │   │       └── Performance Insights
        │   │
        │   ├── Menu Tab
        │   │   └── MenuManagementScreen
        │   │
        │   ├── Reviews Tab
        │   │   └── ReviewsManagementScreen
        │   │
        │   ├── Analytics Tab
        │   │   └── BusinessAnalyticsScreen
        │   │
        │   └── Settings Tab (Profile)
        │       └── BusinessSettingsScreen
        │           ├── Header
        │           ├── Owner Profile Card
        │           │   ├── Avatar
        │           │   ├── Name & Email
        │           │   ├── Role Badge
        │           │   └── Edit Profile Button
        │           ├── Business Information
        │           │   ├── Business Card (if exists)
        │           │   │   ├── Name & Status
        │           │   │   ├── Description
        │           │   │   ├── Stats
        │           │   │   ├── Edit Business Info Button
        │           │   │   └── Add Business Marker Button
        │           │   └── No Business Card (if not exists)
        │           │       └── Create Business Button
        │           ├── Settings Options
        │           │   ├── Notifications
        │           │   ├── Privacy & Security
        │           │   └── Help & Support
        │           └── Logout Button
        │
        └── Stack Screens
            ├── EditBusiness
            ├── CreateBusiness
            ├── AddBusinessMarker
            └── EditOwnerProfile
```

## State Management

```
Redux Store
├── authSlice
│   ├── user: User | null
│   │   ├── id: string (e.g., 'owner5')
│   │   ├── email: string
│   │   ├── firstName: string
│   │   ├── lastName: string
│   │   └── role: 'business_owner'
│   ├── token: string | null
│   ├── refreshToken: string | null
│   ├── isAuthenticated: boolean
│   ├── isLoading: boolean
│   └── error: string | null
│
└── Component Local State
    ├── BusinessDashboardScreen
    │   ├── myBusiness: Business | null
    │   ├── isLoadingBusiness: boolean
    │   └── selectedPeriod: 'today' | 'week' | 'month'
    │
    └── BusinessSettingsScreen
        ├── myBusiness: Business | null
        └── isLoading: boolean
```

## Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     NAVIGATION ROUTES                            │
└─────────────────────────────────────────────────────────────────┘

Dashboard Tab (BusinessDashboardScreen)
│
├─→ Edit Info Button
│   ├─→ If myBusiness exists
│   │   └─→ Navigate('EditBusiness', { businessId: myBusiness.id })
│   └─→ If myBusiness is null
│       └─→ Navigate('CreateBusiness')
│
├─→ Add Marker Button
│   ├─→ If myBusiness exists
│   │   ├─→ Show confirmation dialog
│   │   └─→ Navigate('AddBusinessMarker', { businessId: myBusiness.id })
│   └─→ If myBusiness is null
│       └─→ Show alert: "Please create a business first"
│
├─→ Menu Button
│   └─→ Navigate to Menu Tab
│
└─→ Analytics Button
    └─→ Navigate to Analytics Tab

Settings Tab (BusinessSettingsScreen)
│
├─→ Edit Profile Button
│   └─→ Navigate('EditOwnerProfile')
│
├─→ Edit Business Info Button (if business exists)
│   └─→ Navigate('EditBusiness', { businessId: myBusiness.id })
│
├─→ Add Business Marker Button (if business exists)
│   ├─→ Show confirmation dialog
│   └─→ Navigate('AddBusinessMarker', { businessId: myBusiness.id })
│
├─→ Create Business Button (if no business)
│   └─→ Navigate('CreateBusiness')
│
└─→ Logout Button
    ├─→ Show confirmation dialog
    ├─→ Dispatch logoutUser()
    ├─→ Clear auth state
    └─→ Navigate to Login Screen
```

## Business-Owner Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA RELATIONSHIPS                            │
└─────────────────────────────────────────────────────────────────┘

User (mockAuthService)          Business (mockBusinessService)
┌──────────────────────┐       ┌──────────────────────┐
│ id: 'owner1'         │◄──────│ ownerId: 'owner1'    │
│ email: atiathan@...  │       │ name: Ati-Atihan...  │
│ firstName: Maria     │       │ rating: 4.6          │
│ lastName: Santos     │       │ reviewCount: 187     │
│ role: business_owner │       │ priceRange: '$$'     │
└──────────────────────┘       └──────────────────────┘

User (mockAuthService)          Business (mockBusinessService)
┌──────────────────────┐       ┌──────────────────────┐
│ id: 'owner5'         │◄──────│ ownerId: 'owner5'    │
│ email: lechon@...    │       │ name: Aklan Lechon...│
│ firstName: Rosa      │       │ rating: 4.8          │
│ lastName: Garcia     │       │ reviewCount: 278     │
│ role: business_owner │       │ priceRange: '$$$'    │
└──────────────────────┘       └──────────────────────┘

User (mockAuthService)          Business (mockBusinessService)
┌──────────────────────┐       ┌──────────────────────┐
│ id: '2'              │       │ No matching business │
│ email: owner@...     │   ✗   │ (ownerId not found)  │
│ firstName: Jane      │       │                      │
│ lastName: Smith      │       │ Shows: "No business  │
│ role: business_owner │       │  created yet"        │
└──────────────────────┘       └──────────────────────┘

Relationship: user.id === business.ownerId
```

## Feature Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                     FEATURE AVAILABILITY                          │
└─────────────────────────────────────────────────────────────────┘

                        Has Business    No Business
                        ────────────    ───────────
Dashboard Header        Business Name   Owner Name
Edit Info Button        "Edit Info"     "Create Business"
Add Marker Button       Available       Disabled (Alert)
Business Stats          Displayed       Not Shown
Profile - Business      Displayed       "No business yet"
Edit Business Button    Available       Not Shown
Create Business Button  Not Shown       Available
Logout Button           Available       Available
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────────┐
│                     ERROR SCENARIOS                               │
└─────────────────────────────────────────────────────────────────┘

Scenario 1: Invalid Login
├─→ mockAuthService.login() throws error
├─→ Error displayed on login screen
└─→ User remains on login screen

Scenario 2: Business Not Found
├─→ mockBusinessService returns empty array
├─→ myBusiness = null
├─→ UI shows "No business created yet"
└─→ Create Business button displayed

Scenario 3: Add Marker Without Business
├─→ User clicks Add Marker button
├─→ Check: if (!myBusiness)
├─→ Alert: "Please create a business first"
└─→ No navigation occurs

Scenario 4: Network Error (Mock Delay)
├─→ Loading state shown
├─→ Spinner displayed
├─→ After delay, data loads
└─→ UI updates with data

Scenario 5: Logout Cancellation
├─→ User clicks Logout
├─→ Confirmation dialog shown
├─→ User clicks "Cancel"
└─→ Remains logged in, no state change
```

## Security & Data Isolation

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY MEASURES                             │
└─────────────────────────────────────────────────────────────────┘

1. Authentication Required
   └─→ All business owner screens require valid auth token

2. Owner-Business Isolation
   └─→ Each owner can only see/edit their own business
   └─→ Filter: b.ownerId === user.id

3. Role-Based Access
   └─→ Only users with role='business_owner' can access
   └─→ Navigation guards check user.role

4. Logout Confirmation
   └─→ Prevents accidental logout
   └─→ Requires explicit user confirmation

5. Token Management
   └─→ Token stored in Redux
   └─→ Cleared on logout
   └─→ Persisted across sessions (AsyncStorage)
```

## Performance Considerations

```
┌─────────────────────────────────────────────────────────────────┐
│                     OPTIMIZATION                                  │
└─────────────────────────────────────────────────────────────────┘

1. Data Loading
   ├─→ Load business data once on mount
   ├─→ Cache in component state
   └─→ Reload only when user changes

2. Mock Delays
   ├─→ Simulate realistic network delays
   ├─→ Show loading states
   └─→ Improve perceived performance

3. Conditional Rendering
   ├─→ Show/hide buttons based on business existence
   ├─→ Avoid unnecessary re-renders
   └─→ Use React.memo for optimization (future)

4. Navigation
   ├─→ Use tab navigation for quick switching
   ├─→ Preserve state across tabs
   └─→ Lazy load screens when needed
```

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Status:** Production Ready
