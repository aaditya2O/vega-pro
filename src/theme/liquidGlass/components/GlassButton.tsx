import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from 'expo-blur';
import {LiquidTokens} from '../tokens';
import {useLiquidGlass} from '../LiquidGlassContext';

export type GlassButtonVariant = 'primary' | 'glass' | 'tonal' | 'destructive' | 'white';

export interface GlassButtonProps {
  children?: React.ReactNode;
  title?: string;
  variant?: GlassButtonVariant;
  compact?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean | null;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  title,
  variant = 'glass',
  compact = false,
  disabled = false,
  onPress,
  style,
  textStyle,
  icon,
  testID,
}) => {
  const {triggerHaptic} = useLiquidGlass();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.96, LiquidTokens.spring.bounce);
    triggerHaptic('impactLight');
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, LiquidTokens.spring.bounce);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const height = compact ? 38 : 48;
  const paddingHorizontal = compact ? 16 : 24;

  const content = children || (
    <Text
      style={[
        styles.defaultText,
        variant === 'primary' && styles.primaryText,
        variant === 'destructive' && styles.destructiveText,
        variant === 'white' && styles.whiteText,
        compact && styles.compactText,
        textStyle,
      ]}>
      {title}
    </Text>
  );

  if (variant === 'primary') {
    return (
      <AnimatedPressable
        testID={testID}
        disabled={Boolean(disabled)}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.buttonBase,
          styles.primaryShadow,
          {height, paddingHorizontal},
          animatedStyle,
          style,
        ]}>
        <LinearGradient
          colors={LiquidTokens.gradients.liquidPrimary as unknown as string[]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[StyleSheet.absoluteFill, {borderRadius: LiquidTokens.radii.pill}]}
        />
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          {content}
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      testID={testID}
      disabled={Boolean(disabled)}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.buttonBase,
        styles.glassBorder,
        {height, paddingHorizontal},
        variant === 'destructive' && styles.destructiveBg,
        variant === 'white' && styles.whiteBg,
        animatedStyle,
        style,
      ]}>
      <BlurView
        intensity={28}
        tint="dark"
        style={[StyleSheet.absoluteFill, {borderRadius: LiquidTokens.radii.pill}]}
      />
      <View style={styles.contentRow}>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        {content}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: LiquidTokens.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: LiquidTokens.colors.glassFillThin,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconWrap: {
    marginRight: 2,
  },
  glassBorder: {
    borderWidth: 1,
    borderColor: LiquidTokens.colors.glassBorderLight,
  },
  primaryShadow: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: LiquidTokens.colors.accentViolet,
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.6,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  destructiveBg: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  whiteBg: {
    backgroundColor: '#ffffff',
  },
  defaultText: {
    color: LiquidTokens.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  destructiveText: {
    color: '#f87171',
    fontWeight: '600',
  },
  whiteText: {
    color: '#000000',
    fontWeight: '700',
  },
  compactText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default GlassButton;
