import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import {BlurView} from 'expo-blur';
import {useM3Colors} from '../../theme/M3PaletteContext';
import {LiquidTokens} from '../../theme/liquidGlass/tokens';

interface MaterialDialogSurfaceProps {
  visible: boolean;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss: () => void;
  style?: ViewStyle;
}

const MaterialDialogSurface = ({
  visible,
  children,
  dismissible = true,
  onDismiss,
  style,
}: MaterialDialogSurfaceProps) => {
  const colors = useM3Colors();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (dismissible) onDismiss();
      }}>
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            if (dismissible) onDismiss();
          }}>
          <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
        </Pressable>

        <View style={[styles.dialogCard, style]}>
          <BlurView
            intensity={45}
            tint="dark"
            style={[StyleSheet.absoluteFill, {borderRadius: LiquidTokens.radii.xl}]}
          />
          {children}
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    padding: 24,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: LiquidTokens.radii.xl,
    backgroundColor: 'rgba(20, 20, 32, 0.88)',
    borderWidth: 1,
    borderColor: LiquidTokens.colors.glassBorderLight,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 16},
        shadowOpacity: 0.6,
        shadowRadius: 28,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});

export default MaterialDialogSurface;
