/**
 * Foodventurer - Restaurant Discovery App
 * Built with React Native and TypeScript
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/constants';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={COLORS.primary}
        />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
