// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { walletApi } from '../../api/walletApi';
// import Loader from '../../components/Loader';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from 'chart.js';
// import { Bar, Pie } from 'react-chartjs-2';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// const UserDashboard = () => {
//   const [balance, setBalance] = useState(0);
//   const [recentTransactions, setRecentTransactions] = useState([]);
//   const [alerts, setAlerts] = useState([]);
//   const [spendingStats, setSpendingStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const [balanceRes, transactionsRes, alertsRes, spendingRes] = await Promise.all([
//         walletApi.getBalance(),
//         walletApi.getTransactions({ limit: 5 }),
//         walletApi.getLeakageAlerts(),
//         walletApi.getSpendingAnalytics()
//       ]);
      
//       setBalance(balanceRes.balance || 0);
//       setRecentTransactions(transactionsRes || []);
//       setAlerts(alertsRes.alerts || alertsRes || []);
//       setSpendingStats(spendingRes);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAlertStats = () => {
//     const stats = { low: 0, medium: 0, high: 0 };
//     alerts.forEach(alert => {
//       const severity = alert.severity?.toLowerCase();
//       if (stats.hasOwnProperty(severity)) {
//         stats[severity]++;
//       }
//     });
//     return stats;
//   };

//   const getSeverityBadge = (severity) => {
//     const badges = {
//       low: 'badge-info',
//       medium: 'badge-warning', 
//       high: 'badge-danger'
//     };
//     return badges[severity?.toLowerCase()] || 'bg-gray-100 text-gray-800';
//   };

//   const getSpendingData = () => {
//     if (!spendingStats || !spendingStats.categoryBreakdown) {
//        return {
//          labels: ['No Data'],
//          datasets: [{ data: [0], backgroundColor: ['#e5e7eb'] }]
//        };
//     }

//     const labels = spendingStats.categoryBreakdown.map(x => x.category);
//     const data = spendingStats.categoryBreakdown.map(x => x.amount);

//     return {
//       labels: labels,
//       datasets: [{
//         data: data,
//         backgroundColor: ['#DE802B', '#14B8A6', '#8B5CF6', '#F43F5E', '#5C6F2B', '#2563EB', '#D97706'],
//         borderWidth: 0
//       }]
//     };
//   };

//   const getDailyTrendData = () => {
//     if (!spendingStats || !spendingStats.dailySpending) {
//         return {
//           labels: [],
//           datasets: []
//         };
//     }

//     const labels = spendingStats.dailySpending.map(x => {
//         const date = new Date(x.date);
//         return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     });
    
//     const data = spendingStats.dailySpending.map(x => x.amount);

//     return {
//       labels: labels,
//       datasets: [{
//         label: 'Daily Spending',
//         data: data,
//         backgroundColor: 'rgba(139, 92, 246, 0.8)',
//         borderColor: '#8B5CF6',
//         borderWidth: 2
//       }]
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { labels: { color: '#666' } }
//     },
//     scales: {
//       y: {
//         ticks: { color: '#666' },
//         grid: { color: '#e5e7eb' }
//       },
//       x: {
//         ticks: { color: '#666' },
//         grid: { display: false }
//       }
//     }
//   };

//   const pieOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'right', labels: { color: '#666' } }
//     }
//   };

//   if (loading) return <Loader />;

//   const alertStats = getAlertStats();
//   const totalAlerts = alerts.length;
//   const recentAlertsToShow = alerts.slice(0, 3);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
//         <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your account overview</p>
//       </div>
      
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="card card-hover">
//           <div className="p-6 text-center">
//             <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//             </div>
//             <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Current Balance</h5>
//             <h3 className="text-2xl font-bold text-primary-500">₹{balance.toFixed(2)}</h3>
//           </div>
//         </div>
        
//         <div className="card card-hover">
//           <div className="p-6 text-center">
//             <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
//               </svg>
//             </div>
//             <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Recent Transactions</h5>
//             <h3 className="text-2xl font-bold text-secondary-500">{recentTransactions.length}</h3>
//           </div>
//         </div>
        
