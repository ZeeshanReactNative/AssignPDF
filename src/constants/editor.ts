export const DEFAULT_FONT_SIZE = 10;
export const DEFAULT_TEXT_COLOR = '#000000';

// name: toolbar mein dikhne wala naam
// stack: CSS font-family (fallback ke saath, taake device par font na ho to bhi chale)
export const FONT_FAMILIES = [
  { name: 'Arial', stack: "Arial, Helvetica, sans-serif" },
  { name: 'Times New Roman', stack: "'Times New Roman', Times, serif" },
  { name: 'Courier New', stack: "'Courier New', Courier, monospace" },
  { name: 'Georgia', stack: "Georgia, serif" },
  { name: 'Verdana', stack: "Verdana, Geneva, sans-serif" },
] as const;

export const DEFAULT_FONT_FAMILY = FONT_FAMILIES[0];

export const FONT_SIZES = [9, 10, 11, 12, 13, 14, 15, 16] as const;

// Hex hamesha UPPERCASE
export const TEXT_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Purple', value: '#9333EA' },
  { name: 'Pink', value: '#DB2777' },
] as const;

export const ALIGNMENTS = [
  { value: 'left', icon: 'alignLeft' },
  { value: 'center', icon: 'alignCenter' },
  { value: 'right', icon: 'alignRight' },
   { value: 'justify', icon: 'alignJustify' },
] as const;