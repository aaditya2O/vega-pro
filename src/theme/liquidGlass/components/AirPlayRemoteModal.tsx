import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {BlurView} from 'expo-blur';
import {LiquidTokens} from '../tokens';
import {useLiquidGlass} from '../LiquidGlassContext';
import GlassView from './GlassView';

export interface AirPlayRemoteModalProps {
  visible: boolean;
  onClose: () => void;
  onPlayPause?: () => void;
}

export const AirPlayRemoteModal: React.FC<AirPlayRemoteModalProps> = ({
  visible,
  onClose,
  onPlayPause,
}) => {
  const {triggerHaptic} = useLiquidGlass();
  const [ripple, setRipple] = useState<{x: number; y: number} | null>(null);

  const handleTrackpadPress = (e: GestureResponderEvent) => {
    const {locationX, locationY} = e.nativeEvent;
    setRipple({x: locationX, y: locationY});
    triggerHaptic('impactLight');
    setTimeout(() => setRipple(null), 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        </Pressable>

        <GlassView
          variant="thick"
          borderRadius={36}
          style={styles.sheetContainer}>
          {/* Grabber Handle */}
          <View style={styles.grabber} />

          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={12}>
              <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
            </Pressable>
            <Text style={styles.headerTitle}>Apple TV Siri Remote</Text>
            <View style={{width: 24}} />
          </View>

          {/* Connected AirPlay Device Pill */}
          <View style={styles.devicePill}>
            <MaterialCommunityIcons
              name="apple"
              size={20}
              color={LiquidTokens.colors.accentViolet}
            />
            <View style={styles.deviceMeta}>
              <Text style={styles.deviceName}>Living Room Apple TV 4K</Text>
              <Text style={styles.deviceStatus}>Connected • Dolby Atmos 7.1</Text>
            </View>
            <MaterialCommunityIcons
              name="check-circle"
              size={18}
              color={LiquidTokens.colors.accentEmerald}
            />
          </View>

          {/* Siri Remote Glass Touch Trackpad */}
          <Pressable
            style={styles.trackpad}
            onPress={handleTrackpadPress}>
            <View style={styles.trackpadCenter}>
              <MaterialCommunityIcons
                name="gesture-swipe"
                size={34}
                color={LiquidTokens.colors.textTertiary}
              />
              <Text style={styles.trackpadLabel}>Glass Touch Surface</Text>
            </View>

            {ripple && (
              <View
                style={[
                  styles.rippleEffect,
                  {left: ripple.x - 25, top: ripple.y - 25},
                ]}
              />
            )}
          </Pressable>

          {/* Remote Buttons Matrix */}
          <View style={styles.buttonsGrid}>
            <Pressable
              style={styles.circleBtn}
              onPress={() => triggerHaptic('impactLight')}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#ffffff" />
            </Pressable>

            <Pressable
              style={styles.circleBtn}
              onPress={() => triggerHaptic('impactMedium')}>
              <MaterialCommunityIcons name="television" size={22} color="#ffffff" />
            </Pressable>

            <Pressable
              style={[styles.circleBtn, styles.circleBtnActive]}
              onPress={() => {
                triggerHaptic('impactHeavy');
                onPlayPause?.();
              }}>
              <MaterialCommunityIcons name="play-pause" size={24} color="#ffffff" />
            </Pressable>

            <Pressable
              style={styles.circleBtn}
              onPress={() => triggerHaptic('impactLight')}>
              <MaterialCommunityIcons name="volume-mute" size={22} color="#ffffff" />
            </Pressable>

            <Pressable
              style={styles.circleBtn}
              onPress={() => triggerHaptic('impactLight')}>
              <MaterialCommunityIcons name="volume-minus" size={22} color="#ffffff" />
            </Pressable>

            <Pressable
              style={styles.circleBtn}
              onPress={() => triggerHaptic('impactLight')}>
              <MaterialCommunityIcons name="volume-plus" size={22} color="#ffffff" />
            </Pressable>
          </View>
        </GlassView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheetContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: 'rgba(16, 16, 26, 0.94)',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  devicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: LiquidTokens.radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    marginBottom: 20,
    gap: 12,
  },
  deviceMeta: {
    flex: 1,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  deviceStatus: {
    fontSize: 11,
    color: LiquidTokens.colors.accentEmerald,
    marginTop: 1,
  },
  trackpad: {
    width: '100%',
    height: 220,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24,
  },
  trackpadCenter: {
    alignItems: 'center',
    gap: 8,
  },
  trackpadLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: LiquidTokens.colors.textTertiary,
  },
  rippleEffect: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: LiquidTokens.colors.accentViolet,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  circleBtn: {
    width: '30%',
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtnActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderColor: 'rgba(168, 140, 255, 0.5)',
  },
});

export default AirPlayRemoteModal;
