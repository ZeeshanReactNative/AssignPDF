export const colors = {
   primary: {
    DEFAULT: '#12397A', // navy: header, logo, active tab
    dark: '#0D2B5E',
    light: '#E8EEF9',
  },

  accent: {
    DEFAULT: '#F26B1D', // orange: New Document, Export PDF
    dark: '#D95A10',
    light: '#FEEDE0',
  },

  background: '#F5F7FB',
  surface: '#FFFFFF',

  text: {
    primary: '#12285A',
    secondary: '#667085',
    muted: '#98A2B3',
    inverse: '#FFFFFF',
  },

  border: {
    DEFAULT: '#E5E7EB',
    strong: '#D0D5DD',
  },

  success: { DEFAULT: '#12B76A', light: '#E7F8F0' },
  warning: { DEFAULT: '#F79009', light: '#FEF3E2' },
  error: { DEFAULT: '#E5484D', light: '#FDECEC' },
} as const;
export type AppColors = typeof colors;