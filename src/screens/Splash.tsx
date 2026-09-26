import React, {useEffect} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import Svg, {Defs, LinearGradient, Stop, Path, Circle} from 'react-native-svg';
import {StatusBar} from 'expo-status-bar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LiquidTokens} from '../theme/liquidGlass/tokens';
import GlassView from '../theme/liquidGlass/components/GlassView';

export interface SplashProps {
  onFinish: () => void;
}

export const Splash: React.FC<SplashProps> = ({onFinish}) => {
  const insets = useSafeAreaInsets();

  // Animation values
  const logoScale = useSharedValue(0.75);
  const logoOpacity = useSharedValue(0);
  const haloGlow = useSharedValue(0.4);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoScale.value = withSpring(1.0, {damping: 14, stiffness: 100});
    logoOpacity.value = withTiming(1, {duration: 800});

    // Halo pulse
    haloGlow.value = withRepeat(
      withSequence(
        withTiming(0.85, {duration: 1200, easing: Easing.inOut(Easing.ease)}),
        withTiming(0.4, {duration: 1200, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );

    // Progress bar
    progressWidth.value = withTiming(1, {duration: 2200, easing: Easing.bezier(0.25, 0.1, 0.25, 1)});

    const timer = setTimeout(() => {
      onFinish();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{scale: logoScale.value}],
    opacity: logoOpacity.value,
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: haloGlow.value,
    transform: [{scale: 1 + haloGlow.value * 0.2}],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <Pressable style={styles.container} onPress={onFinish}>
      <StatusBar style="light" />

      {/* Ambient Radial Halo */}
      <Animated.View style={[styles.halo, haloStyle]} />

      {/* Center Prism Logo */}
      <Animated.View style={[styles.centerWrap, logoStyle]}>
        <GlassView
          variant="regular"
          borderRadius={38}
          intensity={40}
          style={styles.glassCard}>
          <Svg width={96} height={96} viewBox="0 0 100 100" fill="none">
            <Defs>
              <LinearGradient id="vegaGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                <Stop offset="50%" stopColor="#A88CFF" stopOpacity="1" />
                <Stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Path
              d="M20 22 L50 82 L80 22"
              stroke="url(#vegaGrad)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="50" cy="50" r="7" fill="#FFFFFF" />
          </Svg>
        </GlassView>

        <Text style={styles.title}>VEGA PRO</Text>
        <Text style={styles.tagline}>Cinematic Immersion • iOS 26</Text>
      </Animated.View>

      {/* Footer Progress Indicator */}
      <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 24) + 16}]}>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, progressStyle]} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LiquidTokens.colors.bgAmoled,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  halo: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(139, 92, 246, 0.18)',
    top: '28%',
  },
  centerWrap: {
    alignItems: 'center',
  },
  glassCard: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1.5,
    color: LiquidTokens.colors.textSecondary,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  progressBarBg: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: LiquidTokens.colors.accentCyan,
  },
});

export default Splash;
