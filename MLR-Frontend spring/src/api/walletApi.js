import api from './axios';
import { endpoints } from './endpoints';
export const walletApi = {
  getBalance: async () => {
    const response = await api.get(endpoints.wallet.balance);
    return response.data;
  },
  addMoney: async (data) => {
    const response = await api.post(endpoints.wallet.addMoney, data);
    return response.data;
  },
  pay: async (data) => {
    const response = await api.post(endpoints.wallet.pay, data);
    return response.data;
  },
  getTransactions: async (params = {}) => {
    const response = await api.get(endpoints.wallet.transactions, {
      params: { limit: 1000, ...params }
    });
    return response.data;
  },
  getLeakageAlerts: async () => {
    const response = await api.get(endpoints.leakage.alerts);
    return response.data;
  },
  markLeakageAlertRead: async (id) => {
    const response = await api.post(endpoints.leakage.markRead(id));
    return response.data;
  },
  getLeakageAnalytics: async () => {
    const response = await api.get(endpoints.leakage.analytics);
    return response.data;
  },
  getSpendingAnalytics: async () => {
    const response = await api.get(endpoints.leakage.spending);
    return response.data;
  },
  downloadLeakageReport: async () => {
    const response = await api.get('/analytics/download-report', {
      responseType: 'blob',
    });
    return response;
  }
};