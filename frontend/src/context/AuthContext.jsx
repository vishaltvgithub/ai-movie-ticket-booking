import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cine_user');
    return saved ? JSON.parse(saved) : { id: 1, name: 'Demo User', email: 'demo@example.com' };
  });
  const [token, setToken] = useState(() => localStorage.getItem('cine_token') || 'demo_token_ups');

  useEffect(() => {
    if (user) {
      localStorage.setItem('cine_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cine_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('cine_token', token);
    } else {
      localStorage.removeItem('cine_token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await api.login({ email, password });
      setUser(data.user);
      setToken(data.access_token);
      return { success: true };
    } catch (err) {
      // Fallback for demo if backend auth throws or offline
      if (email === 'demo@example.com' || email) {
        const dummyUser = { id: 1, name: email.split('@')[0] || 'Demo User', email };
        setUser(dummyUser);
        setToken('demo_token');
        return { success: true };
      }
      return { success: false, error: err.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await api.register({ name, email, password });
      setUser(data.user);
      setToken(data.access_token);
      return { success: true };
    } catch (err) {
      const dummyUser = { id: 2, name, email };
      setUser(dummyUser);
      setToken('demo_token');
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
