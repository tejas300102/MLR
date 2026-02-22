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
          status: r.status || r.Status,
          description: r.description || r.Description,
          triggerCount: r.triggerCount || r.TriggerCount || 0,
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    return status === 'Active' || status === 'Running' ? 'badge-success' : 'bg-gray-100 text-gray-800';
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

  if (loading) return <Loader />;
  if (!rulesStatus) return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-center">
      <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Failed to load rule status.</h5>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Rule Monitor</h2>
        {/* <button className="btn btn-outline-primary" onClick={fetchRulesStatus}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button> */}
      </div>

      {/* Engine Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center border-l-4 border-green-500">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Engine Status</h5>
          <span className={`badge ${getStatusBadge(rulesStatus.engineStatus)} text-lg px-4 py-2`}>
            {rulesStatus.engineStatus}
          </span>
        </div>
        <div className="card p-6 text-center border-l-4 border-secondary-500">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Total Processed</h5>
          <h3 className="text-3xl font-bold text-secondary-500">{rulesStatus.totalRulesExecuted}</h3>
        </div>
        <div className="card p-6 text-center border-l-4 border-red-500">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Alerts Generated</h5>
          <h3 className="text-3xl font-bold text-red-500">{rulesStatus.alertsGenerated}</h3>
        </div>
        <div className="card p-6 text-center border-l-4 border-primary-500">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Avg Execution</h5>
          <h3 className="text-3xl font-bold text-primary-500">~{rulesStatus.averageExecutionTime}ms</h3>
        </div>
      </div>

      {/* Last Execution */}
      <div className="card mb-8">
        <div className="p-6">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Last Execution</h5>
          <p className="text-gray-600 dark:text-gray-400">
            {rulesStatus.lastExecutionTime 
              ? `${formatDate(rulesStatus.lastExecutionTime)} (${getTimeSince(rulesStatus.lastExecutionTime)})`
              : 'No recent execution logged'
            }
          </p>
        </div>
      </div>

      {/* Rules List */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Rules Status</h5>
        </div>
        <div className="p-6">
          {rulesStatus.rules.length > 0 ? (
            <div className="table-wrap">
              <table className="table-premium">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Rule Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Trigger Count</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Last Triggered</th>
                  </tr>
                </thead>
                <tbody>
                  {rulesStatus.rules.map((rule) => (
                    <tr key={rule.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <strong className="text-gray-900 dark:text-white text-sm">{rule.name}</strong>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${getStatusBadge(rule.status)}`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <small className="text-gray-600 dark:text-gray-400">{rule.description}</small>
                      </td>
                      <td className="py-3 px-4">
                        <span className="badge badge-info">{rule.triggerCount}</span>
                      </td>
                      <td className="py-3 px-4">
                        <small className="text-gray-600 dark:text-gray-400">
                          {rule.lastTriggered 
                            ? getTimeSince(rule.lastTriggered)
                            : 'Never'
                          }
                        </small>
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
              <p className="text-gray-600 dark:text-gray-400">No rules are currently configured in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleMonitor;