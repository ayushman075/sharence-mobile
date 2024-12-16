import axios from 'axios';
import { tokenCache } from './cache';  // Import the tokenCache here

const axiosInstance = axios.create({
  baseURL: 'https://sharence-server.onrender.com/api/v1/',
  timeout: 500000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokenCache.getToken('__clerk_client_jwt')}`
  },
  withCredentials: true,
});

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     try {
//       if (tokenCache) {
//         config.headers.Authorization = `Bearer ${tokenCache.getToken('__clerk_client_jwt')}`;
//       } else {
//         console.log('No token found in SecureStorage.');
//       }

//       return config;
//     } catch (error) {
//       console.error('Error reading token from SecureStore:', error);
//       return Promise.reject(error);
//     }
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
