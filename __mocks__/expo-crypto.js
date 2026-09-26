module.exports = {
  randomUUID: jest.fn(() => 'test-uuid-1234'),
  digestStringAsync: jest.fn().mockResolvedValue('test-hash-1234'),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
};
