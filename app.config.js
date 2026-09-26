const fs = require('fs');
const path = require('path');

const androidGoogleServicesFile = './google-services.json';
const iosGoogleServicesFile = './GoogleService-Info.plist';
const hasAndroidGoogleServices = fs.existsSync(
  path.resolve(__dirname, androidGoogleServicesFile),
);
const hasIosGooglePlist = fs.existsSync(
  path.resolve(__dirname, iosGoogleServicesFile),
);
const tmdbApiKey =
  process.env.TMDB_API_KEY || process.env.EXPO_PUBLIC_TMDB_API_KEY || '';
const proxyApiUrl =
  process.env.PROXY_API_URL ||
  process.env.EXPO_PUBLIC_PROXY_API_URL ||
  process.env.META_PROXY_URL ||
  '';

module.exports = () => {
  const IS_PLAYSTORE = process.env.APP_VARIANT === 'playstore';
  const HAS_FIREBASE =
    !IS_PLAYSTORE && (hasAndroidGoogleServices || hasIosGooglePlist);
  const PACKAGE_NAME = IS_PLAYSTORE ? 'vega.app' : 'com.vega';
  const APP_SCHEME = IS_PLAYSTORE ? 'vegaapp' : 'com.vega';
  const plugins = [
    './plugins/with-custom-native-modules.js',
    './plugins/android-native-config.js',
    './plugins/with-saf-copy-module.js',
    './plugins/with-uri-permission-module.js',
    './plugins/with-proguard-rules.js',
    './plugins/with-jvm-args.js',
    './plugins/with-android-notification-icons.js',
    './plugins/with-notifee-service.js',
    './plugins/with-android-release-gradle.js',
    './plugins/with-android-signing.js',
    './plugins/with-android-okhttp.js',
    ...(HAS_FIREBASE ? ['@react-native-firebase/app'] : []),
    ...(HAS_FIREBASE ? ['@react-native-firebase/crashlytics'] : []),
    [
      'react-native-video',
      {
        enableNotificationControls: true,
        enableAndroidPictureInPicture: true,
        androidExtensions: {
          useExoplayerRtsp: false,
          useExoplayerSmoothStreaming: true,
          useExoplayerHls: true,
          useExoplayerDash: true,
        },
      },
    ],
    [
      'react-native-google-cast',
      {
        expandedController: true,
      },
    ],
    'react-native-edge-to-edge',
    './plugins/with-dynamic-launcher-splash.js',
    [
      'react-native-bootsplash',
      {
        assetsDir: 'assets/bootsplash',
        android: {
          parentTheme: 'EdgeToEdge',
        },
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          usePrecompiledHeaders: true,
          extraMavenRepos: [
            '../../node_modules/@notifee/react-native/android/libs',
          ],
          enableProguardInReleaseBuilds: true,
          splits: {
            abi: { enable: true, universalApk: true },
          },
          buildVariants: {
            release: {
              minifyEnabled: true,
              shrinkResources: true,
              splits: {
                abi: {
                  enable: true,
                  reset: false,
                  include: ['armeabi-v7a', 'arm64-v8a'],
                },
              },
            },
            debug: { minifyEnabled: false, debuggable: true },
          },
        },
        ios: {},
      },
    ],

    [
      'expo-dev-client',
      {
        launchMode: 'most-recent',
      },
    ],
    'expo-font',
    'expo-status-bar',
  ];
  return {
    expo: {
      name: 'Vega Pro',
      scheme: 'vegapro',
      displayName: 'Vega Pro',
      jsEngine: 'hermes',
      newArchEnabled: true,
      autolinking: { exclude: ['expo-splash-screen'] },
      plugins,
      slug: 'vega-pro',
      version: '4.0.6',
      userInterfaceStyle: 'dark',
      experiments: {
        reactCompiler: true,
      },
      android: {
        ...(!IS_PLAYSTORE && hasAndroidGoogleServices
          ? { googleServicesFile: androidGoogleServicesFile }
          : {}),
        minSdkVersion: 28,
        package: PACKAGE_NAME,
        versionCode: 192,
        permissions: [
          'FOREGROUND_SERVICE',
          'FOREGROUND_SERVICE_DATA_SYNC',
          'FOREGROUND_SERVICE_MEDIA_PLAYBACK',
          'ACCESS_NETWORK_STATE',
          'INTERNET',
          'WRITE_SETTINGS',
        ],
        blockedPermissions: [
          'android.permission.MANAGE_EXTERNAL_STORAGE',
          'android.permission.READ_EXTERNAL_STORAGE',
          'android.permission.READ_MEDIA_VIDEO',
          'android.permission.WRITE_EXTERNAL_STORAGE',
          ...(IS_PLAYSTORE
            ? [
              'android.permission.REQUEST_INSTALL_PACKAGES',
              'com.google.android.gms.permission.AD_ID',
            ]
            : []),
        ],
        queries: [
          { action: 'VIEW', data: { scheme: 'http' } },
          { action: 'VIEW', data: { scheme: 'https' } },
          { action: 'VIEW', data: { scheme: 'vlc' } },
        ],
        allowBackup: true,
        adaptiveIcon: {
          foregroundImage: './assets/adaptive_icon.png',
          backgroundColor: '#000000',
        },
        launchMode: 'singleTask',
        supportsPictureInPicture: true,
      },
      ios: {
        ...(!IS_PLAYSTORE && hasIosGooglePlist
          ? { googleServicesFile: iosGoogleServicesFile }
          : {}),
        bundleIdentifier: 'com.vega.pro',
        supportsTablet: true,
        infoPlist: {
          UIBackgroundModes: ['audio', 'fetch', 'processing'],
          AVInitialRouteSharingPolicy: 'LongFormVideo',
          NSFaceIDUsageDescription:
            'Vega Pro uses Face ID to lock your streaming profile and library.',
          NSSupportsLiveActivities: true,
          NSSupportsLiveActivitiesFrequentUpdates: true,
          CADisableMinimumFrameDurationOnPhone: true,
          NSAppTransportSecurity: {
            NSAllowsArbitraryLoads: true,
          },
          NSBonjourServices: [
            '_googlecast._tcp',
            '_airplay._tcp',
            '_raop._tcp',
          ],
          NSLocalNetworkUsageDescription:
            'Vega Pro uses local network to discover AirPlay and Google Cast displays.',
        },
      },
      platforms: ['ios', 'android'],
      extra: {
        eas: {
          projectId: '40d98354-d3c8-4616-ab2e-70d9c297091f',
        },
        hasFirebase: HAS_FIREBASE,
        isPlayStore: IS_PLAYSTORE,
        tmdbApiKey,
        proxyApiUrl,
      },
    },
  };
};
