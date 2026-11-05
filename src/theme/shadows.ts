import type { ViewStyle } from 'react-native';

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg';

const shadowColor = '#101828';

// Android par `elevation` kaam karti hai, iOS par baqi properties.
export const shadows: Record<ShadowLevel, ViewStyle> = {
  none: {},
  sm: {
    shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};