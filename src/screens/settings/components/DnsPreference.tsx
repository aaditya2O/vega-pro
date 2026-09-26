import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { Switch, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from '../../../lib/utils/toast';
import { settingsStorage } from '../../../lib/storage';
import {
  DOH_PROVIDERS,
  DohProviderValue,
  syncDohSettings,
} from '../../../lib/services/dohService';
import { getWarpStatus, toggleWarp } from '../../../lib/services/warpService';
import {
  DEFAULT_BYEDPI_ARGS,
  BYEDPI_PRESETS,
  getByeDpiStatus,
  toggleByeDpi,
} from '../../../lib/services/byeDpiService';
import { useM3Colors } from '../../../theme/M3PaletteContext';
import AppText from '../../../components/ui/Text';
import DropdownField from '../../../components/ui/DropdownField';

const DnsPreference = () => {
  const colors = useM3Colors();

  const [warpEnabled, setWarpEnabledState] = useState<boolean>(
    settingsStorage.isWarpEnabled(),
  );
  const [isWarpBusy, setIsWarpBusy] = useState<boolean>(false);
  const [warpPort, setWarpPort] = useState<number | null>(null);

  const [byeDpiEnabled, setByeDpiEnabledState] = useState<boolean>(
    settingsStorage.isByeDpiEnabled(),
  );
  const [isByeDpiBusy, setIsByeDpiBusy] = useState<boolean>(false);
  const [byeDpiPort, setByeDpiPort] = useState<number | null>(null);
  const [byeDpiArgs, setByeDpiArgs] = useState(
    settingsStorage.getByeDpiCmdArgs() || DEFAULT_BYEDPI_ARGS,
  );
  const [showArgsEditor, setShowArgsEditor] = useState<boolean>(false);

  useEffect(() => {
    getWarpStatus()
      .then(res => {
        if (res.running && res.port) setWarpPort(res.port);
      })
      .catch(() => { });
    getByeDpiStatus()
      .then(res => {
        if (res.running && res.port) setByeDpiPort(res.port);
      })
      .catch(() => { });
  }, []);

  const initialProvider = settingsStorage.isDohEnabled()
    ? (settingsStorage.getDohProvider() as DohProviderValue)
    : 'off';
  const [provider, setProvider] = useState<DohProviderValue>(initialProvider);
  const [customUrl, setCustomUrl] = useState(settingsStorage.getDohCustomUrl());

  const onToggleWarp = async (value: boolean) => {
    if (isWarpBusy || isByeDpiBusy) return;
    setIsWarpBusy(true);
    setWarpEnabledState(value);
    if (value) {
      setByeDpiEnabledState(false);
      setByeDpiPort(null);
    }

    try {
      if (value) {
        Toast.show('Connecting to Cloudflare WARP...', Toast.SHORT);
      }
      const res = await toggleWarp(value);
      if (value && res.running) {
        setWarpPort(res.port || null);
        Toast.show(`WARP connected (Port ${res.port})`, Toast.SHORT);
      } else if (!value) {
        setWarpPort(null);
        Toast.show('WARP disconnected', Toast.SHORT);
      }
    } catch (e: any) {
      setWarpEnabledState(false);
      setWarpPort(null);
      settingsStorage.setWarpEnabled(false);
      Toast.show(
        `WARP error: ${e?.message || 'Failed to connect'}`,
        Toast.LONG,
      );
    } finally {
      setIsWarpBusy(false);
    }
  };

  const onToggleByeDpi = async (value: boolean) => {
    if (isByeDpiBusy || isWarpBusy) return;
    setIsByeDpiBusy(true);
    setByeDpiEnabledState(value);
    if (value) {
      setWarpEnabledState(false);
      setWarpPort(null);
    }

    try {
      if (value) {
        Toast.show('Starting ByeDPI...', Toast.SHORT);
      }
      const res = await toggleByeDpi(value, byeDpiArgs);
      if (value && res.running) {
        setByeDpiPort(res.port || null);
        Toast.show(`ByeDPI connected (Port ${res.port})`, Toast.SHORT);
      } else if (!value) {
        setByeDpiPort(null);
        Toast.show('ByeDPI stopped', Toast.SHORT);
      }
    } catch (e: any) {
      setByeDpiEnabledState(false);
      setByeDpiPort(null);
      settingsStorage.setByeDpiEnabled(false);
      Toast.show(
        `ByeDPI error: ${e?.message || 'Failed to start'}`,
        Toast.LONG,
      );
    } finally {
      setIsByeDpiBusy(false);
    }
  };

  const saveByeDpiArgs = async (value: string) => {
    const trimmed = value.trim();
    setByeDpiArgs(trimmed);
    settingsStorage.setByeDpiCmdArgs(trimmed);
    if (byeDpiEnabled) {
      setIsByeDpiBusy(true);
      try {
        await toggleByeDpi(true, trimmed);
        Toast.show('ByeDPI restarted with new parameters', Toast.SHORT);
      } catch (e: any) {
        Toast.show(`ByeDPI error: ${e?.message}`, Toast.LONG);
      } finally {
        setIsByeDpiBusy(false);
      }
    } else {
      Toast.show('ByeDPI parameters saved', Toast.SHORT);
    }
  };

  const resetByeDpiArgs = () => {
    saveByeDpiArgs(DEFAULT_BYEDPI_ARGS);
  };

  const selectProvider = async (value: DohProviderValue) => {
    setProvider(value);
    settingsStorage.setDohEnabled(value !== 'off');
    if (value !== 'off') {
      settingsStorage.setDohProvider(value);
    }
    await syncDohSettings();
  };

  const saveCustomUrl = async (value: string) => {
    settingsStorage.setDohCustomUrl(value);
    await syncDohSettings();
    Toast.show('Custom DNS applied', Toast.SHORT);
  };

  return (
    <View className="p-4">
      {/* Cloudflare WARP Section */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="mr-3 flex-1 flex-row items-center">
          <View
            className="mr-4 h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.secondaryContainer }}>
            <MaterialCommunityIcons
              name="cloud-outline"
              size={21}
              color={colors.onSecondaryContainer}
            />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <AppText role="bodyLarge" className="text-m3-on-surface">
                WARP Mode
              </AppText>
              {warpEnabled && warpPort ? (
                <View
                  className="ml-2 rounded px-1.5 py-0.5"
                  style={{ backgroundColor: colors.primaryContainer }}>
                  <AppText
                    role="labelSmall"
                    style={{ color: colors.onPrimaryContainer, fontSize: 10 }}>
                    Active :{warpPort}
                  </AppText>
                </View>
              ) : null}
            </View>
            <AppText
              role="bodySmall"
              className="mt-0.5 text-m3-on-surface-variant">
              Bypass ISP restrictions with Cloudflare WARP VPN
            </AppText>
          </View>
        </View>
        <Switch
          accessibilityLabel="Cloudflare WARP Mode"
          value={warpEnabled}
          disabled={isWarpBusy || isByeDpiBusy}
          onValueChange={onToggleWarp}
          thumbColor={warpEnabled ? colors.onPrimary : colors.outline}
          trackColor={{
            false: colors.surfaceContainerHighest,
            true: colors.primary,
          }}
        />
      </View>

      {/* Divider */}
      <View
        style={{
          borderBottomColor: colors.outlineVariant,
          borderBottomWidth: 1,
          marginBottom: 16,
        }}
      />

      {/* ByeDPI Section */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between">
          <View className="mr-3 flex-1 flex-row items-center">
            <View
              className="mr-4 h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.secondaryContainer }}>
              <MaterialCommunityIcons
                name="shield-half"
                size={21}
                color={colors.onSecondaryContainer}
              />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <AppText role="bodyLarge" className="text-m3-on-surface">
                  AntiDPI Mode
                </AppText>
                {byeDpiEnabled && byeDpiPort ? (
                  <View
                    className="ml-2 rounded px-1.5 py-0.5"
                    style={{ backgroundColor: colors.primaryContainer }}>
                    <AppText
                      role="labelSmall"
                      style={{ color: colors.onPrimaryContainer, fontSize: 10 }}>
                      Active :{byeDpiPort}
                    </AppText>
                  </View>
                ) : null}
              </View>
              <AppText
                role="bodySmall"
                className="mt-0.5 text-m3-on-surface-variant">
                Bypass ISP blocking without VPN
              </AppText>
            </View>
          </View>
          <Switch
            accessibilityLabel="ByeDPI Anti-DPI Mode"
            value={byeDpiEnabled}
            disabled={isByeDpiBusy || isWarpBusy}
            onValueChange={onToggleByeDpi}
            thumbColor={byeDpiEnabled ? colors.onPrimary : colors.outline}
            trackColor={{
              false: colors.surfaceContainerHighest,
              true: colors.primary,
            }}
          />
        </View>

        {/* Optional Args Editor Toggle & Config */}
        <View className="mt-2 ml-14">
          <TouchableOpacity
            onPress={() => setShowArgsEditor(!showArgsEditor)}
            className="flex-row items-center py-1">
            <AppText
              role="labelSmall"
              style={{ color: colors.primary, marginRight: 4 }}>
              {showArgsEditor ? 'Hide parameters' : 'Configure parameters'}
            </AppText>
            <MaterialCommunityIcons
              name={showArgsEditor ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.primary}
            />
          </TouchableOpacity>

          {showArgsEditor ? (
            <View className="mt-2 pr-1">
              <View className="flex-row items-center justify-between mb-2">
                <AppText
                  role="labelMedium"
                  style={{ color: colors.onSurfaceVariant }}>
                  Command Line Arguments
                </AppText>
                <TouchableOpacity onPress={resetByeDpiArgs}>
                  <AppText role="labelSmall" style={{ color: colors.primary }}>
                    Reset default
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Preset Strategies */}
              <View className="mb-2.5 flex-row flex-wrap gap-1.5">
                {BYEDPI_PRESETS.map(preset => {
                  const isSelected =
                    (byeDpiArgs || DEFAULT_BYEDPI_ARGS) === preset.args;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      onPress={() => saveByeDpiArgs(preset.args)}
                      className="rounded-full px-2.5 py-1"
                      style={{
                        backgroundColor: isSelected
                          ? colors.primaryContainer
                          : colors.surfaceContainerHigh,
                        borderWidth: isSelected ? 1 : 0,
                        borderColor: colors.primary,
                      }}>
                      <AppText
                        role="labelSmall"
                        style={{
                          color: isSelected
                            ? colors.onPrimaryContainer
                            : colors.onSurfaceVariant,
                          fontWeight: isSelected ? '600' : '400',
                        }}>
                        {preset.name}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Direct Args Input */}
              <View
                style={{
                  width: '100%',
                  borderRadius: 12,
                  backgroundColor: colors.surfaceContainerHigh,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}>
                <TextInput
                  value={byeDpiArgs}
                  onChangeText={setByeDpiArgs}
                  onEndEditing={() => saveByeDpiArgs(byeDpiArgs)}
                  placeholder={DEFAULT_BYEDPI_ARGS}
                  placeholderTextColor={colors.onSurfaceVariant}
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="done"
                  style={{
                    fontSize: 13,
                    color: colors.onSurface,
                    padding: 0,
                  }}
                />
              </View>
            </View>
          ) : null}
        </View>
      </View>

      {/* Divider */}
      <View
        style={{
          borderBottomColor: colors.outlineVariant,
          borderBottomWidth: 1,
          marginBottom: 16,
        }}
      />

      {/* DNS over HTTPS Section */}
      <View style={{ opacity: warpEnabled ? 0.45 : 1 }}>
        <View className="mb-3 flex-row items-center">
          <View
            className="mr-4 h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.secondaryContainer }}>
            <MaterialCommunityIcons
              name="shield-lock-outline"
              size={21}
              color={colors.onSecondaryContainer}
            />
          </View>
          <View className="flex-1">
            <AppText role="bodyLarge" className="text-m3-on-surface">
              DNS over HTTPS
            </AppText>
            <AppText
              role="bodySmall"
              className="mt-0.5 text-m3-on-surface-variant">
              {warpEnabled
                ? 'Managed by Cloudflare WARP (resolved remotely)'
                : byeDpiEnabled
                  ? 'Works in synergy with ByeDPI for DNS privacy'
                  : 'Encrypt DNS queries with secure resolver'}
            </AppText>
          </View>
        </View>

        <View style={{ width: '100%', minHeight: 56 }}>
          <DropdownField
            disabled={warpEnabled}
            options={DOH_PROVIDERS}
            value={DOH_PROVIDERS.find(option => option.value === provider)}
            getKey={option => option.value}
            getLabel={option => option.label}
            onChange={option => selectProvider(option.value)}
          />
        </View>

        {provider === 'custom' && !warpEnabled ? (
          <View
            style={{
              borderTopColor: colors.outlineVariant,
              borderTopWidth: 1,
              marginTop: 14,
              paddingTop: 14,
            }}>
            <AppText
              role="labelMedium"
              style={{ color: colors.onSurfaceVariant, marginBottom: 8 }}>
              Custom DoH URL
            </AppText>
            <View
              style={{
                width: '100%',
                borderRadius: 14,
                backgroundColor: colors.surfaceContainerHigh,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.08)',
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}>
              <TextInput
                value={customUrl}
                onChangeText={setCustomUrl}
                onEndEditing={() => saveCustomUrl(customUrl)}
                placeholder="https://dns.example.com/dns-query"
                placeholderTextColor={colors.onSurfaceVariant}
                keyboardType="url"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
                style={{
                  fontSize: 14,
                  color: colors.onSurface,
                  padding: 0,
                }}
              />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default DnsPreference;
