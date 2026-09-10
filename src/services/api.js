import axios from 'axios';

// Centralized Axios instance for all API calls
const api = axios.create({
  baseURL: '', // Set baseURL if you have a common prefix, else leave blank
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor for global error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle 401, refresh token, etc. here
//     return Promise.reject(error);
//   }
// );

export default api;
