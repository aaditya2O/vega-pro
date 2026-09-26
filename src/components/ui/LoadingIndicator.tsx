import React from 'react';
import {ActivityIndicator, StyleSheet, View, ViewStyle} from 'react-native';
import {useM3Colors} from '../../theme/M3PaletteContext';
import {LiquidTokens} from '../../theme/liquidGlass/tokens';

interface LoadingIndicatorProps {
  contained?: boolean;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const LoadingIndicator = ({
  contained = false,
  size: indicatorSize = 40,
  color,
  style,
}: LoadingIndicatorProps) => {
  const colors = useM3Colors();
  const indicatorColor = color || LiquidTokens.colors.accentViolet || colors.primary;

  return (
    <View
      style={[
        styles.container,
        contained && styles.contained,
        {
          width: contained ? indicatorSize + 20 : indicatorSize,
          height: contained ? indicatorSize + 20 : indicatorSize,
        },
        style,
      ]}>
      <ActivityIndicator size="small" color={indicatorColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  contained: {
    borderRadius: 999,
    backgroundColor: LiquidTokens.colors.glassFillRegular,
    borderWidth: 1,
    borderColor: LiquidTokens.colors.glassBorderLight,
  },
});

export default LoadingIndicator;
