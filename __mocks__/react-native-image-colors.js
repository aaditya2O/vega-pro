module.exports = {
  getColors: jest.fn().mockResolvedValue({
    platform: 'ios',
    background: '#000000',
    primary: '#1c1c1e',
    secondary: '#2c2c2e',
    detail: '#ffffff',
  }),
  cache: {
    clear: jest.fn(),
  },
};
