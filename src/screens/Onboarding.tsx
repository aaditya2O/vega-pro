import React, {useState, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LiquidTokens} from '../theme/liquidGlass/tokens';
import GlassButton from '../theme/liquidGlass/components/GlassButton';
import PosterMelt from '../theme/liquidGlass/components/PosterMelt';
import {useLiquidGlass} from '../theme/liquidGlass/LiquidGlassContext';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const SLIDES = [
  {
    id: 'discover',
    badge: 'DISCOVER',
    title: 'Cinema in your palm',
    description:
      'Experience 4K HDR10+ and Dolby Atmos Spatial Audio calibrated for Apple Vision & OLED displays.',
    imageUri:
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'downloads',
    badge: 'OFFLINE DOWNLOADS',
    title: 'Always with you',
    description:
      'Intelligent background caching and lossless audio compression for flights, subway, and off-grid viewing.',
    imageUri:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'ecosystem',
    badge: 'APPLE ECOSYSTEM',
    title: 'Every screen united',
    description:
      'Zero-latency AirPlay handoff to Apple TV 4K with physical Siri Remote trackpad integration.',
    imageUri:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  },
];

export interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({onComplete}) => {
  const insets = useSafeAreaInsets();
  const {triggerHaptic} = useLiquidGlass();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const handleNext = () => {
    triggerHaptic('impactLight');
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1;
      listRef.current?.scrollToIndex({index: next, animated: true});
      setActiveIndex(next);
    } else {
      triggerHaptic('notificationSuccess');
      onComplete();
    }
  };

  const handleSkip = () => {
    triggerHaptic('impactLight');
    onComplete();
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Slide Carousel */}
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const newIdx = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
          );
          if (newIdx !== activeIndex) {
            setActiveIndex(newIdx);
            triggerHaptic('impactLight');
          }
        }}
        renderItem={({item}) => (
          <View style={styles.slide}>
            {/* Top Poster with AMOLED Melt */}
            <View style={styles.heroPosterWrap}>
              <PosterMelt
                imageUri={item.imageUri}
                height={SCREEN_WIDTH * 1.05}
              />
            </View>

            {/* Slide Content */}
            <View style={styles.textWrap}>
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Footer Controls */}
      <View
        style={[
          styles.footer,
          {paddingBottom: Math.max(insets.bottom, 20) + 12},
        ]}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>

          <View style={styles.nextButtonWrap}>
            <GlassButton
              title={isLast ? 'Start Streaming' : 'Continue'}
              variant="primary"
              size="lg"
              onPress={handleNext}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LiquidTokens.colors.bgAmoled,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  heroPosterWrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.05,
    overflow: 'hidden',
  },
  textWrap: {
    paddingHorizontal: 28,
    paddingTop: 12,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(168, 140, 255, 0.4)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: '#D8B4FE',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: LiquidTokens.colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: LiquidTokens.colors.accentCyan,
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  skipText: {
    color: LiquidTokens.colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  nextButtonWrap: {
    flex: 2,
  },
});

export default Onboarding;
