import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    action: null,
    userId: null
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (search = '') => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers(search);
      const usersWithStatus = (response || []).map(user => ({
        ...user,
        status: user.isBlocked ? 'blocked' : 'active'
      }));
      setUsers(usersWithStatus);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      showMessage('Failed to load users', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchUsers('');
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const showConfirmModal = (title, message, action, userId) => {
    setConfirmModal({
      show: true,
      title,
      message,
      action,
      userId
    });
  };

  const hideConfirmModal = () => {
    setConfirmModal({
      show: false,
      title: '',
      message: '',
      action: null,
      userId: null
    });
  };

  const handleConfirmAction = async () => {
    setActionLoading(true);
    try {
      const { action, userId } = confirmModal;
      
      if (action === 'block') {
        await adminApi.blockUser(userId);
        showMessage('User blocked successfully', 'success');
      } else if (action === 'activate') {
        await adminApi.activateUser(userId);
        showMessage('User activated successfully', 'success');
      } else if (action === 'resetWallet') {
        await adminApi.resetWallet(userId);
        showMessage('Wallet reset successfully', 'success');
      }
      
      
      fetchUsers(searchQuery);
    } catch (error) {
      showMessage(error.response?.data?.message || 'Action failed', 'danger');
    } finally {
      setActionLoading(false);
      hideConfirmModal();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getModalType = () => {
    if (confirmModal.action === 'activate') return 'success';
    if (confirmModal.action === 'resetWallet') return 'warning';
    return 'danger'; 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h2>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search name or email..."
            className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            disabled={loading}
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {loading ? (
             <div className="flex justify-center py-12">
               <Loader />
             </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {user.status === 'active' ? (
                            <button
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 border border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30 px-3 py-1 rounded-md text-xs transition-colors"
                              onClick={() => showConfirmModal(
                                'Block User',
                                `Are you sure you want to block ${user.firstName} ${user.lastName}? They will no longer be able to access their account.`,
                                'block',
                                user.id
                              )}
                              disabled={actionLoading}
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 border border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/30 px-3 py-1 rounded-md text-xs transition-colors"
                              onClick={() => showConfirmModal(
                                'Activate User',
                                `Are you sure you want to activate ${user.firstName} ${user.lastName}? Access will be restored immediately.`,
                                'activate',
                                user.id
                              )}
                              disabled={actionLoading}
                            >
                              Activate
                            </button>
                          )}
                          <button
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 border border-yellow-200 hover:bg-yellow-50 dark:border-yellow-800 dark:hover:bg-yellow-900/30 px-3 py-1 rounded-md text-xs transition-colors"
                            onClick={() => showConfirmModal(
                              'Reset Wallet',
                              `Are you sure you want to reset the wallet for ${user.firstName}? This will zero out their balance.`,
                              'resetWallet',
                              user.id
                            )}
                            disabled={actionLoading}
                          >
                            Reset
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? `No results for "${searchQuery}"` : "No Users Found"}
              </h5>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? "Try checking for typos or searching by a different name/email." : "No users are registered in the system."}
              </p>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirmAction}
        onCancel={hideConfirmModal}
        confirmText="Yes, I'm sure"
        cancelText="No, cancel"
        type={getModalType()}
      />
    </div>
  );
};

export default Users;