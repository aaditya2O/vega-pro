import {Platform, ToastAndroid, Alert} from 'react-native';

export const Toast = {
  SHORT: 2000,
  LONG: 3500,

  show(message: string, duration?: number) {
    if (Platform.OS === 'android' && ToastAndroid && ToastAndroid.show) {
      ToastAndroid.show(message, duration || ToastAndroid.SHORT);
    } else {
      // On iOS, log or show subtle notification
      console.log(`[Vega Pro Toast]: ${message}`);
    }
  },
};

export default Toast;
