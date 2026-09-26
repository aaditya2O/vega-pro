import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, {useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import {BlurView} from 'expo-blur';
import {useM3Colors} from '../../theme/M3PaletteContext';
import {LiquidTokens} from '../../theme/liquidGlass/tokens';

interface DropdownFieldProps<T> {
  options: readonly T[];
  value?: T;
  getKey: (option: T) => string;
  getLabel: (option: T) => string;
  onChange: (option: T) => void;
  placeholder?: string;
  showFullOptionLabels?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}

const DropdownField = <T,>({
  options,
  value,
  getKey,
  getLabel,
  onChange,
  placeholder = 'Select',
  showFullOptionLabels = false,
  style,
  disabled = false,
}: DropdownFieldProps<T>) => {
  const colors = useM3Colors();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedKey = value ? getKey(value) : undefined;
  const selectedOption = options.find(option => getKey(option) === selectedKey);
  const selectedLabel = selectedOption ? getLabel(selectedOption) : placeholder;

  return (
    <View style={[{width: '100%'}, style]}>
      {/* Trigger Button */}
      <Pressable
        disabled={disabled}
        onPress={() => setModalVisible(true)}
        style={[
          styles.triggerBox,
          {
            backgroundColor: LiquidTokens.colors.glassFillThin,
            borderColor: LiquidTokens.colors.glassBorderLight,
            opacity: disabled ? 0.45 : 1,
          },
        ]}>
        <Text
          style={[
            styles.triggerLabel,
            {color: selectedOption ? '#ffffff' : LiquidTokens.colors.textTertiary},
          ]}
          numberOfLines={1}>
          {selectedLabel}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={LiquidTokens.colors.accentViolet}
        />
      </Pressable>

      {/* iOS Liquid Glass Modal Picker Sheet */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          </Pressable>

          <View style={styles.pickerSheet}>
            <View style={styles.grabber} />
            <Text style={styles.pickerTitle}>{placeholder}</Text>

            <FlatList
              data={options as T[]}
              keyExtractor={item => getKey(item)}
              style={styles.optionsList}
              renderItem={({item}) => {
                const isSelected = getKey(item) === selectedKey;
                return (
                  <Pressable
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    onPress={() => {
                      onChange(item);
                      setModalVisible(false);
                    }}>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}>
                      {getLabel(item)}
                    </Text>
                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={LiquidTokens.colors.accentViolet}
                      />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  triggerBox: {
    height: 52,
    borderRadius: LiquidTokens.radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  triggerLabel: {
    fontSize: 14.5,
    fontWeight: '500',
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  pickerSheet: {
    maxHeight: '65%',
    backgroundColor: 'rgba(20, 20, 32, 0.94)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: LiquidTokens.colors.glassBorderLight,
    paddingTop: 16,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  grabber: {
    width: 38,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  optionsList: {
    maxHeight: 380,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: LiquidTokens.radii.md,
    marginBottom: 6,
  },
  optionItemSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  optionText: {
    fontSize: 15,
    color: LiquidTokens.colors.textSecondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

export default DropdownField;
