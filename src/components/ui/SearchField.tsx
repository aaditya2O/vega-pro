import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {BlurView} from 'expo-blur';
import {useM3Colors} from '../../theme/M3PaletteContext';
import {LiquidTokens} from '../../theme/liquidGlass/tokens';

interface SearchFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: (value: string) => void;
  onFocusChange?: (focused: boolean) => void;
  placeholder?: string;
  onVoicePress?: () => void;
}

export interface SearchFieldRef {
  focus: () => void;
}

const SearchField = forwardRef<SearchFieldRef, SearchFieldProps>(
  (
    {
      value,
      onChangeText,
      onSubmit,
      onFocusChange,
      placeholder = 'Ask Vega AI or search titles...',
      onVoicePress,
    },
    ref,
  ) => {
    const colors = useM3Colors();
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    return (
      <View style={styles.container}>
        <BlurView
          intensity={30}
          tint="dark"
          style={[StyleSheet.absoluteFill, {borderRadius: LiquidTokens.radii.pill}]}
        />

        {/* Leading Search Icon */}
        <MaterialCommunityIcons
          name="magnify"
          size={22}
          color={LiquidTokens.colors.accentViolet}
          style={styles.leadingIcon}
        />

        {/* Text Input */}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() => onSubmit(value)}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          placeholder={placeholder}
          placeholderTextColor={LiquidTokens.colors.textTertiary}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
        />

        {/* Clear Button or Voice Button */}
        {value.length > 0 ? (
          <Pressable
            hitSlop={10}
            onPress={() => onChangeText('')}
            style={styles.trailingBtn}>
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color={LiquidTokens.colors.textTertiary}
            />
          </Pressable>
        ) : (
          <Pressable
            hitSlop={10}
            onPress={onVoicePress}
            style={styles.trailingBtn}>
            <MaterialCommunityIcons
              name="microphone"
              size={20}
              color={LiquidTokens.colors.accentViolet}
            />
          </Pressable>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 52,
    borderRadius: LiquidTokens.radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: LiquidTokens.colors.glassBorderLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  leadingIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 0,
  },
  trailingBtn: {
    padding: 4,
  },
});

export default SearchField;
