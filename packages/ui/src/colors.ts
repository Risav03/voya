export const Colors = {
  coral: '#FF6B6B',
  coralDark: '#FF8E53',
  teal: '#4ECDC4',
  tealDark: '#45B7AA',
  sun: '#FFD93D',
  sunDark: '#FFB830',
  mint: '#6BCB77',
  sky: '#74C0FC',
  lavender: '#C77DFF',
  bg: '#FFFBF7',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  muted: '#9BA5B7',
  border: '#F0EDE8',
} as const;

export type ColorKey = keyof typeof Colors;
