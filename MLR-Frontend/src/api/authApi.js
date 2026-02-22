import api from './axios';
import { endpoints } from './endpoints';

export const authApi = {
  login: async (credentials) => {
    const response = await api.post(endpoints.auth.login, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(endpoints.auth.register, userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get(endpoints.auth.me);
    return response.data;
  }
};