const fs = require('fs');
const path = require('path');

const hasIosGooglePlist = fs.existsSync(
  path.resolve(__dirname, './GoogleService-Info.plist'),
);

module.exports = {
  dependencies: {
    ...(!hasIosGooglePlist
      ? {
          '@react-native-firebase/app': {
            platforms: {
              ios: null,
            },
          },
          '@react-native-firebase/analytics': {
            platforms: {
              ios: null,
            },
          },
          '@react-native-firebase/crashlytics': {
            platforms: {
              ios: null,
            },
          },
        }
      : {}),
  },
};