//         <div className="card card-hover">
//           <div className="p-6 text-center">
//             <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//             <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Active Alerts</h5>
//             <h3 className="text-2xl font-bold text-yellow-500">{totalAlerts}</h3>
//           </div>
//         </div>
        
//         <div className="card card-hover">
//           <div className="p-6 text-center">
//             <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//               </svg>
//             </div>
//             <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Security Status</h5>
//             <h3 className="text-2xl font-bold text-green-500">{totalAlerts === 0 ? 'Good' : 'Alert'}</h3>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Alerts Summary */}
//         <div className="card">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//             <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Alerts Summary</h5>
//           </div>
//           <div className="p-6">
//             {totalAlerts > 0 ? (
//               <>
//                 <div className="grid grid-cols-3 gap-4 mb-4">
//                   <div className="bg-secondary-50 dark:bg-secondary-900/20 rounded-lg p-4 text-center">
//                     <h4 className="text-2xl font-bold text-secondary-500 mb-1">{alertStats.low}</h4>
//                     <small className="text-gray-600 dark:text-gray-400">Low</small>
//                   </div>
//                   <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
//                     <h4 className="text-2xl font-bold text-yellow-500 mb-1">{alertStats.medium}</h4>
//                     <small className="text-gray-600 dark:text-gray-400">Medium</small>
//                   </div>
//                   <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
//                     <h4 className="text-2xl font-bold text-red-500 mb-1">{alertStats.high}</h4>
//                     <small className="text-gray-600 dark:text-gray-400">High</small>
//                   </div>
//                 </div>
//                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
//                   <div className="h-3 rounded-full flex">
//                     <div className="bg-secondary-500 rounded-l-full" style={{width: `${(alertStats.low/totalAlerts)*100}%`}}></div>
//                     <div className="bg-yellow-500" style={{width: `${(alertStats.medium/totalAlerts)*100}%`}}></div>
//                     <div className="bg-red-500 rounded-r-full" style={{width: `${(alertStats.high/totalAlerts)*100}%`}}></div>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8">
//                 <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <h5 className="text-lg font-semibold text-green-500 mb-2">All Clear!</h5>
//                 <p className="text-gray-600 dark:text-gray-400">No leakage alerts detected</p>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Recent Alerts */}
//         <div className="card">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//             <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Alerts</h5>
//             <Link to="/user/leakage-alerts" className="btn btn-outline-primary text-sm">
//               View All
//             </Link>
//           </div>
//           <div className="p-6">
//             {recentAlertsToShow.length > 0 ? (
//               <div className="space-y-4">
//                 {recentAlertsToShow.map((alert, index) => (
//                   <div key={index} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                     <span className={`badge ${getSeverityBadge(alert.severity)} mr-3 mt-1`}>
//                       {alert.severity}
//                     </span>
//                     <div className="flex-grow">
//                       <h6 className="font-medium text-gray-900 dark:text-white mb-1">{alert.ruleName}</h6>
//                       <small className="text-gray-600 dark:text-gray-400">{alert.message}</small>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//                 <p className="text-gray-600 dark:text-gray-400">No recent alerts</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="card mb-8">
//         <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//           <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h5>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <Link to="/user/wallet" className="btn btn-primary flex items-center justify-center">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add Money
//             </Link>
//             <Link to="/user/wallet" className="btn btn-outline-primary flex items-center justify-center">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//               </svg>
//               Make Payment
//             </Link>
//             <Link to="/user/transactions" className="btn btn-outline-secondary flex items-center justify-center">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               View Transactions
//             </Link>
//             <Link to="/user/leakage-analytics" className="btn btn-outline-info flex items-center justify-center">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//               Analytics
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="card">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//             <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Spending by Category (Last 30 Days)</h5>
//           </div>
//           <div className="p-6" style={{height: '300px'}}>
//             <Pie data={getSpendingData()} options={pieOptions} />
//           </div>
//         </div>
        
