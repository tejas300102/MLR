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
import { walletApi } from '../../api/walletApi';
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
      const response = await walletApi.getLeakageAnalytics();
      setAnalytics(response);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics({
        monthlyLeakage: [
          { month: 'Jan', amount: 1200 },
          { month: 'Feb', amount: 800 },
          { month: 'Mar', amount: 1500 },
          { month: 'Apr', amount: 900 },
          { month: 'May', amount: 1100 },
          { month: 'Jun', amount: 1300 }
        ],
        categoryLeakage: [
          { category: 'Food', amount: 2500 },
          { category: 'Transport', amount: 1200 },
          { category: 'Shopping', amount: 1800 },
          { category: 'Entertainment', amount: 800 },
          { category: 'Bills', amount: 600 }
        ],
        totalLeakage: 6900,
        averageMonthly: 1150
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
        backgroundColor: 'rgba(244, 63, 94, 0.6)',
        borderColor: 'rgba(244, 63, 94, 1)',
        borderWidth: 2,
      },
    ],
  };

  const categoryChartData = {
    labels: analytics?.categoryLeakage?.map(item => item.category) || [],
    datasets: [
      {
        data: analytics?.categoryLeakage?.map(item => item.amount) || [],
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
      title: {
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
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Leakage Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6 text-center border-l-4 border-red-500">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Total Leakage</h5>
          <h3 className="text-3xl font-bold text-red-500">₹{analytics?.totalLeakage?.toFixed(2) || '0.00'}</h3>
        </div>
        <div className="card p-6 text-center border-l-4 border-yellow-500">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Average Monthly</h5>
          <h3 className="text-3xl font-bold text-yellow-500">₹{analytics?.averageMonthly?.toFixed(2) || '0.00'}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Leakage Trend</h5>
          </div>
          <div className="p-6">
            <div className="h-64">
              <Bar data={monthlyChartData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        <div className="card">
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

      {/* Detailed Breakdown */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Category Breakdown</h5>
        </div>
        <div className="p-6">
          <div className="table-wrap">
            <table className="table-premium">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white text-sm">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.categoryLeakage?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white text-sm">{item.category}</td>
                    <td className="py-3 px-4 text-red-600 font-semibold text-sm">₹{item.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                      {((item.amount / analytics.totalLeakage) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeakageAnalytics;