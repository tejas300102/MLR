// 


import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { walletApi } from '../api/walletApi';
import logo from '../assets/logoo.png'; 

const Navbar = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    if (isAuthenticated && (role === 'USER' || role === 'User')) {
      try {
        const response = await walletApi.getLeakageAlerts();
        const alerts = response.alerts || response || [];
        const unread = Array.isArray(alerts) ? alerts.filter(a => !a.isRead).length : 0;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 30000); 

    return () => clearInterval(intervalId);
  }, [isAuthenticated, role, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const getBrandPath = () => {
    if (!isAuthenticated) return "/";
    if (role === 'ADMIN' || role === 'Admin') return "/admin/dashboard";
    return "/user/dashboard";
  };

  const renderNavLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/about">About</Link>
          <Link className="nav-link" to="/contact">Contact</Link>
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="btn btn-primary ml-2" to="/register">Register</Link>
        </>
      );
    }

    if (role === 'USER' || role === 'User') {
      return (
        <>
          <Link className="nav-link" to="/user/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/user/wallet">Wallet</Link>
          <Link className="nav-link" to="/user/transactions">Transactions</Link>
          
          <Link className="nav-link relative flex items-center gap-1" to="/user/leakage-alerts">
            Alerts
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
          
          <Link className="nav-link" to="/user/leakage-analytics">Analytics</Link>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="nav-link flex items-center"
            >
              Profile
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/user/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  My Profile
                </Link>
                <hr className="border-gray-200 dark:border-gray-600" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      );
    }

    if (role === 'ADMIN' || role === 'Admin') {
      return (
        <>
          <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/admin/users">Users</Link>
          <Link className="nav-link" to="/admin/analytics">Analytics</Link>
          <Link className="nav-link" to="/admin/rule-monitor">Rules</Link>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="nav-link flex items-center"
            >
              Profile
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  My Profile
                </Link>
                <hr className="border-gray-200 dark:border-gray-600" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <nav className="navbar-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link className="text-white text-xl font-bold hover:text-gray-200 transition-colors duration-200 flex items-center gap-3" to={getBrandPath()}>
              {/* UPDATED LOGO SECTION */}
              <img 
                src={logo} 
                alt="MLR Logo" 
                className="h-10 w-auto object-contain" 
              />
              <span className="hidden sm:inline">Money Leakage Radar</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {renderNavLinks()}
          </div>

          <div className="md:hidden flex items-center">
             {unreadCount > 0 && role === 'USER' && !isMenuOpen && (
                <span className="mr-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {unreadCount}
                </span>
             )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" style={{ background: "rgba(15 9 36 / 0.85)", backdropFilter: "blur(14px)", borderTop: "1px solid rgba(255 255 255 / 0.08)" }}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {renderNavLinks()}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;