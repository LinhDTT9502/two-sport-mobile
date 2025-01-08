// axiosInstance.js
import axios from 'axios';
import { checkAndRefreshToken } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(async (config) => {
  const token = await checkAndRefreshToken();
  await AsyncStorage.setItem('token', token);
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
