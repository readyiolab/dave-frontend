import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, refreshToken } from '../store/slices/authSlice';
import { api } from '../lib/api';

export function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (token) {
      api.setAuthToken(token);
      const userData = storedUser ? JSON.parse(storedUser) : null;
      dispatch(login({ accessToken: token, user: userData }));
    }
  }, [dispatch]);

  // --- LOGIN ---
  async function handleLogin(credentials) {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      api.setAuthToken(accessToken);
      dispatch(login({ accessToken, user }));
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
      localStorage.setItem('accessToken', accessToken);
      api.setAuthToken(accessToken);
      dispatch(refreshToken({ accessToken }));
    } catch (err) {
      handleLogout();
    }
  }

  // --- LOGOUT ---
  async function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
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

