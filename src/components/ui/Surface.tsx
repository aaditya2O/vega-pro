import React from 'react';
import {StyleSheet, View, ViewProps, Platform} from 'react-native';
import {BlurView} from 'expo-blur';
import {useM3Colors} from '../../theme/M3PaletteContext';
import {LiquidTokens} from '../../theme/liquidGlass/tokens';

type SurfaceLevel = 'lowest' | 'low' | 'default' | 'high' | 'highest';

interface SurfaceProps extends ViewProps {
  level?: SurfaceLevel;
  outlined?: boolean;
}

const Surface = ({
  level = 'default',
  outlined = false,
  style,
  children,
  ...props
}: SurfaceProps) => {
  const colors = useM3Colors();
  const backgrounds: Record<SurfaceLevel, string> = {
    lowest: LiquidTokens.colors.bgAmoled,
    low: LiquidTokens.colors.bgAbyss,
    default: LiquidTokens.colors.glassFillRegular,
    high: LiquidTokens.colors.glassFillThick,
    highest: 'rgba(30, 30, 48, 0.92)',
  };

  const isFrosted = level === 'default' || level === 'high' || level === 'highest';

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: backgrounds[level],
          borderColor: outlined ? colors.outline : LiquidTokens.colors.glassBorderSubtle,
          borderWidth: outlined ? 1 : 0.5,
        },
        style,
      ]}
      {...props}>
      {isFrosted && (
        <BlurView
          intensity={30}
          tint="dark"
          style={[StyleSheet.absoluteFill, {borderRadius: LiquidTokens.radii.lg}]}
        />
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: LiquidTokens.radii.lg,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.5,
        shadowRadius: 18,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});

export default Surface;
