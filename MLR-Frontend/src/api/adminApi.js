import api from './axios';
import { endpoints } from './endpoints';

export const adminApi = {
  getUsers: async (search = '') => {
    // Append search query param if exists
    const url = search 
      ? `${endpoints.admin.users}?search=${encodeURIComponent(search)}` 
      : endpoints.admin.users;
    const response = await api.get(url);
    return response.data;
  },

  blockUser: async (userId) => {
    const response = await api.post(endpoints.admin.blockUser(userId));
    return response.data;
  },

  activateUser: async (userId) => {
    const response = await api.post(endpoints.admin.activateUser(userId));
    return response.data;
  },

  resetWallet: async (userId) => {
    const response = await api.post(endpoints.admin.resetWallet(userId));
    return response.data;
  },

  resetUserData: async (userId) => {
    const response = await api.post(endpoints.admin.resetUserData(userId));
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get(endpoints.admin.analytics);
    return response.data;
  },

  getRulesStatus: async () => {
    const response = await api.get(endpoints.admin.rulesStatus);
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await api.get(endpoints.admin.health);
    return response.data;
  }
};