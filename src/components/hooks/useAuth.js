import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, refreshToken } from '../store/slices/authSlice';
import { api } from '../lib/api';

export function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  // Initialize from localStorage or sessionStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (token) {
      api.setAuthToken(token);
      const userData = storedUser ? JSON.parse(storedUser) : null;
      dispatch(login({ accessToken: token, user: userData }));
      setupAutoLogout(token);
    }
  }, [dispatch]);

  // Setup 401 interceptor
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []); // Only runs once on mount

  // Helper to decode JWT and set auto-logout timer
  const setupAutoLogout = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      if (timeUntilExpiry > 0) {
        setTimeout(() => {
          handleLogout();
        }, timeUntilExpiry);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      handleLogout();
    }
  };

  // --- LOGIN ---
  async function handleLogin(credentials) {
    setLoading(true);
    try {
      const { email, password, rememberMe } = credentials; // Extract rememberMe
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;

      const storage = rememberMe ? localStorage : sessionStorage;

      // Clear both first to avoid duplicates/stale state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');

      storage.setItem('accessToken', accessToken);
      storage.setItem('user', JSON.stringify(user));

      api.setAuthToken(accessToken);
      dispatch(login({ accessToken, user }));
      setupAutoLogout(accessToken);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  // --- REFRESH TOKEN ---
  async function handleRefreshToken() {
    try {
      const response = await api.post('/auth/refresh-token');
      const { accessToken } = response.data;

      // Update token in whichever storage it exists
      if (localStorage.getItem('accessToken')) {
        localStorage.setItem('accessToken', accessToken);
      } else {
        sessionStorage.setItem('accessToken', accessToken);
      }

      api.setAuthToken(accessToken);
      dispatch(refreshToken({ accessToken }));
      setupAutoLogout(accessToken);
    } catch (err) {
      handleLogout();
    }
  }

  // --- LOGOUT ---
  async function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    api.setAuthToken(null);
    dispatch(logout());
  }

  return {
    isAuthenticated,
    user,
    accessToken,
    loading,
    handleLogin,
    handleRefreshToken,
    handleLogout
  };
}

