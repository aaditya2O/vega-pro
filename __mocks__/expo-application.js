module.exports = {
  applicationName: 'Vega Pro',
  nativeApplicationVersion: '1.0.0',
  nativeBuildVersion: '1',
  applicationId: 'com.vega.pro',
  getInstallationTimeAsync: jest.fn().mockResolvedValue(new Date()),
  getLastUpdateTimeAsync: jest.fn().mockResolvedValue(new Date()),
};
