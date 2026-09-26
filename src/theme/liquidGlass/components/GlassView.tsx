import React from 'react';
import {StyleSheet, View, ViewProps, ViewStyle, Platform} from 'react-native';
import {BlurView} from 'expo-blur';
import {LiquidTokens} from '../tokens';

export type GlassVariant = 'regular' | 'thin' | 'thick' | 'chrome';

export interface GlassViewProps extends ViewProps {
  intensity?: number;
  tint?: 'dark' | 'light' | 'default';
  variant?: GlassVariant;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  hasSpecularTop?: boolean;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

export const GlassView: React.FC<GlassViewProps> = ({
  intensity = 35,
  tint = 'dark',
  variant = 'regular',
  borderRadius = LiquidTokens.radii.lg,
  borderWidth = 1,
  borderColor,
  hasSpecularTop = true,
  style,
  children,
  ...props
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'thin':
        return LiquidTokens.colors.glassFillThin;
      case 'thick':
        return LiquidTokens.colors.glassFillThick;
      case 'chrome':
        return LiquidTokens.colors.glassFillChrome;
      case 'regular':
      default:
        return LiquidTokens.colors.glassFillRegular;
    }
  };

  const resolvedBorderColor = borderColor || LiquidTokens.colors.glassBorderLight;

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          borderWidth,
          borderColor: resolvedBorderColor,
          backgroundColor: getBackgroundColor(),
        },
        style,
      ]}
      {...props}>
      {/* Native Blur on iOS, soft translucent overlay on Android/Web */}
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[StyleSheet.absoluteFill, {borderRadius}]}
      />

      {/* Specular Highlight Rim on top edge */}
      {hasSpecularTop && (
        <View
          pointerEvents="none"
          style={[
            styles.specularRim,
            {
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
            },
          ]}
        />
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 12},
        shadowOpacity: 0.45,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  specularRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: LiquidTokens.colors.glassSpecularTop,
  },
});

export default GlassView;
