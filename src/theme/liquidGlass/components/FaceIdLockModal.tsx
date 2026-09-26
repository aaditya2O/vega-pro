import React, {useEffect} from 'react';
import {Modal, StyleSheet, Text, View, Platform} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {BlurView} from 'expo-blur';
import {LiquidTokens} from '../tokens';

export interface FaceIdLockModalProps {
  visible: boolean;
  onSuccess?: () => void;
}

export const FaceIdLockModal: React.FC<FaceIdLockModalProps> = ({
  visible,
  onSuccess,
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
    }
  }, [visible]);

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
    backgroundColor: 'rgba(6, 182, 212, 0.25)',
  },
  reticleBox: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  laserScanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: LiquidTokens.colors.accentCyan,
    shadowColor: LiquidTokens.colors.accentCyan,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 14,
  },
  subtitle: {
    fontSize: 11,
    color: LiquidTokens.colors.accentCyan,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default FaceIdLockModal;
