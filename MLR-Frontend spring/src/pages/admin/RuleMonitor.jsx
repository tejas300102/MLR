import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/Loader';

const RuleMonitor = () => {
  const [rulesStatus, setRulesStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRulesStatus();
    const interval = setInterval(fetchRulesStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRulesStatus = async () => {
    try {
      const response = await adminApi.getRulesStatus();
      
      const mappedData = {
        engineStatus: response.engineStatus || response.EngineStatus || 'Unknown',
        lastExecutionTime: response.lastExecutionTime || response.LastExecutionTime,
        totalRulesExecuted: response.totalRulesExecuted || response.TotalRulesExecuted || 0,
        alertsGenerated: response.alertsGenerated || response.AlertsGenerated || 0,
        averageExecutionTime: response.averageExecutionTime || response.AverageExecutionTime || 0,
        
        rules: (response.rules || response.Rules || []).map(r => ({
          id: r.id || r.Id,
          name: r.name || r.Name,
          status: r.status || r.Status || 'Active',
          description: r.description || r.Description,
          triggerCount: (r.triggerCount !== undefined) ? r.triggerCount : (r.TriggerCount || 0),
          lastTriggered: r.lastTriggered || r.LastTriggered
        }))
      };

      setRulesStatus(mappedData);
    } catch (error) {
      console.error('Error fetching rules status:', error);
      setRulesStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (dateString) => {
    if (!dateString) return 'Never';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'active' || s === 'running') return 'badge-success'; 
    if (s === 'stalled') return 'badge-warning'; 
    if (s === 'error') return 'badge-danger'; 
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loader />;
  
  if (!rulesStatus) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h5 className="text-lg font-semibold text-red-700">Failed to load rule status</h5>
          <p className="text-red-600">Please check if the backend server is running.</p>
          <button 
            className="mt-4 btn btn-outline-primary"
            onClick={fetchRulesStatus}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Rule Monitor</h2>
          <p className="text-gray-500 text-sm mt-1">Real-time status of detection algorithms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center border-l-4 border-green-500 shadow-sm">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Engine Status</h5>
          <span className={`badge ${getStatusBadge(rulesStatus.engineStatus)} text-lg px-4 py-2`}>
            {rulesStatus.engineStatus}
          </span>
        </div>
        <div className="card p-6 text-center border-l-4 border-secondary-500 shadow-sm">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Total Processed</h5>
          <h3 className="text-3xl font-bold text-secondary-500">{rulesStatus.totalRulesExecuted}</h3>
        </div>
        <div className="card p-6 text-center border-l-4 border-red-500 shadow-sm">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Alerts Generated</h5>
          <h3 className="text-3xl font-bold text-red-500">{rulesStatus.alertsGenerated}</h3>
        </div>
        <div className="card p-6 text-center border-l-4 border-blue-500 shadow-sm">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Avg Execution</h5>
          <h3 className="text-3xl font-bold text-blue-500">~{rulesStatus.averageExecutionTime}ms</h3>
        </div>
      </div>

      <div className="card mb-8 shadow-sm">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Last Scheduler Run</h5>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              The detection engine runs automatically every 30 seconds.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {rulesStatus.lastExecutionTime ? formatDate(rulesStatus.lastExecutionTime) : 'Pending...'}
            </p>
            <p className="text-sm text-gray-500">
              {rulesStatus.lastExecutionTime ? getTimeSince(rulesStatus.lastExecutionTime) : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="card shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Active Rules & Trigger Statistics</h5>
        </div>
        <div className="p-0">
          {rulesStatus.rules.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rule Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Logic / Description</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Triggers</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Triggered</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {rulesStatus.rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{rule.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(rule.status)}`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={rule.description}>
                          {rule.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {rule.triggerCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {rule.lastTriggered ? getTimeSince(rule.lastTriggered) : '-'}
                        </div>
                        {rule.lastTriggered && (
                          <div className="text-xs text-gray-500">{formatDate(rule.lastTriggered)}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Rules Found</h5>
              <p className="text-gray-600 dark:text-gray-400">The rules configuration file (rules.json) appears to be empty or missing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleMonitor;