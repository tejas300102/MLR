export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/profile',
    profile: '/auth/profile'
  },
  
  // Wallet endpoints
  wallet: {
    balance: '/wallet/balance',
    addMoney: '/wallet/add-money',
    pay: '/wallet/pay',
    transactions: '/wallet/transactions'
  },
  
  // Leakage & Analytics endpoints
  leakage: {
    alerts: '/analytics/leakage-alerts',
    analytics: '/analytics/leakage',
    spending: '/analytics/spending',
    markRead: (id) => `/analytics/leakage-alerts/${id}/read`
  },
  
  // Admin endpoints
  admin: {
    users: '/admin/users',
    blockUser: (id) => `/admin/users/${id}/block`,
    activateUser: (id) => `/admin/users/${id}/unblock`,
    resetWallet: (id) => `/admin/users/${id}/reset-wallet`,
    resetUserData: (id) => `/admin/users/${id}/reset-data`,
    analytics: '/admin/analytics',
    rulesStatus: '/admin/rules/status',
    health: '/admin/health'
  }
};