import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DarkThemeToggle from './components/DarkThemeToggle';

import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import UserDashboard from './pages/user/UserDashboard';
import Wallet from './pages/user/Wallet';
import Transactions from './pages/user/Transactions';
import LeakageAlerts from './pages/user/LeakageAlerts';
import LeakageAnalytics from './pages/user/LeakageAnalytics';

import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import Analytics from './pages/admin/Analytics';
import RuleMonitor from './pages/admin/RuleMonitor';

import Profile from './components/Profile';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app-shell">
            <Navbar />
            <main className="min-h-[calc(100vh-140px)]">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/user/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/wallet"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <Wallet />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/transactions"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <Transactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/leakage-alerts"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <LeakageAlerts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/leakage-analytics"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <LeakageAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/profile"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/rule-monitor"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <RuleMonitor />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/admin/profile"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/unauthorized"
                  element={
                    <div className="max-w-4xl mx-auto px-4 py-8">
                      <div className="flex justify-center">
                        <div className="w-full max-w-md text-center">
                          <div className="alert alert-danger">
                            <h4 className="text-lg font-semibold mb-2">Unauthorized Access</h4>
                            <p className="mb-4">You don't have permission to access this page.</p>
                            <a href="/" className="btn btn-primary">Go Home</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <DarkThemeToggle />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;