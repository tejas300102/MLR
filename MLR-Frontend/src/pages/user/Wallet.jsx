import React, { useState, useEffect } from 'react';
import { walletApi } from '../../api/walletApi';
import Loader from '../../components/Loader';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [addMoneyForm, setAddMoneyForm] = useState({
    amount: '',
    source: 'Salary'
  });

  // Updated state to include UPI ID
  const [payForm, setPayForm] = useState({
    amount: '',
    categoryId: 1,
    description: '',
    upiId: '' // Added field
  });

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await walletApi.getBalance();
      setBalance(response.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      await walletApi.addMoney({
        amount: parseFloat(addMoneyForm.amount),
        source: addMoneyForm.source
      });
      
      showMessage('Money added successfully!', 'success');
      setAddMoneyForm({ amount: '', source: 'Salary' });
      fetchBalance();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to add money', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      // Include UPI ID in the API payload
      await walletApi.pay({
        amount: parseFloat(payForm.amount),
        categoryId: parseInt(payForm.categoryId),
        description: payForm.description,
        upiId: payForm.upiId // Send to backend
      });
      
      showMessage('Payment successful!', 'success');
      // Reset form including UPI ID
      setPayForm({ amount: '', categoryId: 1, description: '', upiId: '' });
      fetchBalance();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Payment failed', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Wallet</h2>

      {message && (
        <div className={`alert alert-${messageType} mb-6`}>
          {message}
        </div>
      )}

      <div className="mb-8">
        <div className="card p-6 text-center max-w-md">
          <h5 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Current Balance</h5>
          <h2 className="text-4xl font-bold text-primary-500">₹{balance.toFixed(2)}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ADD MONEY CARD */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Add Money</h5>
          </div>
          <div className="p-6">
            <form onSubmit={handleAddMoney} className="space-y-4">
              <div>
                <label htmlFor="addAmount" className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-input"
                  id="addAmount"
                  value={addMoneyForm.amount}
                  onChange={(e) => setAddMoneyForm({...addMoneyForm, amount: e.target.value})}
                  min="1"
                  step="0.01"
                  placeholder="Enter amount to add"
                  required
                />
              </div>
              <div>
                <label htmlFor="source" className="form-label">Source</label>
                <select
                  className="form-input"
                  id="source"
                  value={addMoneyForm.source}
                  onChange={(e) => setAddMoneyForm({...addMoneyForm, source: e.target.value})}
                >
                  <option value="Salary">Salary</option>
                  <option value="Cash">Cash</option>
                  <option value="Refund">Refund</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn bg-green-500 hover:bg-green-600 text-white w-full"
                disabled={actionLoading}
              >
                {actionLoading ? 'Adding...' : 'Add Money'}
              </button>
            </form>
          </div>
        </div>

        {/* MAKE PAYMENT CARD */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Make Payment</h5>
          </div>
          <div className="p-6">
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label htmlFor="payAmount" className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-input"
                  id="payAmount"
                  value={payForm.amount}
                  onChange={(e) => setPayForm({...payForm, amount: e.target.value})}
                  min="1"
                  step="0.01"
                  placeholder="Enter payment amount"
                  required
                />
              </div>

              {/* Added UPI ID Input */}
              <div>
                <label htmlFor="upiId" className="form-label">UPI ID (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  id="upiId"
                  value={payForm.upiId}
                  onChange={(e) => setPayForm({...payForm, upiId: e.target.value})}
                  placeholder="e.g. user@okhdfcbank"
                />
              </div>

              <div>
                <label htmlFor="categoryId" className="form-label">Category</label>
                <select
                  className="form-input"
                  id="categoryId"
                  value={payForm.categoryId}
                  onChange={(e) => setPayForm({...payForm, categoryId: e.target.value})}
                >
                  <option value={1}>Food</option>
                  <option value={2}>Transport</option>
                  <option value={3}>Shopping</option>
                  <option value={4}>Entertainment</option>
                  <option value={5}>Bills</option>
                  <option value={6}>Healthcare</option>
                  <option value={7}>Education</option>
                  <option value={8}>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="form-label">Description (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  id="description"
                  value={payForm.description}
                  onChange={(e) => setPayForm({...payForm, description: e.target.value})}
                  placeholder="Payment description"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={actionLoading || balance < parseFloat(payForm.amount || 0)}
              >
                {actionLoading ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;