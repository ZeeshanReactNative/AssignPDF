import './global.css';
import React from 'react';
import { Appearance } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';

// The app always runs in light mode, even if the phone is in dark mode
Appearance.setColorScheme('light');

const App = () => (
  <SafeAreaProvider>
      <AppNavigator />
  </SafeAreaProvider>
);

export default App;