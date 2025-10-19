// Authentication Navigator

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import { AuthStackParamList } from '../types';

// Suppress InteractionManager deprecation warning from React Navigation
LogBox.ignoreLogs([
  'InteractionManager has been deprecated',
]);

// Import auth screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { RoleSelectionScreen } from '../screens/auth/RoleSelectionScreen';
import { BusinessSignupScreen } from '../screens/auth/BusinessSignupScreen';
import { AdminSignupScreen } from '../screens/auth/AdminSignupScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="RoleSelection"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          title: 'Welcome to Foodventurer',
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          title: 'Create Account',
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
        }}
      />
      <Stack.Screen 
        name="RoleSelection" 
        component={RoleSelectionScreen}
        options={{
          title: 'Choose Your Role',
        }}
      />
      <Stack.Screen 
        name="BusinessSignup" 
        component={BusinessSignupScreen}
        options={{
          title: 'Business Owner Signup',
        }}
      />
      <Stack.Screen 
        name="AdminSignup" 
        component={AdminSignupScreen}
        options={{
          title: 'Admin Signup',
        }}
      />
    </Stack.Navigator>
  );
};
