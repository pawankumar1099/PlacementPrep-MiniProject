import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('ppa_token');
    if (!token) { setLoading(false); return; }
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
    } catch {
      localStorage.removeItem('ppa_token');
      localStorage.removeItem('ppa_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('ppa_token', res.data.token);
    localStorage.setItem('ppa_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const signup = async (formData) => {
    const res = await authAPI.signup(formData);
    localStorage.setItem('ppa_token', res.data.token);
    localStorage.setItem('ppa_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('ppa_token');
    localStorage.removeItem('ppa_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
