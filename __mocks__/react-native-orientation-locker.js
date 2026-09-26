const Orientation = {
  lockToPortrait: jest.fn(),
  lockToLandscape: jest.fn(),
  lockToLandscapeLeft: jest.fn(),
  lockToLandscapeRight: jest.fn(),
  unlockAllOrientations: jest.fn(),
  addOrientationListener: jest.fn(),
  removeOrientationListener: jest.fn(),
  getOrientation: jest.fn((cb) => cb && cb('PORTRAIT')),
};

const OrientationLocker = () => null;

module.exports = {
  default: Orientation,
  OrientationLocker,
  PORTRAIT: 'PORTRAIT',
  LANDSCAPE: 'LANDSCAPE',
  ...Orientation,
};
