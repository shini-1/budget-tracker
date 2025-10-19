// Main User Navigator (Regular Users)

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList, RootStackParamList } from '../types';

// Import user screens
import { HomeScreen } from '../screens/user/HomeScreen';
import { EnhancedSearchScreen } from '../screens/user/EnhancedSearchScreen';
import { UserProfileScreen } from '../screens/user/UserProfileScreen';
import { RestaurantDetailScreen } from '../screens/user/RestaurantDetailScreen';

// Import business owner screens
import { BusinessOwnerDashboard } from '../screens/owner/BusinessOwnerDashboard';
// import { AddBusinessMarker } from '../screens/owner/AddBusinessMarker'; // Temporarily disabled - needs rebuild for geolocation

// Import icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Tab Navigator for main user screens
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.divider,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={UserProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator for main user flow
export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={MainTabNavigator}
      />
      <Stack.Screen 
        name="EnhancedSearch" 
        component={EnhancedSearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="RestaurantDetail" 
        component={RestaurantDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{
          headerShown: true,
          title: 'Profile',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      {/* Business Owner Screens */}
      <Stack.Screen 
        name="BusinessOwnerDashboard" 
        component={BusinessOwnerDashboard}
        options={{
          headerShown: false,
        }}
      />
      {/* Temporarily disabled - needs app rebuild for geolocation linking
      <Stack.Screen 
        name="AddBusinessMarker" 
        component={AddBusinessMarker}
        options={{
          headerShown: false,
        }}
      />
      */}
    </Stack.Navigator>
  );
};
