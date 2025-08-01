import { Platform } from 'react-native';

const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  } else if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  } else {
    return 'http://localhost:5000/api';
  }
};

export const API_BASE_URL = getApiBaseUrl();
export const APP_NAME = 'RestauReserva';

console.log(`Platform: ${Platform.OS}, API_BASE_URL: ${API_BASE_URL}`);