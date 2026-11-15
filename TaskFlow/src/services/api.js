
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('API request timed out.');
    } else if (!error.response) {
      console.error(
        'Cannot connect to the API. Check whether JSON Server is running.'
      );
    }

    return Promise.reject(error);
  }
);

export default api;
