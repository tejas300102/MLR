import React, { useState, useEffect } from 'react';
import { walletApi } from '../../api/walletApi';
import Loader from '../../components/Loader';

const LeakageAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unread'); 
  const [processingId, setProcessingId] = useState(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await walletApi.getLeakageAlerts();
      const rawAlerts = response.alerts || response || [];
      const sorted = rawAlerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAlerts(sorted);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };


  const handleMarkAsRead = async (alertId) => {
    if (processingId) return;
    try {
      setProcessingId(alertId);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a));
      await walletApi.markLeakageAlertRead(alertId);
    } catch (error) {
      console.error('Error marking read:', error);
      fetchAlerts(); 
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    if (isMarkingAll) return;
    const unreadIds = alerts.filter(a => !a.isRead).map(a => a.id);
    if (unreadIds.length === 0) return;

    if (!window.confirm(`Mark ${unreadIds.length} alerts as read?`)) return;

    try {
      setIsMarkingAll(true);
      setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));

      await Promise.all(unreadIds.map(id => walletApi.markLeakageAlertRead(id)));
      
    } catch (error) {
      console.error('Error marking all read:', error);
      fetchAlerts();
    } finally {
      setIsMarkingAll(false);
    }
  };


  const groupAlertsByDate = (alertList) => {
    const groups = {
      'Today': [],
      'Yesterday': [],
      'Earlier': []
    };

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    alertList.forEach(alert => {
      const date = new Date(alert.createdAt || alert.timestamp);
      
      if (date.toDateString() === today.toDateString()) {
        groups['Today'].push(alert);
      } else if (date.toDateString() === yesterday.toDateString()) {
        groups['Yesterday'].push(alert);
      } else {
        groups['Earlier'].push(alert);
      }
    });

    return groups;
  };


  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return { 
        border: 'border-red-500', 
        bg: 'bg-red-50 dark:bg-red-900/10',
        text: 'text-red-700 dark:text-red-400',
        icon: (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      };
      case 'medium': return { 
        border: 'border-yellow-500', 
        bg: 'bg-yellow-50 dark:bg-yellow-900/10',
        text: 'text-yellow-700 dark:text-yellow-400',
        icon: (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
      default: return { 
        border: 'border-blue-500', 
        bg: 'bg-blue-50 dark:bg-blue-900/10',
        text: 'text-blue-700 dark:text-blue-400',
        icon: (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };



  if (loading) return <Loader />;

  const displayedAlerts = activeTab === 'unread' 
    ? alerts.filter(a => !a.isRead) 
    : alerts;

  const groupedAlerts = groupAlertsByDate(displayedAlerts);
  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h2>
          <p className="text-gray-500 mt-1">
            You have {unreadCount} unread alerts
          </p>
        </div>
        
        {unreadCount > 0 && (
           <button 
             onClick={handleMarkAllRead}
             disabled={isMarkingAll}
             className="mt-4 md:mt-0 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
           >
             {isMarkingAll ? (
               <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"/>
             ) : (
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
             )}
             Mark all as read
           </button>
        )}
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('unread')}
          className={`pb-4 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'unread' 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          Unread
          {activeTab === 'unread' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-4 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'all' 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          All History
          {activeTab === 'all' && (
             <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></span>
          )}
        </button>
      </div>

      <div className="space-y-8">
        {['Today', 'Yesterday', 'Earlier'].map(groupName => {
          const groupItems = groupedAlerts[groupName];
          if (groupItems.length === 0) return null;

          return (
            <div key={groupName} className="animate-fadeIn">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">
                {groupName}
              </h3>
              <div className="space-y-3">
                {groupItems.map(alert => {
                  const styles = getSeverityStyles(alert.severity);
                  
                  return (
                    <div 
                      key={alert.id}
                      className={`group relative bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border transition-all duration-200 
                        ${alert.isRead 
                          ? 'border-gray-100 dark:border-gray-700 opacity-75 hover:opacity-100' 
                          : `border-l-4 ${styles.border} shadow-md transform hover:-translate-y-0.5`
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${styles.bg}`}>
                          {styles.icon}
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className={`text-base font-semibold truncate pr-2 ${alert.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                {alert.ruleName}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {alert.message}
                              </p>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2 pl-2">
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {groupName === 'Earlier' ? formatDate(alert.createdAt) : formatTime(alert.createdAt)}
                              </span>
                              
                              {!alert.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(alert.id);
                                  }}
                                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>

                          {alert.recommendation && (
                            <div className="mt-3 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                              <span className="font-medium text-gray-900 dark:text-gray-200">Tip: </span>
                              {alert.recommendation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {displayedAlerts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
             </div>
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
             <p className="text-gray-500 mt-1">
               {activeTab === 'unread' 
                 ? "You have no unread alerts. Great job!" 
                 : "No alert history found."}
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeakageAlerts;