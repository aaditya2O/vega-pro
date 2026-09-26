module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '\\.(css|less|scss|ttf|otf|eot|woff|woff2|png|jpg|jpeg|gif|svg)$':
      '<rootDir>/__mocks__/styleMock.js',
    '^@expo/ui/jetpack-compose$':
      '<rootDir>/__mocks__/expo-ui-jetpack-compose.js',
    '^@expo/ui/jetpack-compose/modifiers$':
      '<rootDir>/__mocks__/expo-ui-jetpack-compose-modifiers.js',
    '^expo-blur$': '<rootDir>/__mocks__/expo-blur.js',
    '^expo-font$': '<rootDir>/__mocks__/expo-font.js',
    '^react-native-mmkv-storage$':
      '<rootDir>/__mocks__/react-native-mmkv-storage.js',
    '^react-native-reanimated$':
      '<rootDir>/__mocks__/react-native-reanimated.js',
    '^react-native-linear-gradient$':
      '<rootDir>/__mocks__/react-native-linear-gradient.js',
    '^expo-crypto$': '<rootDir>/__mocks__/expo-crypto.js',
    '^react-native-image-colors$':
      '<rootDir>/__mocks__/react-native-image-colors.js',
    '^@dr.pogodin/react-native-fs$':
      '<rootDir>/__mocks__/@dr.pogodin/react-native-fs.js',
    '^expo-file-system(/.*)?$': '<rootDir>/__mocks__/expo-file-system.js',
    '^react-native-drawer-layout$':
      '<rootDir>/__mocks__/react-native-drawer-layout.js',
    '^react-native-haptic-feedback$':
      '<rootDir>/__mocks__/react-native-haptic-feedback.js',
    '^expo-document-picker$': '<rootDir>/__mocks__/expo-document-picker.js',
    '^expo-status-bar$': '<rootDir>/__mocks__/expo-status-bar.js',
    '^expo-intent-launcher$': '<rootDir>/__mocks__/expo-intent-launcher.js',
    '^@notifee/react-native$': '<rootDir>/__mocks__/@notifee/react-native.js',
    '^@himanshu8443/react-native-apk-installer$':
      '<rootDir>/__mocks__/@himanshu8443/react-native-apk-installer.js',
    '^react-native-webview$': '<rootDir>/__mocks__/react-native-webview.js',
    '^expo-constants$': '<rootDir>/__mocks__/expo-constants.js',
    '^react-native-orientation-locker$':
      '<rootDir>/__mocks__/react-native-orientation-locker.js',
    '^react-native-edge-to-edge$':
      '<rootDir>/__mocks__/react-native-edge-to-edge.js',
    '^expo-brightness$': '<rootDir>/__mocks__/expo-brightness.js',
    '^react-native-volume-manager$':
      '<rootDir>/__mocks__/react-native-volume-manager.js',
    '^expo-navigation-bar$': '<rootDir>/__mocks__/expo-navigation-bar.js',
    '^expo-updates$': '<rootDir>/__mocks__/expo-updates.js',
    '^expo-application$': '<rootDir>/__mocks__/expo-application.js',
    '^react-native-bootsplash$':
      '<rootDir>/__mocks__/react-native-bootsplash.js',
    '^nativewind$': '<rootDir>/__mocks__/nativewind.js',
  },
  setupFiles: ['<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|react-native-markdown-display|@react-navigation)/)',
  ],
};
