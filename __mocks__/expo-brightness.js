module.exports = {
  getBrightnessAsync: jest.fn().mockResolvedValue(0.5),
  setBrightnessAsync: jest.fn().mockResolvedValue(undefined),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
};
