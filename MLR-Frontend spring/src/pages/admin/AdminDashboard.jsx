import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalAlerts: 0,
    systemHealth: 'Loading...'
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getUsers()
      ]);
      
      setStats({
        totalUsers: usersRes?.length || 0,
        totalTransactions: analyticsRes.totalTransactions || analyticsRes.TotalTransactions || 0,
        totalAlerts: analyticsRes.unresolvedAlerts || analyticsRes.UnresolvedAlerts || 0,
        systemHealth: analyticsRes.systemHealth || analyticsRes.SystemHealth || 'Unknown'
      });
      
      setRecentAlerts(analyticsRes.recentAlerts || analyticsRes.RecentAlerts || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({
        totalUsers: 0,
        totalTransactions: 0,
        totalAlerts: 0,
        systemHealth: 'Connection Error'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      low: 'badge-info',
      medium: 'badge-warning',
      high: 'badge-danger',
      critical: 'badge-danger'
    };
    return badges[severity?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getHealthColor = (health) => {
    if (health === 'Good' || health === 'Running') return 'text-green-500 border-green-500';
    if (health === 'Warning') return 'text-yellow-500 border-yellow-500';
    if (health === 'Critical' || health === 'Stalled' || health === 'Connection Error') return 'text-red-500 border-red-500';
    return 'text-gray-500 border-gray-500';
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center border-l-4 border-primary-500 shadow-sm">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Total Users</h5>
          <h3 className="text-3xl font-bold text-primary-500">{stats.totalUsers}</h3>
        </div>
        <div className="card p-6 text-center border-l-4 border-secondary-500 shadow-sm">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Total Transactions</h5>
          <h3 className="text-3xl font-bold text-secondary-500">{stats.totalTransactions}</h3>
        </div>
        <div className="card p-6 text-center border-l-4 border-red-500 shadow-sm">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Total Alerts Unread by Users</h5>
          <h3 className="text-3xl font-bold text-red-500">{stats.totalAlerts}</h3>
        </div>
        
        <div className={`card p-6 text-center border-l-4 shadow-sm ${getHealthColor(stats.systemHealth).split(' ')[1]}`}>
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">System Health</h5>
          <h3 className={`text-3xl font-bold ${getHealthColor(stats.systemHealth).split(' ')[0]}`}>
            {stats.systemHealth}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h5>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link to="/admin/users" className="btn btn-primary w-full text-center block">
                Manage Users
              </Link>
              <Link to="/admin/analytics" className="btn btn-outline-primary w-full text-center block">
                View Analytics
              </Link>
              <Link to="/admin/rule-monitor" className="btn btn-outline-secondary w-full text-center block">
                Rule Monitor
              </Link>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Alerts</h5>
            {recentAlerts.length > 0 && (
              <span className="badge badge-danger">{recentAlerts.length} New</span>
            )}
          </div>
          <div className="p-6">
            {recentAlerts.length > 0 ? (
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id || Math.random()} className="border-l-4 border-red-500 pl-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-r">
                    <div className="flex justify-between items-start mb-2">
                      <h6 className="font-semibold text-gray-900 dark:text-white flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {alert.ruleName}
                      </h6>
                      <small className="text-gray-500 dark:text-gray-400">{formatDate(alert.createdAt)}</small>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{alert.message}</p>
                    <div className="flex justify-between items-center">
                      <small className="text-gray-500 dark:text-gray-400">
                        User: <strong>{alert.userEmail || 'Unknown'}</strong>
                      </small>
                      <span className={`badge ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">All clear! No recent alerts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;