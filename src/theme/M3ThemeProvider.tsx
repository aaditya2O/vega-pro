import React, {useMemo} from 'react';
import {View} from 'react-native';
import {vars} from 'nativewind';
import {M3_COLOR_ROLES, roleToCssVar, MaterialColors} from './colors';
import {
  createCoherentAccentRoles,
  DEFAULT_SEED,
  LEGACY_NEUTRAL_SURFACE_ROLES,
} from './seeds';
import {M3HostThemeContext, M3PaletteContext} from './M3PaletteContext';
import {LiquidGlassProvider} from './liquidGlass/LiquidGlassContext';
import {LiquidTokens} from './liquidGlass/tokens';
import useThemeStore from '../lib/zustand/themeStore';

export const FIXED_THEME_PRIMARY = '#8B5CF6'; // Liquid Violet Default

const generatePalette = (seedColor: string = DEFAULT_SEED): MaterialColors => {
  const accentRoles = createCoherentAccentRoles(seedColor);

  return {
    ...accentRoles,
    ...LEGACY_NEUTRAL_SURFACE_ROLES,
    // True AMOLED Blacks & Liquid Glass Surfaces
    background: LiquidTokens.colors.bgAmoled,
    onBackground: '#F2F2F2',
    surface: LiquidTokens.colors.bgAmoled,
    onSurface: '#F2F2F2',
    surfaceVariant: LiquidTokens.colors.bgElevated,
    onSurfaceVariant: '#C4C4C4',
    surfaceContainerLowest: LiquidTokens.colors.bgAmoled,
    surfaceContainerLow: LiquidTokens.colors.bgAbyss,
    surfaceContainer: LiquidTokens.colors.bgElevated,
    surfaceContainerHigh: LiquidTokens.colors.bgSurface,
    surfaceContainerHighest: 'rgba(30, 30, 48, 0.85)',
    outline: LiquidTokens.colors.glassBorderLight,
    outlineVariant: LiquidTokens.colors.glassBorderSubtle,
    scrim: '#000000',
    surfaceBright: '#181824',
    surfaceDim: '#000000',
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
  } as MaterialColors;
};

export const M3ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const primary = useThemeStore(state => state.primary);
  const source = useThemeStore(state => state.source);

  const palette = useMemo(() => {
    const seed = source === 'custom' ? primary : DEFAULT_SEED;
    return generatePalette(seed);
  }, [primary, source]);

  const hostTheme = useMemo(
    () => ({
      colorScheme: 'dark' as const,
      ...(source === 'custom' ? {seedColor: primary} : {}),
    }),
    [primary, source],
  );

  const style = useMemo(() => {
    const entries = M3_COLOR_ROLES.map(role => [
      roleToCssVar(role),
      palette[role],
    ]);
    return vars(Object.fromEntries(entries));
  }, [palette]);

  return (
    <M3HostThemeContext.Provider value={hostTheme}>
      <M3PaletteContext.Provider value={palette}>
        <LiquidGlassProvider>
          <View style={[{flex: 1, backgroundColor: LiquidTokens.colors.bgAmoled}, style]}>
            {children}
          </View>
        </LiquidGlassProvider>
      </M3PaletteContext.Provider>
    </M3HostThemeContext.Provider>
  );
};

export {useM3Colors} from './M3PaletteContext';
