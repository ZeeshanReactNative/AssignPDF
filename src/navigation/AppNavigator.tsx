import React from 'react';
import {
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

import { colors } from '../theme/colors';
import type { RootStackParamList } from './types';
import TemplatesScreen from '../screens/TemplatesScreen';
import EditorScreen from '../screens/PageEditorScreen';
import PreviewScreen from '../screens/PreviewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Navigation ka theme bhi hamare colors se banta hai
const navigationTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary.DEFAULT,
    background: colors.background,
    card: colors.surface,
    text: colors.text.primary,
    border: colors.border.DEFAULT,
    notification: colors.error.DEFAULT,
  },
};

export const AppNavigator = () => (
  <NavigationContainer theme={navigationTheme}>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
       <Stack.Screen name="Templates" component={TemplatesScreen} />
       <Stack.Screen name="Editor" component={EditorScreen} />
       <Stack.Screen name="Preview" component={PreviewScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);