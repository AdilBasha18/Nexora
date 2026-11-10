import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('nexora_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nexora_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const profile = await api.getMe();
          setUser(profile);
          localStorage.setItem('nexora_user', JSON.stringify(profile));
        } catch (err) {
          console.error("Failed to load user profile:", err);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('nexora_token', res.token);
    localStorage.setItem('nexora_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const registerCandidate = async (formData) => {
    const res = await api.registerCandidate(formData);
    localStorage.setItem('nexora_token', res.token);
    localStorage.setItem('nexora_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const registerRecruiter = async (formData) => {
    const res = await api.registerRecruiter(formData);
    localStorage.setItem('nexora_token', res.token);
    localStorage.setItem('nexora_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    try {
      if (token) await api.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('nexora_token');
    localStorage.removeItem('nexora_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await api.getMe();
      setUser(profile);
      localStorage.setItem('nexora_user', JSON.stringify(profile));
      return profile;
    } catch (e) {
      console.error(e);
    }
  };

  const value = {
    token,
    user,
    loading,
    login,
    registerCandidate,
    registerRecruiter,
    logout,
    refreshUser,
    isAuthenticated: !!token && !!user,
    isCandidate: user?.role === 'CANDIDATE',
    isRecruiter: user?.role === 'RECRUITER',
    isAdmin: user?.role === 'ADMIN' || user?.is_superuser === true
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

