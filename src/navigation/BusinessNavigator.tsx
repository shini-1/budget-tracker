// Business Owner Navigator

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BusinessTabParamList, RootStackParamList } from '../types';

// Import business screens
import { BusinessDashboardScreen } from '../screens/business/BusinessDashboardScreen';
import { MenuManagementScreen } from '../screens/business/MenuManagementScreen';
import { ReviewsManagementScreen } from '../screens/business/ReviewsManagementScreen';
import { BusinessAnalyticsScreen } from '../screens/business/BusinessAnalyticsScreen';
import { BusinessSettingsScreen } from '../screens/business/BusinessSettingsScreen';
import { AddRestaurantScreen } from '../screens/business/AddRestaurantScreen';

// Import icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator<BusinessTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Tab Navigator for business owner screens
const BusinessTabNavigator: React.FC = () => {
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
            case 'Menu':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
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
        tabBarActiveTintColor: COLORS.secondary,
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
        component={BusinessDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Menu" 
        component={MenuManagementScreen}
        options={{
          tabBarLabel: 'Menu',
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
        component={BusinessAnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={BusinessSettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator for business owner flow
export const BusinessNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={BusinessTabNavigator}
      />
      <Stack.Screen 
        name="BusinessProfile" 
        component={BusinessSettingsScreen}
        options={{
          headerShown: true,
          title: 'Business Settings',
          headerStyle: {
            backgroundColor: COLORS.secondary,
          },
          headerTintColor: COLORS.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="AddRestaurant" 
        component={AddRestaurantScreen}
        options={{
          headerShown: true,
          title: 'Add Restaurant',
          headerStyle: {
            backgroundColor: COLORS.secondary,
          },
          headerTintColor: COLORS.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="CreateBusiness" 
        component={AddRestaurantScreen}
        options={{
          headerShown: true,
          title: 'Create Business',
          headerStyle: {
            backgroundColor: COLORS.secondary,
          },
          headerTintColor: COLORS.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};
