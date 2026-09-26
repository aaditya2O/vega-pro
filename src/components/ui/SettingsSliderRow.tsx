import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, {useCallback, useRef, useState} from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {settingsStorage} from '../../lib/storage';
import {useM3Colors} from '../../theme/M3PaletteContext';
import {LiquidTokens} from '../../theme/liquidGlass/tokens';
import AppText from './Text';

interface SettingsSliderRowProps {
  title: string;
  description?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  value: number;
  min: number;
  max: number;
  step?: number;
  valueDisplay?: string | number;
  onValueChange: (value: number) => void;
  onValueChangeFinished?: (value: number) => void;
  divider?: boolean;
}

const SettingsSliderRow = ({
  title,
  description,
  icon,
  value,
  min,
  max,
  step = 1,
  valueDisplay,
  onValueChange,
  onValueChangeFinished,
  divider = true,
}: SettingsSliderRowProps) => {
  const colors = useM3Colors();
  const [trackWidth, setTrackWidth] = useState(200);
  const prevValueRef = useRef(value);

  const triggerHaptic = useCallback(() => {
    try {
      if (settingsStorage.isHapticFeedbackEnabled()) {
        ReactNativeHapticFeedback.trigger('effectTick', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
      }
    } catch {}
  }, []);

  const calculateValueFromPosition = useCallback(
    (x: number) => {
      const ratio = Math.max(0, Math.min(1, x / trackWidth));
      let rawVal = min + ratio * (max - min);
      if (step > 0) {
        rawVal = Math.round((rawVal - min) / step) * step + min;
      }
      return Math.max(min, Math.min(max, rawVal));
    },
    [min, max, step, trackWidth],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const next = calculateValueFromPosition(gestureState.x0 + gestureState.dx);
        if (next !== prevValueRef.current) {
          prevValueRef.current = next;
          triggerHaptic();
          onValueChange(next);
        }
      },
      onPanResponderRelease: () => {
        triggerHaptic();
        onValueChangeFinished?.(prevValueRef.current);
      },
    }),
  ).current;

  const display = valueDisplay !== undefined ? valueDisplay : value;
  const fillRatio = Math.max(0, Math.min(1, (value - min) / (max - min)));

  return (
    <View
      style={[
        styles.rowContainer,
        {borderBottomColor: colors.outlineVariant, borderBottomWidth: divider ? 1 : 0},
      ]}>
      <View style={styles.topInfoRow}>
        <View style={styles.iconAndTitle}>
          {icon && (
            <View
              style={[
                styles.iconWrap,
                {backgroundColor: LiquidTokens.colors.glassFillRegular},
              ]}>
              <MaterialCommunityIcons
                name={icon}
                size={21}
                color={LiquidTokens.colors.accentViolet}
              />
            </View>
          )}
          <View style={styles.textWrap}>
            <AppText role="bodyLarge" style={{color: '#ffffff', fontWeight: '600'}}>
              {title}
            </AppText>
            {description && (
              <AppText role="bodySmall" style={{color: LiquidTokens.colors.textTertiary}}>
                {description}
              </AppText>
            )}
          </View>
        </View>

        <View style={styles.valueBadge}>
          <Text style={styles.badgeText}>{display}</Text>
        </View>
      </View>

      {/* Custom Liquid Glass Slider Track */}
      <View
        style={styles.trackContainer}
        onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}>
        <View style={styles.trackBackground}>
          <View
            style={[
              styles.trackFill,
              {
                width: `${fillRatio * 100}%`,
                backgroundColor: LiquidTokens.colors.accentViolet,
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.sliderThumb,
            {left: `${fillRatio * 100}%`},
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: LiquidTokens.colors.glassBorderSubtle,
  },
  textWrap: {
    flex: 1,
  },
  valueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: LiquidTokens.radii.pill,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(168, 140, 255, 0.4)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: LiquidTokens.colors.textAccent,
  },
  trackContainer: {
    height: 28,
    justifyContent: 'center',
    position: 'relative',
  },
  trackBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ffffff',
    marginLeft: -9,
    shadowColor: LiquidTokens.colors.accentViolet,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});

export default SettingsSliderRow;
