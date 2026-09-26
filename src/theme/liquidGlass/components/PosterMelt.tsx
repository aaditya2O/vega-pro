import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {LiquidTokens} from '../tokens';

export interface PosterMeltProps extends ViewProps {
  imageUri?: string;
  imageSource?: ImageSourcePropType;
  height?: number;
  gradientColors?: string[];
  gradientLocations?: number[];
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const PosterMelt: React.FC<PosterMeltProps> = ({
  imageUri,
  imageSource,
  height = 480,
  gradientColors = LiquidTokens.gradients.posterMeltLong as unknown as string[],
  gradientLocations = [0, 0.25, 0.6, 0.85, 1.0],
  style,
  children,
  ...props
}) => {
  const source = imageSource || (imageUri ? {uri: imageUri} : undefined);

  return (
    <View style={[styles.container, {height}, style]} {...props}>
      {/* Edge-to-Edge Artwork */}
      {source && (
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      )}

      {/* Multi-Stop AMOLED Gradient Melt into #000000 */}
      <LinearGradient
        colors={gradientColors}
        locations={gradientLocations}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating Children Content (Badges, Titles, Actions) */}
      {children && <View style={styles.contentWrap}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    backgroundColor: LiquidTokens.colors.bgAmoled,
    overflow: 'hidden',
  },
  contentWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: 20,
    zIndex: 10,
  },
});

export default PosterMelt;
