module.exports = {
  reloadAsync: jest.fn().mockResolvedValue(undefined),
  checkForUpdateAsync: jest.fn().mockResolvedValue({ isAvailable: false }),
  fetchUpdateAsync: jest.fn().mockResolvedValue({ isNew: false }),
  isEnabled: false,
};
