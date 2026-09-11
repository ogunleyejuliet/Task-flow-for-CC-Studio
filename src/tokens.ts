/**
 * TaskFlow design tokens — JavaScript mirror of `styles/tokens.css`.
 *
 * Prefer the CSS custom properties in stylesheets; use these values only when
 * you need a token in TS (e.g. sizing logic, tests). Keep both in sync.
 */

export const cssTokens = {
  colors: {
    brand: {
      blue100: '#9EC8F8',
      blue200: '#6DA8F0',
      blue700: '#2F6DB5',
      powder: '#CFE8FF',
    },
    neutral: {
      white: '#FFFFFF',
      pageBg: '#F8FAFC',
      border: '#E5E7EB',
      borderStrong: '#D1D5DB',
      primaryText: '#111827',
      secondaryText: '#4B5563',
      mutedText: '#6B7280',
    },
    semantic: {
      success: '#16A34A',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB',
    },
  },
  font: {
    family: "'Poppins', 'Inter', system-ui, sans-serif",
    display: { size: 32, lineHeight: 40, weight: 700 },
    pageHeading: { size: 24, lineHeight: 32, weight: 700 },
    sectionHeading: { size: 18, lineHeight: 26, weight: 600 },
    body: { size: 16, lineHeight: 24, weight: 400 },
    bodySmall: { size: 14, lineHeight: 22, weight: 400 },
    caption: { size: 12, lineHeight: 18, weight: 500 },
    button: { size: 14, lineHeight: 20, weight: 600 },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    '4xl': 64,
  },
  radius: {
    small: 6,
    medium: 8,
    large: 12,
    xl: 16,
    full: 999,
  },
  controlHeight: {
    sm: 32,
    md: 40,
    lg: 44,
  },
  avatarSize: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
  },
  sidebar: {
    width: 256,
    collapsedWidth: 72,
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
} as const