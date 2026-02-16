import api from './axios';
import { endpoints } from './endpoints';

export const analyticsApi = {
  getUserAnalytics: async () => {
    const response = await api.get(endpoints.leakage.analytics);
    return response.data;
  },
  
   getLeakageAlerts: async () => {
    const res = await api.get(endpoints.analytics.leakageAlerts);
    return res.data; 
  }
  ,

  getAdminAnalytics: async () => {
    const response = await api.get(endpoints.admin.analytics);
    return response.data;
  }
};