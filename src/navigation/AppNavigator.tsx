// Main App Navigator with Authentication Flow

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadStoredAuth } from '../store/slices/authSlice';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Import navigators
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { BusinessNavigator } from './BusinessNavigator';
import { AdminNavigator } from './AdminNavigator';

// Import types
import { RootStackParamList, UserRole } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Load stored authentication on app start
    dispatch(loadStoredAuth());
  }, [dispatch]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner text="Loading Foodventurer..." />;
  }

  const getNavigatorForUser = () => {
    if (!isAuthenticated || !user) {
      return <AuthNavigator />;
    }

    switch (user.role) {
      case 'business_owner':
        return <BusinessNavigator />;
      case 'admin':
        return <AdminNavigator />;
      case 'user':
      default:
        return <MainNavigator />;
    }
  };

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          {getNavigatorForUser()}
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};
