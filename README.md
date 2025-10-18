# 🍽️ Foodventurer

**Foodventurer** is a comprehensive restaurant discovery app built with React Native and TypeScript. It helps users find nearby restaurants using Google Maps while providing business owners with their own management panel and admins with complete platform control.

## 🚀 Features

### 👤 **For Users (Food Explorers)**
- 🔍 **Restaurant Discovery** - Find nearby restaurants with Google Maps integration
- 📍 **Location-based Search** - Search restaurants by location with radius filtering
- ⭐ **Reviews & Ratings** - Read and write reviews for restaurants
- ❤️ **Favorites** - Save favorite restaurants for quick access
- 🗺️ **Interactive Maps** - View restaurants on map with clustering
- 📱 **Responsive Design** - Beautiful UI that works on all devices

### 🏪 **For Business Owners**
- 📊 **Business Dashboard** - Comprehensive analytics and insights
- 🍽️ **Menu Management** - Create and manage restaurant menus
- 📸 **Photo Management** - Upload and manage restaurant photos
- ⏰ **Hours Management** - Set and update business hours
- 📈 **Analytics** - Track views, clicks, and customer engagement
- 💬 **Review Management** - Respond to customer reviews

### 👨‍💼 **For Administrators**
- 🎛️ **Admin Dashboard** - Complete platform overview and control
- 👥 **User Management** - Manage all users and their accounts
- 🏢 **Business Management** - Approve, suspend, or manage businesses
- 📊 **Platform Analytics** - System-wide analytics and reporting
- 🔧 **Content Moderation** - Moderate reviews and content
- ⚙️ **System Settings** - Configure platform-wide settings

## 🛠️ Technical Stack

- **Framework**: React Native with TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Redux Toolkit
- **Maps**: Google Maps API
- **Authentication**: JWT with role-based access control
- **UI Components**: Custom components with consistent design system
- **Location Services**: Expo Location
- **Image Handling**: Expo Image Picker
- **Notifications**: Expo Notifications

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (LoadingSpinner, ErrorBoundary)
│   ├── forms/          # Form components
│   └── maps/           # Map-related components
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   ├── user/           # User screens
│   ├── business/       # Business owner screens
│   └── admin/          # Admin screens
├── navigation/         # Navigation configuration
├── services/           # API services
├── store/              # Redux store and slices
├── types/              # TypeScript interfaces
├── utils/              # Helper functions
├── hooks/              # Custom React hooks
└── constants/          # App constants
```

## 🔐 Authentication System

The app features a comprehensive authentication system with three user roles:

- **User (Food Explorer)**: Discover and review restaurants
- **Business Owner**: Manage restaurant listings and analytics
- **Admin**: Manage the entire platform

### Test Credentials (Development)
- **User**: `user@foodventurer.com` / `password123`
- **Business Owner**: `owner@foodventurer.com` / `password123`
- **Admin**: `admin@foodventurer.com` / `password123`

## 🗺️ Google Maps Features

### **Interactive Map View**
- **Restaurant Markers** - Color-coded markers based on ratings and categories
- **Custom Icons** - Category-specific emoji icons for easy identification
- **Map Types** - Standard, Satellite, and Hybrid view options
- **User Location** - GPS location detection with permission handling
- **Map Controls** - Center on user, toggle map types, and filter options

### **Search & Discovery**
- **Real-time Search** - Debounced search with autocomplete suggestions
- **Location-based Search** - Find restaurants near your current location
- **Category Filtering** - Filter by restaurant type (Fine Dining, Café, Fast Food, etc.)
- **Rating Filtering** - Filter by minimum rating threshold
- **Price Range Filtering** - Filter by price range ($, $$, $$$, $$$$)

### **Restaurant Information**
- **Detailed Listings** - Complete restaurant information with photos
- **Ratings & Reviews** - Star ratings and review counts
- **Distance Calculation** - Distance from your current location
- **Business Hours** - Operating hours and availability status
- **Contact Information** - Phone, email, and website details
- **Amenities** - WiFi, parking, reservations, outdoor seating, etc.

### **Sample Restaurants**
The app includes 5 mock restaurants with realistic data:
- **The Golden Spoon** - Fine Dining (4.8⭐, 324 reviews)
- **Bella Vista Café** - Italian Café (4.5⭐, 189 reviews)
- **Burger Palace** - Gourmet Burgers (4.2⭐, 267 reviews)
- **Sakura Sushi** - Japanese Sushi (4.7⭐, 156 reviews)
- **Taco Libre** - Mexican Street Food (4.3⭐, 203 reviews)

## 🚀 Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## 📋 Development Progress

### ✅ **Completed Features**
- [x] **Project Setup** - React Native CLI with TypeScript configuration
- [x] **Dependencies** - Expo SDK, React Navigation, Redux Toolkit, Google Maps, React Native Maps
- [x] **Project Structure** - Clean, scalable folder architecture
- [x] **Navigation System** - Role-based routing with authentication flow
- [x] **Authentication System** - Complete login/register with role-based access
- [x] **Redux Store** - State management for auth, business, user, search, reviews
- [x] **Service Layer** - API clients with mock services for development
- [x] **TypeScript Interfaces** - Comprehensive type definitions
- [x] **UI Components** - Loading spinners, error boundaries, form components
- [x] **Custom Hooks** - Authentication and location services
- [x] **Google Maps Integration** - Interactive maps with restaurant discovery
- [x] **Map Components** - RestaurantMap, MapSearchBar, MapControls, RestaurantList
- [x] **Location Services** - GPS location detection and permission handling
- [x] **Restaurant Discovery** - Search, filters, markers, and list view
- [x] **Mock Data Service** - Sample restaurants with realistic data

### 🚧 **In Progress**
- [ ] **Enhanced User Interface** - Advanced search filters, restaurant details, favorites
- [ ] **Business Owner Panel** - Dashboard and restaurant management
- [ ] **Admin Panel** - Platform management and analytics
- [ ] **Firebase Integration** - Real-time database and authentication
- [ ] **Backend Integration** - Real API endpoints and data management
- [ ] **Testing & Deployment** - Unit tests, integration tests, and deployment

## 🛠️ Development Setup

### Prerequisites
- Node.js (>= 20)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shini-1/foodventurer.git
   cd foodventurer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Metro bundler**
   ```bash
   npm start
   ```

4. **Run on Android**
   ```bash
   npm run android
   ```

5. **Run on iOS**
   ```bash
   npm run ios
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
API_BASE_URL=https://your-api-domain.com/api
```

### Android Configuration
- Package name: `com.coldblooded.foodventurer`
- Minimum SDK: 21
- Target SDK: 34

## 📱 App Screenshots

*Screenshots will be added as development progresses*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Code Blooded**
- GitHub: [@shini-1](https://github.com/shini-1)
- Project: [Foodventurer](https://github.com/shini-1/foodventurer)

---

*Built with ❤️ using React Native and TypeScript*