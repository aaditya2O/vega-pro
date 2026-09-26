import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {BlurView} from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {LiquidTokens} from '../tokens';
import {useLiquidGlass} from '../LiquidGlassContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const LiquidTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const {triggerHaptic} = useLiquidGlass();

  const iconMap: Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
    HomeStack: 'home-variant',
    SearchStack: 'magnify',
    DownloadsStack: 'download-circle-outline',
    WatchListStack: 'bookmark-multiple-outline',
    SettingsStack: 'account-circle-outline',
  };

  const labelMap: Record<string, string> = {
    HomeStack: 'Home',
    SearchStack: 'Search',
    DownloadsStack: 'Offline',
    WatchListStack: 'Saved',
    SettingsStack: 'Profile',
  };

  return (
    <View style={styles.dockWrapper} pointerEvents="box-none">
      <View style={styles.dockContainer}>
        {/* Frosted Glass Backdrop */}
        <BlurView
          intensity={35}
          tint="dark"
          style={[StyleSheet.absoluteFill, {borderRadius: LiquidTokens.radii.pill}]}
        />

        {/* Specular Rim */}
        <View style={styles.specularRim} />

        {/* Tab Items */}
        <View style={styles.tabsRow}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const iconName = iconMap[route.name] || 'circle';
            const label = labelMap[route.name] || route.name;

            const onPress = () => {
              triggerHaptic('impactLight');
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <AnimatedPressable
                key={route.key}
                onPress={onPress}
                style={[styles.tabItem, isFocused && styles.tabItemActive]}>
                <MaterialCommunityIcons
                  name={iconName}
                  size={22}
                  color={
                    isFocused
                      ? '#ffffff'
                      : LiquidTokens.colors.textTertiary
                  }
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused && styles.tabLabelActive,
                  ]}>
                  {label}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 18,
    right: 18,
    alignItems: 'center',
    zIndex: 900,
  },
  dockContainer: {
    width: '100%',
    height: 64,
    borderRadius: LiquidTokens.radii.pill,
    backgroundColor: 'rgba(18, 18, 28, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 16},
        shadowOpacity: 0.65,
        shadowRadius: 30,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  specularRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: LiquidTokens.colors.glassSpecularTop,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    width: 54,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(168, 140, 255, 0.35)',
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: LiquidTokens.colors.textTertiary,
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

export default LiquidTabBar;
