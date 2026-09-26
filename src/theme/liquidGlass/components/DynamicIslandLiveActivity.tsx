import React, {useState, useEffect} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {LiquidTokens} from '../tokens';
import {useLiquidGlass} from '../LiquidGlassContext';

export interface DynamicIslandLiveActivityProps {
  onPressMain?: () => void;
  onPlayPause?: () => void;
  onSeekRelative?: (delta: number) => void;
}

export const DynamicIslandLiveActivity: React.FC<DynamicIslandLiveActivityProps> = ({
  onPressMain,
  onPlayPause,
  onSeekRelative,
}) => {
  const {liveActivity, triggerHaptic} = useLiquidGlass();
  const [isExpanded, setIsExpanded] = useState(false);

  // Reanimated values for morphing between compact pill and expanded card
  const width = useSharedValue<number>(124);
  const height = useSharedValue<number>(35);
  const borderRadius = useSharedValue<number>(LiquidTokens.radii.island);

  // Equalizer bar heights
  const eq1 = useSharedValue(0.4);
  const eq2 = useSharedValue(0.8);
  const eq3 = useSharedValue(0.5);
  const eq4 = useSharedValue(0.9);

  useEffect(() => {
    if (liveActivity?.isPlaying) {
      eq1.value = withRepeat(
        withSequence(withTiming(0.9, {duration: 350}), withTiming(0.3, {duration: 350})),
        -1,
        true,
      );
      eq2.value = withRepeat(
        withSequence(withTiming(0.4, {duration: 280}), withTiming(1.0, {duration: 280})),
        -1,
        true,
      );
      eq3.value = withRepeat(
        withSequence(withTiming(0.8, {duration: 400}), withTiming(0.2, {duration: 400})),
        -1,
        true,
      );
      eq4.value = withRepeat(
        withSequence(withTiming(0.5, {duration: 320}), withTiming(0.95, {duration: 320})),
        -1,
        true,
      );
    }
  }, [liveActivity?.isPlaying]);

  const toggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    triggerHaptic(next ? 'impactMedium' : 'impactLight');

    width.value = withSpring(next ? 360 : 124, LiquidTokens.spring.bounce);
    height.value = withSpring(next ? 172 : 35, LiquidTokens.spring.bounce);
    borderRadius.value = withSpring(next ? 36 : LiquidTokens.radii.island, LiquidTokens.spring.bounce);
  };

  const islandAnimStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    borderRadius: borderRadius.value,
  }));

  const eqBar1Style = useAnimatedStyle(() => ({transform: [{scaleY: eq1.value}]}));
  const eqBar2Style = useAnimatedStyle(() => ({transform: [{scaleY: eq2.value}]}));
  const eqBar3Style = useAnimatedStyle(() => ({transform: [{scaleY: eq3.value}]}));
  const eqBar4Style = useAnimatedStyle(() => ({transform: [{scaleY: eq4.value}]}));

  if (!liveActivity) return null;

  return (
    <View style={styles.anchorWrapper} pointerEvents="box-none">
      <Animated.View style={[styles.islandContainer, islandAnimStyle]}>
        <Pressable onPress={toggleExpand} style={styles.pressableFill}>
          {!isExpanded ? (
            /* Compact Pill State */
            <View style={styles.compactContent}>
              {liveActivity.poster ? (
                <Image source={{uri: liveActivity.poster}} style={styles.compactThumb} />
              ) : (
                <View style={styles.compactPlaceholder} />
              )}
              <View style={styles.compactEq}>
                <Animated.View style={[styles.eqBar, eqBar1Style]} />
                <Animated.View style={[styles.eqBar, styles.eqBarAccent, eqBar2Style]} />
                <Animated.View style={[styles.eqBar, eqBar3Style]} />
                <Animated.View style={[styles.eqBar, styles.eqBarCyan, eqBar4Style]} />
              </View>
            </View>
          ) : (
            /* Expanded Live Activity Card State */
            <View style={styles.expandedContent}>
              {/* Header */}
              <View style={styles.expandedHeader}>
                {liveActivity.poster && (
                  <Image source={{uri: liveActivity.poster}} style={styles.expandedArt} />
                )}
                <View style={styles.expandedMeta}>
                  <Text style={styles.expandedTitle} numberOfLines={1}>
                    {liveActivity.title}
                  </Text>
                  <Text style={styles.expandedSub} numberOfLines={1}>
                    {liveActivity.subtitle}
                  </Text>
                </View>
                {liveActivity.formatBadge && (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgeText}>{liveActivity.formatBadge}</Text>
                  </View>
                )}
              </View>

              {/* Progress Scrubber */}
              <View style={styles.progressRow}>
                <Text style={styles.timeText}>
                  {formatSeconds(liveActivity.currentTime || 0)}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {width: `${Math.round((liveActivity.progress || 0.5) * 100)}%`},
                    ]}
                  />
                </View>
                <Text style={styles.timeText}>
                  {formatSeconds(liveActivity.duration || 0)}
                </Text>
              </View>

              {/* Transport Controls */}
              <View style={styles.controlsRow}>
                <Pressable
                  hitSlop={12}
                  onPress={() => {
                    triggerHaptic('impactLight');
                    onSeekRelative?.(-10);
                  }}>
                  <MaterialCommunityIcons name="rewind-10" size={24} color="#ffffff" />
                </Pressable>

                <Pressable
                  hitSlop={12}
                  onPress={() => {
                    triggerHaptic('impactMedium');
                    onPlayPause?.();
                  }}
                  style={styles.playBtnPill}>
                  <MaterialCommunityIcons
                    name={liveActivity.isPlaying ? 'pause' : 'play'}
                    size={28}
                    color="#ffffff"
                  />
                </Pressable>

                <Pressable
                  hitSlop={12}
                  onPress={() => {
                    triggerHaptic('impactLight');
                    onSeekRelative?.(10);
                  }}>
                  <MaterialCommunityIcons name="fast-forward-10" size={24} color="#ffffff" />
                </Pressable>
              </View>
            </View>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const formatSeconds = (total: number) => {
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  anchorWrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 12 : 28,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  islandContainer: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.8,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  pressableFill: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  compactThumb: {
    width: 22,
    height: 22,
    borderRadius: 6,
  },
  compactPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: LiquidTokens.colors.accentViolet,
  },
  compactEq: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 16,
    gap: 2.5,
  },
  eqBar: {
    width: 2.5,
    height: '100%',
    backgroundColor: LiquidTokens.colors.accentViolet,
    borderRadius: 1.5,
  },
  eqBarAccent: {
    backgroundColor: LiquidTokens.colors.accentIndigo,
  },
  eqBarCyan: {
    backgroundColor: LiquidTokens.colors.accentCyan,
  },
  expandedContent: {
    flex: 1,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expandedArt: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  expandedMeta: {
    flex: 1,
  },
  expandedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  expandedSub: {
    fontSize: 12,
    color: LiquidTokens.colors.textTertiary,
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(168, 140, 255, 0.5)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: LiquidTokens.colors.textAccent,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 11,
    color: LiquidTokens.colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: LiquidTokens.colors.accentViolet,
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
  },
  playBtnPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DynamicIslandLiveActivity;
