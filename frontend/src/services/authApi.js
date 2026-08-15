import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
});

const messageFromError = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong. Please try again.';

export const authApi = {
  async login(credentials) {
    try {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    } catch (error) {
      throw new Error(messageFromError(error));
    }
  },
  async register(user) {
    try {
      const { data } = await api.post('/auth/register', user);
      return data;
    } catch (error) {
      throw new Error(messageFromError(error));
    }
  },
};
