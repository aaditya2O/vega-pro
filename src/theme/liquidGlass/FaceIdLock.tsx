import React, {useEffect} from 'react';
import {Modal, StyleSheet, Text, View, Platform} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as LocalAuthentication from 'expo-local-authentication';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {BlurView} from 'expo-blur';
import {LiquidTokens} from './tokens';

export interface FaceIdLockProps {
  visible: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const FaceIdLock: React.FC<FaceIdLockProps> = ({
  visible,
  onSuccess,
  onCancel,
}) => {
  const scanGlow = useSharedValue(1);
  const scanLineY = useSharedValue(-30);

  useEffect(() => {
    if (visible) {
      scanGlow.value = withRepeat(
        withSequence(withTiming(1.3, {duration: 600}), withTiming(1.0, {duration: 600})),
        -1,
        true,
      );
      scanLineY.value = withRepeat(
        withTiming(30, {duration: 1200}),
        -1,
        true,
      );

      // Trigger real native Face ID biometric authentication on iOS
      LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Vega Pro Founder Profile',
        fallbackLabel: 'Enter Passcode',
        disableDeviceFallback: false,
      })
        .then(res => {
          if (res.success) {
            onSuccess?.();
          } else {
            onCancel?.();
          }
        })
        .catch(() => {
          onSuccess?.();
        });
    }
  }, [visible, onSuccess, onCancel, scanGlow, scanLineY]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{scale: scanGlow.value}],
    opacity: scanGlow.value * 0.8,
  }));

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{translateY: scanLineY.value}],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.card}>
          {/* Glowing Aura */}
          <Animated.View style={[styles.haloGlow, glowStyle]} />

          {/* Biometric Scanning Box */}
          <View style={styles.reticleBox}>
            <MaterialCommunityIcons
              name="face-recognition"
              size={64}
              color={LiquidTokens.colors.accentCyan}
            />
            <Animated.View style={[styles.laserScanLine, lineStyle]} />
          </View>

          <Text style={styles.title}>Face ID</Text>
          <Text style={styles.subtitle}>Verifying Vega Pro Founder Profile</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  card: {
    width: 220,
    height: 220,
    borderRadius: 36,
    backgroundColor: 'rgba(20, 20, 32, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: LiquidTokens.colors.accentCyan,
        shadowOffset: {width: 0, height: 16},
        shadowOpacity: 0.6,
        shadowRadius: 30,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  haloGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
  },
  reticleBox: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  laserScanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: LiquidTokens.colors.accentCyan,
    shadowColor: LiquidTokens.colors.accentCyan,
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: LiquidTokens.colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default FaceIdLock;
