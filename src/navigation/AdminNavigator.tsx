// Admin Navigator

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AdminTabParamList, RootStackParamList } from '../types';

// Import admin screens
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { UserManagementScreen } from '../screens/admin/UserManagementScreen';
import { BusinessManagementScreen } from '../screens/admin/BusinessManagementScreen';
import { ReviewsManagementScreen } from '../screens/admin/ReviewsManagementScreen';
import { AdminAnalyticsScreen } from '../screens/admin/AdminAnalyticsScreen';
import { AdminSettingsScreen } from '../screens/admin/AdminSettingsScreen';

// Import icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Tab Navigator for admin screens
const AdminTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Users':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Businesses':
              iconName = focused ? 'business' : 'business-outline';
              break;
            case 'Reviews':
              iconName = focused ? 'star' : 'star-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'analytics' : 'analytics-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'grid-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
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
        name="Dashboard" 
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Users" 
        component={UserManagementScreen}
        options={{
          tabBarLabel: 'Users',
        }}
      />
      <Tab.Screen 
        name="Businesses" 
        component={BusinessManagementScreen}
        options={{
          tabBarLabel: 'Businesses',
        }}
      />
      <Tab.Screen 
        name="Reviews" 
        component={ReviewsManagementScreen}
        options={{
          tabBarLabel: 'Reviews',
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AdminAnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={AdminSettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator for admin flow
export const AdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={AdminTabNavigator}
      />
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{
          headerShown: true,
          title: 'Admin Dashboard',
          headerStyle: {
            backgroundColor: COLORS.accent,
          },
          headerTintColor: COLORS.text.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};
