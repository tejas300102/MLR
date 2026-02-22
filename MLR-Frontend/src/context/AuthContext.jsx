import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { getUserRole, isTokenExpired, decodeToken } from '../utils/jwt';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  loading: true
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const logoutTimerRef = useRef(null);

  useEffect(() => {
    initializeAuth();
    
  }, []);


  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const scheduleAutoLogout = (token) => {
    clearLogoutTimer();
    try {
      const decoded = decodeToken(token);
      const expSeconds = decoded?.exp;
      if (!expSeconds) return;

      const expiresAtMs = expSeconds * 1000;
      const nowMs = Date.now();
      const delayMs = expiresAtMs - nowMs;

      if (delayMs <= 0) {

        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
        return;
      }

      logoutTimerRef.current = setTimeout(() => {

        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      }, delayMs);
    } catch (e) {

      console.warn('Unable to schedule auto-logout:', e);
    }
  };

  const initializeAuth = () => {
    const token = localStorage.getItem('token');
    console.log('Initializing auth with token:', token);
    if (token && !isTokenExpired(token)) {
      const role = getUserRole(token);
      console.log('Initialized with role:', role);
      // Session management: schedule auto logout based on JWT exp
      scheduleAutoLogout(token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, role, user: { role } }
      });
    } else {
      console.log('No valid token found');
      localStorage.removeItem('token');
      clearLogoutTimer();
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Starting login API call...');
      const response = await authApi.login(credentials);
      console.log('API response received:', response);
      const { token } = response;
      console.log('Token received:', token);
      
      const role = getUserRole(token);
      console.log('Decoded role:', role);
      console.log('Full decoded token:', decodeToken(token));
      
      console.log('About to save token to localStorage...');
      localStorage.setItem('token', token);
      console.log('Token saved to localStorage:', localStorage.getItem('token'));


      scheduleAutoLogout(token);
      
      console.log('Dispatching LOGIN_SUCCESS...');
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, role, user: { role } }
      });
      
      console.log('Returning success result...');
      return { success: true, role };
    } catch (error) {
      console.error('Login function error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await authApi.register(userData);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    clearLogoutTimer();
    dispatch({ type: 'LOGOUT' });
  };

  
  useEffect(() => {
    return () => {
      clearLogoutTimer();
    };
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};