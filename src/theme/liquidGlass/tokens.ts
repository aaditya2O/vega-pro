/**
 * Vega Pro - iOS 26 Liquid Glass Design System Tokens
 * Native React Native tokens translated directly from tokens.css
 */

export const LiquidTokens = {
  // True AMOLED Blacks & Deep Cinematic Palette
  colors: {
    bgAmoled: '#000000',
    bgAbyss: '#040407',
    bgElevated: '#0a0a12',
    bgSurface: '#10101c',
    bgCard: 'rgba(22, 22, 34, 0.72)',
    bgCardHover: 'rgba(30, 30, 48, 0.85)',

    // Liquid Glass Specular & Frosted Tones
    glassFillThin: 'rgba(255, 255, 255, 0.05)',
    glassFillRegular: 'rgba(25, 25, 38, 0.65)',
    glassFillThick: 'rgba(16, 16, 26, 0.88)',
    glassFillChrome: 'rgba(255, 255, 255, 0.12)',

    glassBorderSubtle: 'rgba(255, 255, 255, 0.08)',
    glassBorderLight: 'rgba(255, 255, 255, 0.16)',
    glassBorderGlow: 'rgba(168, 140, 255, 0.35)',
    glassSpecularTop: 'rgba(255, 255, 255, 0.28)',

    // Primary Accents (iOS 26 Liquid Prism)
    accentViolet: '#8b5cf6',
    accentIndigo: '#6366f1',
    accentBlue: '#38bdf8',
    accentCyan: '#06b6d4',
    accentMagenta: '#ec4899',
    accentAmber: '#f59e0b',
    accentEmerald: '#10b981',
    accentAppleRed: '#ff3b30',

    // Text Hierarchy
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.72)',
    textTertiary: 'rgba(255, 255, 255, 0.44)',
    textQuaternary: 'rgba(255, 255, 255, 0.28)',
    textAccent: '#c4b5fd',
  },

  // Radiant Gradients (for react-native-linear-gradient)
  gradients: {
    liquidPrimary: ['#a855f7', '#6366f1', '#3b82f6'],
    liquidGlow: ['rgba(168, 85, 247, 0.5)', 'rgba(99, 102, 241, 0.4)'],
    glassBorder: ['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.05)', 'rgba(139, 92, 246, 0.3)'],
    posterMelt: [
      'rgba(0, 0, 0, 0.0)',
      'rgba(0, 0, 0, 0.25)',
      'rgba(0, 0, 0, 0.85)',
      '#000000',
    ],
    posterMeltLong: [
      'rgba(0, 0, 0, 0.0)',
      'rgba(0, 0, 0, 0.15)',
      'rgba(0, 0, 0, 0.55)',
      'rgba(0, 0, 0, 0.88)',
      '#000000',
    ],
  },

  // Apple Squircles & Radii
  radii: {
    xs: 8,
    sm: 14,
    md: 20,
    lg: 28,
    xl: 36,
    pill: 9999,
    island: 22,
  },

  // 120fps Spring Animation Configurations for Reanimated
  spring: {
    // Apple 120fps signature smooth spring
    smooth: {
      damping: 20,
      stiffness: 180,
      mass: 0.8,
    },
    // Bouncy micro-interactions (buttons, tabs, dots)
    bounce: {
      damping: 14,
      stiffness: 240,
      mass: 0.6,
    },
    // Quick snappy response (switches, toggles)
    snappy: {
      damping: 22,
      stiffness: 300,
      mass: 0.5,
    },
  },

  // Blur Intensity presets for expo-blur
  blur: {
    subtle: 16,
    glass: 35,
    deep: 60,
  },
} as const;

export type LiquidThemeTokens = typeof LiquidTokens;
