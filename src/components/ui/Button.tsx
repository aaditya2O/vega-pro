import React, {ReactNode} from 'react';
import {
  ColorValue,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {useM3Colors} from '../../theme/M3PaletteContext';
import {LiquidTokens} from '../../theme/liquidGlass/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant =
  | 'filled'
  | 'tonal'
  | 'outlined'
  | 'text'
  | 'destructive'
  | 'white';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  compact?: boolean;
  disabled?: boolean | null;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
  containerColor?: ColorValue;
  contentColor?: ColorValue;
}

const Button = ({
  children,
  variant = 'filled',
  compact = false,
  disabled = false,
  onPress,
  style,
  testID,
  containerColor,
  contentColor,
}: ButtonProps) => {
  const colors = useM3Colors();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.96, LiquidTokens.spring.bounce);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, LiquidTokens.spring.bounce);
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const height = compact ? 38 : 48;
  const paddingHorizontal = compact ? 16 : 24;

  const isGradient = variant === 'filled' && !containerColor;

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{disabled: Boolean(disabled)}}
      disabled={Boolean(disabled)}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.base,
        {
          height,
          paddingHorizontal,
          backgroundColor: isGradient
            ? 'transparent'
            : (containerColor as string) ||
              (variant === 'tonal'
                ? colors.secondaryContainer
                : variant === 'outlined'
                  ? 'transparent'
                  : variant === 'white'
                    ? '#ffffff'
                    : variant === 'destructive'
                      ? colors.error
                      : colors.primary),
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderColor: colors.outline,
          opacity: disabled ? 0.45 : 1,
        },
        animStyle,
        style,
      ]}>
      {isGradient && (
        <LinearGradient
          colors={LiquidTokens.gradients.liquidPrimary as unknown as string[]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.contentWrap}>
        {typeof children === 'string' ? (
          <Text
            style={[
              styles.text,
              {
                color:
                  (contentColor as string) ||
                  (variant === 'white'
                    ? '#000000'
                    : variant === 'outlined' || variant === 'text'
                      ? colors.primary
                      : variant === 'destructive'
                        ? colors.onError
                        : colors.onPrimary),
                fontSize: compact ? 13 : 15,
              },
            ]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: LiquidTokens.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: LiquidTokens.colors.accentViolet,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contentWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

export default Button;
