/** @type {import('tailwindcss').Config} */

const { colors } = require('./src/theme/colors.ts');
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    // extend: {
    //   colors: {
    //     primary: {
    //       DEFAULT: '#2457E8',
    //       dark: '#1A43BD',
    //       light: '#EAF0FF',
    //     },
    //     secondary: {
    //       DEFAULT: '#e32117',
    //       light: '#E0F4FE',
    //     },
    //     background: '#F5F7FB',
    //     surface: '#FFFFFF',
    //     text: {
    //       primary: '#172033',
    //       secondary: '#667085',
    //       muted: '#98A2B3',
    //       inverse: '#FFFFFF',
    //     },
    //     border: {
    //       DEFAULT: '#E5E7EB',
    //       strong: '#D0D5DD',
    //     },
    //     success: {
    //       DEFAULT: '#12B76A',
    //       light: '#E7F8F0',
    //     },
    //     warning: {
    //       DEFAULT: '#F79009',
    //       light: '#FEF3E2',
    //     },
    //     error: {
    //       DEFAULT: '#e32117',
    //       light: '#e32117',
    //     },
    //   },
    // },
     extend: {
      colors,
    }
  },
  plugins: [],
};
