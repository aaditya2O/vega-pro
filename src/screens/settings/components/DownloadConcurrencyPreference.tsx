import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Surface from '../../../components/ui/Surface';
import AppText from '../../../components/ui/Text';
import {updateDownloadConcurrency} from '../../../lib/downloadManager';
import {settingsStorage} from '../../../lib/storage';
import {useM3Colors} from '../../../theme/M3PaletteContext';
import {LiquidTokens} from '../../../theme/liquidGlass/tokens';

const MIN_CONCURRENCY = 1;
const MAX_CONCURRENCY = 5;

const DownloadConcurrencyPreference = ({
  primary: _primary,
}: {
  primary: string;
}) => {
  const colors = useM3Colors();
  const [concurrency, setConcurrency] = useState(
    settingsStorage.getDownloadConcurrency(),
  );

  const update = useCallback((val: number) => {
    try {
      if (settingsStorage.isHapticFeedbackEnabled()) {
        ReactNativeHapticFeedback.trigger('impactLight', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
      }
    } catch {}
    setConcurrency(val);
    updateDownloadConcurrency(val);
  }, []);

  return (
    <View style={{marginBottom: 24}}>
      <AppText role="labelLarge" style={{color: LiquidTokens.colors.textTertiary, marginBottom: 8}}>
        Downloads & Storage
      </AppText>
      <Surface level="low">
        <View style={{padding: 16}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flex: 1, marginRight: 16}}>
              <AppText role="bodyLarge" style={{color: '#ffffff', fontWeight: '600'}}>
                Concurrent Downloads
              </AppText>
              <AppText role="bodySmall" style={{color: LiquidTokens.colors.textTertiary, marginTop: 2}}>
                Active parallel download pipelines
              </AppText>
            </View>
            <View
              style={{
                borderRadius: LiquidTokens.radii.pill,
                paddingHorizontal: 12,
                paddingVertical: 4,
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderWidth: 1,
                borderColor: 'rgba(168, 140, 255, 0.4)',
              }}>
              <AppText
                testID="download-concurrency-value"
                role="titleSmall"
                style={{color: LiquidTokens.colors.textAccent, fontWeight: '700'}}>
                {concurrency} Active
              </AppText>
            </View>
          </View>

          {/* Stepper buttons: 1, 2, 3, 4, 5 */}
          <View style={styles.stepperRow}>
            {[1, 2, 3, 4, 5].map(num => {
              const isSelected = concurrency === num;
              return (
                <Pressable
                  key={num}
                  onPress={() => update(num)}
                  style={[
                    styles.stepperBtn,
                    isSelected && styles.stepperBtnActive,
                  ]}>
                  <AppText
                    role="labelLarge"
                    style={{
                      color: isSelected ? '#ffffff' : LiquidTokens.colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    }}>
                    {num}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 16,
  },
  stepperBtn: {
    flex: 1,
    height: 40,
    borderRadius: LiquidTokens.radii.pill,
    backgroundColor: LiquidTokens.colors.glassFillRegular,
    borderWidth: 1,
    borderColor: LiquidTokens.colors.glassBorderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.35)',
    borderColor: 'rgba(168, 140, 255, 0.6)',
  },
});

export default DownloadConcurrencyPreference;