//         <div className="card">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//             <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Spending Trend (Last 30 Days)</h5>
//           </div>
//           <div className="p-6" style={{height: '300px'}}>
//             <Bar data={getDailyTrendData()} options={chartOptions} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { walletApi } from '../../api/walletApi';
import Loader from '../../components/Loader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UserDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [spendingStats, setSpendingStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [balanceRes, transactionsRes, alertsRes, spendingRes] = await Promise.all([
        walletApi.getBalance(),
        walletApi.getTransactions({ limit: 5 }),
        walletApi.getLeakageAlerts(),
        walletApi.getSpendingAnalytics()
      ]);
      
      setBalance(balanceRes.balance || 0);
      setRecentTransactions(transactionsRes || []);
      setAlerts(alertsRes.alerts || alertsRes || []);
      setSpendingStats(spendingRes);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertStats = () => {
    const stats = { low: 0, medium: 0, high: 0 };
    alerts.forEach(alert => {
      const severity = alert.severity?.toLowerCase();
      if (stats.hasOwnProperty(severity)) {
        stats[severity]++;
      }
    });
    return stats;
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      low: 'badge-info',
      medium: 'badge-warning', 
      high: 'badge-danger'
    };
    return badges[severity?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getSpendingData = () => {
    if (!spendingStats || !spendingStats.categoryBreakdown) {
       return {
         labels: ['No Data'],
         datasets: [{ data: [0], backgroundColor: ['#e5e7eb'] }]
       };
    }

    const labels = spendingStats.categoryBreakdown.map(x => x.category);
    const data = spendingStats.categoryBreakdown.map(x => x.amount);

    return {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#DE802B', '#14B8A6', '#8B5CF6', '#F43F5E', '#5C6F2B', '#2563EB', '#D97706'],
        borderWidth: 0
      }]
    };
  };

  const getDailyTrendData = () => {
    if (!spendingStats || !spendingStats.dailySpending) {
        return {
          labels: [],
          datasets: []
        };
    }

    const labels = spendingStats.dailySpending.map(x => {
        const date = new Date(x.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const data = spendingStats.dailySpending.map(x => x.amount);

    return {
      labels: labels,
      datasets: [{
        label: 'Daily Spending',
        data: data,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: '#8B5CF6',
        borderWidth: 2
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#666' } }
    },
    scales: {
      y: {
        ticks: { color: '#666' },
        grid: { color: '#e5e7eb' }
      },
      x: {
        ticks: { color: '#666' },
        grid: { display: false }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#666' } }
    }
  };

  if (loading) return <Loader />;

  const alertStats = getAlertStats();
  const totalAlerts = alerts.length;
  // Calculate unread alerts
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;
  
  // Show most recent unread alerts first, or just recent alerts if all read
  const recentAlertsToShow = [...alerts].sort((a, b) => {
      // Sort unread first
      if (a.isRead === b.isRead) return 0;
      return a.isRead ? 1 : -1;
  }).slice(0, 3);


  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your account overview</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card card-hover">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Current Balance</h5>
            <h3 className="text-2xl font-bold text-primary-500">₹{balance.toFixed(2)}</h3>
          </div>
        </div>
        
        <div className="card card-hover">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Recent Transactions</h5>
            <h3 className="text-2xl font-bold text-secondary-500">{recentTransactions.length}</h3>
          </div>
        </div>
        
        {/* MODIFIED CARD: Unread Alerts */}
        <div className="card card-hover">
          <div className="p-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${unreadAlertsCount > 0 ? 'bg-red-100 dark:bg-red-900' : 'bg-gray-100 dark:bg-gray-900'}`}>
              <svg className={`w-8 h-8 ${unreadAlertsCount > 0 ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Unread Alerts</h5>
            <h3 className={`text-2xl font-bold ${unreadAlertsCount > 0 ? 'text-red-500' : 'text-gray-500'}`}>
              {unreadAlertsCount}
            </h3>
          </div>
        </div>
        
        <div className="card card-hover">
          <div className="p-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${unreadAlertsCount === 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-orange-100 dark:bg-orange-900'}`}>
              <svg className={`w-8 h-8 ${unreadAlertsCount === 0 ? 'text-green-500' : 'text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Security Status</h5>
            <h3 className={`text-2xl font-bold ${unreadAlertsCount === 0 ? 'text-green-500' : 'text-orange-500'}`}>
              {unreadAlertsCount === 0 ? 'Good' : 'Needs Action'}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Alerts Summary */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Alerts Summary</h5>
          </div>
          <div className="p-6">
            {totalAlerts > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-secondary-50 dark:bg-secondary-900/20 rounded-lg p-4 text-center">
                    <h4 className="text-2xl font-bold text-secondary-500 mb-1">{alertStats.low}</h4>
                    <small className="text-gray-600 dark:text-gray-400">Low</small>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                    <h4 className="text-2xl font-bold text-yellow-500 mb-1">{alertStats.medium}</h4>
                    <small className="text-gray-600 dark:text-gray-400">Medium</small>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                    <h4 className="text-2xl font-bold text-red-500 mb-1">{alertStats.high}</h4>
                    <small className="text-gray-600 dark:text-gray-400">High</small>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="h-3 rounded-full flex">
                    {/* Ensure width adds up to 100% and handles 0 values */}
                    {totalAlerts > 0 && (
                      <>
                        <div className="bg-secondary-500 rounded-l-full" style={{width: `${(alertStats.low/totalAlerts)*100}%`}}></div>
                        <div className="bg-yellow-500" style={{width: `${(alertStats.medium/totalAlerts)*100}%`}}></div>
                        <div className="bg-red-500 rounded-r-full" style={{width: `${(alertStats.high/totalAlerts)*100}%`}}></div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h5 className="text-lg font-semibold text-green-500 mb-2">All Clear!</h5>
                <p className="text-gray-600 dark:text-gray-400">No leakage alerts detected</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Alerts */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Alerts</h5>
            <Link to="/user/leakage-alerts" className="btn btn-outline-primary text-sm">
              View All
            </Link>
          </div>
          <div className="p-6">
            {recentAlertsToShow.length > 0 ? (
              <div className="space-y-4">
                {recentAlertsToShow.map((alert, index) => (
                  <div key={index} className={`flex items-start p-3 rounded-lg ${alert.isRead ? 'bg-gray-50 dark:bg-gray-700' : 'bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-indigo-500'}`}>
                    <span className={`badge ${getSeverityBadge(alert.severity)} mr-3 mt-1`}>
                      {alert.severity}
                    </span>
                    <div className="flex-grow">
                       <div className="flex justify-between items-start">
                         <h6 className="font-medium text-gray-900 dark:text-white mb-1">{alert.ruleName}</h6>
                         {!alert.isRead && <span className="text-xs font-bold text-indigo-500">NEW</span>}
                       </div>
                      <small className="text-gray-600 dark:text-gray-400">{alert.message}</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">No recent alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h5>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/user/wallet" className="btn btn-primary flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Money
            </Link>
            <Link to="/user/wallet" className="btn btn-outline-primary flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Make Payment
            </Link>
            <Link to="/user/transactions" className="btn btn-outline-secondary flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Transactions
            </Link>
            <Link to="/user/leakage-analytics" className="btn btn-outline-info flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Spending by Category (Last 30 Days)</h5>
          </div>
          <div className="p-6" style={{height: '300px'}}>
            <Pie data={getSpendingData()} options={pieOptions} />
          </div>
        </div>
        
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Spending Trend (Last 30 Days)</h5>
          </div>
          <div className="p-6" style={{height: '300px'}}>
            <Bar data={getDailyTrendData()} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;