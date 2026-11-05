import { colors } from './colors';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { fontSize, fontWeight, lineHeight, textStyles } from './typography';

export const theme = {
  colors,
  spacing,
  radius,
  shadows,
  typography: { fontSize, fontWeight, lineHeight, textStyles },
} as const;

export type Theme = typeof theme;