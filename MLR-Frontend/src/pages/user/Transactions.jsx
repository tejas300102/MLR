import React, { useState, useEffect } from 'react';
import { walletApi } from '../../api/walletApi';
import Loader from '../../components/Loader';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await walletApi.getTransactions(filters);
      setTransactions(response || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.category && !((transaction.categoryName || '').includes(filters.category))) return false;
    if (filters.startDate && new Date(transaction.createdAt) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(transaction.createdAt) > new Date(filters.endDate)) return false;
    return true;
  });

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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Transactions</h2>

      {/* Filters */}
      <div className="card mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="type" className="form-label">Type</label>
              <select
                className="form-input"
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className="form-input"
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="Food & Dining">Food</option>
                <option value="Transportation">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills & Utilities">Bills</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <button className="btn btn-outline-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="p-6">
          {filteredTransactions.length > 0 ? (
            <div className="table-wrap">
              <table className="table-premium">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">UPI ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={transaction.id || index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {formatDate(transaction.createdAt || transaction.date)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${
                          transaction.type === 'CREDIT' ? 'badge-success' : 'badge-danger'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-semibold ${
                        transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'CREDIT' ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {transaction.categoryName || '-'}
                      </td>
                      {/* NEW UPI ID COLUMN */}
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {transaction.upiId || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {transaction.description || transaction.note || '-'}
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
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Transactions Found</h5>
              <p className="text-gray-600 dark:text-gray-400">No transactions match your current filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;