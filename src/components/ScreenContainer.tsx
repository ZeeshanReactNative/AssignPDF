import React, { type ReactNode } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { cn } from '../utils/cn';

const DEFAULT_EDGES: Edge[] = ['top', 'bottom', 'left', 'right'];

export interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  edges?: Edge[];
  className?: string;
}

export const ScreenContainer = ({
  children,
  scrollable = false,
  padded = true,
  edges = DEFAULT_EDGES,
  className,
}: ScreenContainerProps) => (
  <SafeAreaView style={styles.safeArea} edges={edges}>
    <StatusBar
      barStyle="dark-content"
      backgroundColor={colors.background}
    />
    {scrollable ? (
      <ScrollView
        className="flex-1"
        contentContainerClassName={cn('grow', padded && 'px-5 py-4', className)}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    ) : (
      <View className={cn('flex-1', padded && 'px-5 py-4', className)}>
        {children}
      </View>
    )}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});