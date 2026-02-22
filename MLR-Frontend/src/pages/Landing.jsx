import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            UPI Wallet & Money Leakage Radar
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience a simulated wallet with real-time analytics and intelligent rule-based leakage detection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card card-hover p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Wallet Payments</h5>
            <p className="text-gray-600 dark:text-gray-300">
              Secure and fast digital wallet for all your payment needs with real-time balance tracking
            </p>
          </div>
          
          <div className="card card-hover p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Smart Leakage Alerts</h5>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced rule based system to detect unusual spending patterns and potential money leakage
            </p>
          </div>
          
          <div className="card card-hover p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Analytics Dashboard</h5>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive analytics and insights into your spending habits and financial patterns
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/login" className="btn btn-primary text-lg px-8 py-3 mr-4">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-outline-primary text-lg px-8 py-3">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;