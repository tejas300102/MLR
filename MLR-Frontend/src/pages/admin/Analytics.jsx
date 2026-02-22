import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/Loader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminApi.getAnalytics();
      
      const mappedData = {
        monthlyTransactions: response.monthlyTransactions || response.MonthlyTransactions || [],
        categoryTrends: response.categoryTrends || response.CategoryTrends || [],
        totalLeakageDetected: response.totalLeakageDetected || response.TotalLeakageDetected || 0,
        totalUsers: response.totalUsers || response.TotalUsers || 0,
        totalTransactions: response.totalTransactions || response.TotalTransactions || 0,
        averageTransactionAmount: response.averageTransactionAmount || response.AverageTransactionAmount || 0
      };

      setAnalytics(mappedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <div className="alert alert-danger">
          Failed to load analytics data. Please check if the backend is running.
        </div>
      </div>
    );
  }

  const transactionCountData = {
    labels: analytics.monthlyTransactions.map(item => item.month || item.Month) || [],
    datasets: [
      {
        label: 'Transaction Count',
        data: analytics.monthlyTransactions.map(item => item.count || item.Count) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  const transactionAmountData = {
    labels: analytics.monthlyTransactions.map(item => item.month || item.Month) || [],
    datasets: [
      {
        label: 'Transaction Amount (₹)',
        data: analytics.monthlyTransactions.map(item => item.amount || item.Amount) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const categoryData = {
    labels: analytics.categoryTrends.map(item => item.category || item.Category) || [],
    datasets: [
      {
        data: analytics.categoryTrends.map(item => item.amount || item.Amount) || [],
        backgroundColor: [
          '#F43F5E',
          '#14B8A6',
          '#F59E0B',
          '#8B5CF6',
          '#06B6D4'
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          font: { size: 12 }
        },
        grid: {
          color: '#E5E7EB'
        }
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: { size: 12 }
        },
        grid: {
          display: false
        }
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">System Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center border-l-4 border-primary-500">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Total Users</h5>
          <h3 className="text-3xl font-bold text-primary-500">{analytics.totalUsers}</h3>
        </div>
        <div className="card p-6 text-center border-l-4 border-secondary-500">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Total Transactions</h5>
          <h3 className="text-3xl font-bold text-secondary-500">{analytics.totalTransactions}</h3>
        </div>
        <div className="card p-6 text-center border-l-4 border-red-500">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Leakage Detected</h5>
          <h3 className="text-3xl font-bold text-red-500">₹{analytics.totalLeakageDetected.toFixed(2)}</h3>
        </div>
        <div className="card p-6 text-center border-l-4 border-green-500">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Avg Transaction</h5>
          <h3 className="text-3xl font-bold text-green-500">₹{analytics.averageTransactionAmount.toFixed(2)}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Transaction Count</h5>
          </div>
          <div className="p-6">
            <div className="h-64">
              <Bar data={transactionCountData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Transaction Amount</h5>
          </div>
          <div className="p-6">
            <div className="h-64">
              <Line data={transactionAmountData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Category Trends</h5>
          </div>
          <div className="p-6">
            <div className="table-wrap">
              <table className="table-premium">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Total Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.categoryTrends.map((item, index) => {
                    const total = analytics.categoryTrends.reduce((sum, cat) => sum + (cat.amount || cat.Amount), 0);
                    const amount = item.amount || item.Amount;
                    const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
                    return (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-gray-900 dark:text-white text-sm">{item.category || item.Category}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-semibold text-sm">₹{amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center">
                            <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                              <div
                                className="bg-primary-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-600 dark:text-gray-400">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Category Distribution</h5>
          </div>
          <div className="p-6">
            <div className="h-64">
              <Doughnut data={categoryData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;