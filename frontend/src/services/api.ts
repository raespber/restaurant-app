import axios from 'axios';
import { API_URL, APP_NAME } from '../utils/env';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: API_URL,
});
console.log('apiUrl: ', API_URL);
api.interceptors.request.use(
  (config) => {
    const jwt = Cookies.get(`${APP_NAME}-jwt`);
    if (jwt && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { api };
