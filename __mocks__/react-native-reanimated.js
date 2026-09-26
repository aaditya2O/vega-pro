const React = require('react');
const { View, Text, ScrollView, Image } = require('react-native');

const NOOP = () => {};

const createAnimatedComponent = (Component) => Component;

const Animated = {
  View,
  Text,
  ScrollView,
  Image,
  createAnimatedComponent,
  addWhitelistedUIProps: NOOP,
  addWhitelistedNativeProps: NOOP,
};

const useSharedValue = (init) => ({ value: init });
const useAnimatedStyle = (fn) => (typeof fn === 'function' ? fn() : {});
const useDerivedValue = (fn) => ({ value: typeof fn === 'function' ? fn() : fn });
const withSpring = (toValue, config, callback) => {
  if (callback) callback(true);
  return toValue;
};
const withTiming = (toValue, config, callback) => {
  if (callback) callback(true);
  return toValue;
};
const withSequence = (...anims) => anims[anims.length - 1];
const withDelay = (delay, anim) => anim;
const withRepeat = (anim) => anim;
const cancelAnimation = NOOP;
const runOnJS = (fn) => fn;
const interpolate = (val, input, output) => output[0];
const Extrapolation = {
  CLAMP: 'clamp',
  EXTEND: 'extend',
  IDENTITY: 'identity',
};

const Easing = {
  linear: (t) => t,
  ease: (t) => t,
  quad: (t) => t,
  cubic: (t) => t,
  poly: () => (t) => t,
  sin: (t) => t,
  circle: (t) => t,
  exp: (t) => t,
  elastic: () => (t) => t,
  back: () => (t) => t,
  bounce: () => (t) => t,
  bezier: () => (t) => t,
  in: (fn) => fn || ((t) => t),
  out: (fn) => fn || ((t) => t),
  inOut: (fn) => fn || ((t) => t),
};

const FadeIn = { duration: () => FadeIn, delay: () => FadeIn, springify: () => FadeIn };
const FadeOut = { duration: () => FadeOut, delay: () => FadeOut };
const SlideInDown = { duration: () => SlideInDown, springify: () => SlideInDown };
const SlideOutDown = { duration: () => SlideOutDown };

module.exports = {
  default: Animated,
  ...Animated,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  cancelAnimation,
  runOnJS,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
};
