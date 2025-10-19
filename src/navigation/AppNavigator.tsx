// Main App Navigator with Authentication Flow

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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

  const renderNavigator = () => {
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <NavigationContainer>
          {renderNavigator()}
        </NavigationContainer>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
};
