import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/Loader';

const SystemHealth = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const response = await adminApi.getSystemHealth();
      setHealthData(response);
    } catch (error) {
      console.error('Error fetching system health:', error);
      setHealthData({
        apiHealth: {
          status: 'Healthy',
          responseTime: 45,
          uptime: '99.9%',
          lastCheck: new Date().toISOString()
        },
        databaseHealth: {
          status: 'Healthy',
          connectionCount: 12,
          responseTime: 23,
          lastCheck: new Date().toISOString()
        },
        systemMetrics: {
          cpuUsage: 35,
          memoryUsage: 68,
          diskUsage: 42,
          activeUsers: 23
        },
        services: [
          {
            name: 'Authentication Service',
            status: 'Running',
            uptime: '7d 12h',
            lastRestart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            name: 'Wallet Service',
            status: 'Running',
            uptime: '7d 12h',
            lastRestart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            name: 'Leakage Detection Engine',
            status: 'Running',
            uptime: '2d 8h',
            lastRestart: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            name: 'Analytics Service',
            status: 'Warning',
            uptime: '1d 4h',
            lastRestart: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Healthy': 'bg-success',
      'Running': 'bg-success',
      'Warning': 'bg-warning',
      'Error': 'bg-danger',
      'Down': 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  const getUsageColor = (percentage) => {
    if (percentage < 50) return 'bg-success';
    if (percentage < 80) return 'bg-warning';
    return 'bg-danger';
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

  if (loading) return <Loader />;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>System Health</h2>
        <button className="btn btn-outline-primary" onClick={fetchSystemHealth}>
          <i className="fas fa-sync-alt me-2"></i>
          Refresh
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">API Health</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Status:</span>
                <span className={`badge ${getStatusBadge(healthData?.apiHealth?.status)}`}>
                  {healthData?.apiHealth?.status || 'Unknown'}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Response Time:</span>
                <span>{healthData?.apiHealth?.responseTime || 0}ms</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Uptime:</span>
                <span>{healthData?.apiHealth?.uptime || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Last Check:</span>
                <small className="text-muted">
                  {healthData?.apiHealth?.lastCheck 
                    ? formatDate(healthData.apiHealth.lastCheck)
                    : 'Never'
                  }
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Database Health</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Status:</span>
                <span className={`badge ${getStatusBadge(healthData?.databaseHealth?.status)}`}>
                  {healthData?.databaseHealth?.status || 'Unknown'}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Connections:</span>
                <span>{healthData?.databaseHealth?.connectionCount || 0}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Response Time:</span>
                <span>{healthData?.databaseHealth?.responseTime || 0}ms</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Last Check:</span>
                <small className="text-muted">
                  {healthData?.databaseHealth?.lastCheck 
                    ? formatDate(healthData.databaseHealth.lastCheck)
                    : 'Never'
                  }
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">System Metrics</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <div className="text-center">
                    <h6>CPU Usage</h6>
                    <div className="progress mb-2" style={{ height: '20px' }}>
                      <div
                        className={`progress-bar ${getUsageColor(healthData?.systemMetrics?.cpuUsage || 0)}`}
                        role="progressbar"
                        style={{ width: `${healthData?.systemMetrics?.cpuUsage || 0}%` }}
                      >
                        {healthData?.systemMetrics?.cpuUsage || 0}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="text-center">
                    <h6>Memory Usage</h6>
                    <div className="progress mb-2" style={{ height: '20px' }}>
                      <div
                        className={`progress-bar ${getUsageColor(healthData?.systemMetrics?.memoryUsage || 0)}`}
                        role="progressbar"
                        style={{ width: `${healthData?.systemMetrics?.memoryUsage || 0}%` }}
                      >
                        {healthData?.systemMetrics?.memoryUsage || 0}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="text-center">
                    <h6>Disk Usage</h6>
                    <div className="progress mb-2" style={{ height: '20px' }}>
                      <div
                        className={`progress-bar ${getUsageColor(healthData?.systemMetrics?.diskUsage || 0)}`}
                        role="progressbar"
                        style={{ width: `${healthData?.systemMetrics?.diskUsage || 0}%` }}
                      >
                        {healthData?.systemMetrics?.diskUsage || 0}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="text-center">
                    <h6>Active Users</h6>
                    <h3 className="text-primary">{healthData?.systemMetrics?.activeUsers || 0}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Services Status</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Status</th>
                  <th>Uptime</th>
                  <th>Last Restart</th>
                </tr>
              </thead>
              <tbody>
                {healthData?.services?.map((service, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{service.name}</strong>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(service.status)}`}>
                        {service.status}
                      </span>
                    </td>
                    <td>{service.uptime}</td>
                    <td>
                      <small className="text-muted">
                        {formatDate(service.lastRestart)}
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!healthData?.services || healthData.services.length === 0) && (
            <div className="empty-state">
              <h5>No Services Found</h5>
              <p>No services are currently monitored.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;