module.exports = {
  documentDirectory: '/mock/documents/',
  cacheDirectory: '/mock/cache/',
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true, isDirectory: true }),
  readDirectoryAsync: jest.fn().mockResolvedValue([]),
  makeDirectoryAsync: jest.fn().mockResolvedValue(undefined),
  deleteAsync: jest.fn().mockResolvedValue(undefined),
  copyAsync: jest.fn().mockResolvedValue(undefined),
  moveAsync: jest.fn().mockResolvedValue(undefined),
};
