const defaultExport = {
  createChannel: jest.fn(async ({id}) => id),
  displayNotification: jest.fn(async () => undefined),
  cancelNotification: jest.fn(async () => undefined),
  cancelAllNotifications: jest.fn(async () => undefined),
  stopForegroundService: jest.fn(async () => undefined),
  getNotificationSettings: jest.fn(async () => ({authorizationStatus: 1})),
  requestPermission: jest.fn(async () => ({authorizationStatus: 1})),
  registerForegroundService: jest.fn(),
  onForegroundEvent: jest.fn(() => () => {}),
  onBackgroundEvent: jest.fn(),
};

module.exports = {
  __esModule: true,
  default: defaultExport,
  ...defaultExport,
  AndroidImportance: { DEFAULT: 3, HIGH: 4, LOW: 2, MIN: 1, NONE: 0 },
  AndroidGroupAlertBehavior: { ALL: 0, SUMMARY: 1, CHILDREN: 2 },
  AndroidForegroundServiceType: { FOREGROUND_SERVICE_TYPE_DATA_SYNC: 1 },
  AndroidLaunchActivityFlag: { SINGLE_TOP: 1, NEW_TASK: 2, CLEAR_TOP: 4 },
  EventType: { PRESS: 1, ACTION_PRESS: 2, DISMISSED: 3 },
  AuthorizationStatus: { NOT_DETERMINED: -1, DENIED: 0, AUTHORIZED: 1 },
};
