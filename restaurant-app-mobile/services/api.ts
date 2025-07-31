import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, APP_NAME } from '@/utils/env';

const api = axios.create({
    baseURL: API_BASE_URL,
});

console.log('API_BASE_URL: ', API_BASE_URL);

api.interceptors.request.use(
    async (config) => {
        const jwt = await AsyncStorage.getItem(`${APP_NAME}-jwt`);
        if (jwt && config.headers && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${jwt}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export { api };