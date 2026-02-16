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
import { Bar, Doughnut } from 'react-chartjs-2';
import { analyticsApi } from '../../api/analyticsApi';
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

const LeakageAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsApi.getUserAnalytics();
      setAnalytics(response);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback similar to .NET fallback logic
      setAnalytics({
        monthlyLeakage: [],
        categoryLeakage: [],
        totalLeakage: 0,
        averageMonthly: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const monthlyChartData = {
    labels: analytics?.monthlyLeakage?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Monthly Leakage (₹)',
        data: analytics?.monthlyLeakage?.map(item => item.amount) || [],
        backgroundColor: 'rgba(244, 63, 94, 0.6)', // Red-500 equivalent
        borderColor: 'rgba(244, 63, 94, 1)',
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const categoryChartData = {
    labels: analytics?.categoryLeakage?.map(item => item.category) || [],
    datasets: [
      {
        data: analytics?.categoryLeakage?.map(item => item.amount) || [],
        backgroundColor: [
          '#F43F5E', // Red
          '#14B8A6', // Teal
          '#F59E0B', // Amber
          '#8B5CF6', // Violet
          '#06B6D4', // Cyan
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#6B7280', font: { size: 12 } },
        grid: { color: '#E5E7EB' }
      },
      x: {
        ticks: { color: '#6B7280', font: { size: 12 } },
        grid: { display: false }
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true, font: { size: 12 } }
      },
      title: { display: false },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Leakage Analytics</h2>

      {/* Summary Cards - Matching .NET Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6 text-center border-l-4 border-red-500 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Total Leakage</h5>
          <h3 className="text-3xl font-bold text-red-500">
            ₹{analytics?.totalLeakage?.toFixed(2) || '0.00'}
          </h3>
        </div>
        <div className="card p-6 text-center border-l-4 border-yellow-500 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Average Monthly</h5>
          <h3 className="text-3xl font-bold text-yellow-500">
            ₹{analytics?.averageMonthly?.toFixed(2) || '0.00'}
          </h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 card bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Leakage Trend</h5>
          </div>
          <div className="p-6">
            <div className="h-64">
              <Bar data={monthlyChartData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        {/* Doughnut Chart */}
        <div className="card bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Category Distribution</h5>
          </div>
          <div className="p-6">
            <div className="h-64">
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div className="card bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Category Breakdown</h5>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Category</th>
                <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Amount</th>
                <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.categoryLeakage?.length > 0 ? (
                analytics.categoryLeakage.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white text-sm">{item.category}</td>
                    <td className="py-3 px-4 text-red-600 font-semibold text-sm">₹{item.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                      {analytics.totalLeakage > 0 
                        ? ((item.amount / analytics.totalLeakage) * 100).toFixed(1) 
                        : 0}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="3" className="py-4 text-center text-gray-500">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeakageAnalytics;