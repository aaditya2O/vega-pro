const mockUnlink = jest.fn().mockResolvedValue(undefined);
const mockReadDir = jest.fn().mockResolvedValue([]);
const mockExists = jest.fn().mockResolvedValue(true);
const mockMkdir = jest.fn().mockResolvedValue(undefined);
const mockStat = jest.fn().mockResolvedValue({ size: 1000 });

module.exports = {
  CachesDirectoryPath: '/cache',
  DocumentDirectoryPath: '/documents',
  DownloadDirectoryPath: '/downloads',
  ExternalDirectoryPath: '/external',
  MainBundlePath: '/bundle',
  TemporaryDirectoryPath: '/tmp',
  readDir: mockReadDir,
  unlink: mockUnlink,
  exists: mockExists,
  mkdir: mockMkdir,
  stat: mockStat,
  downloadFile: jest.fn(() => ({
    jobId: 1,
    promise: Promise.resolve({ statusCode: 200, bytesWritten: 1000 }),
  })),
  stopDownload: jest.fn(),
};
