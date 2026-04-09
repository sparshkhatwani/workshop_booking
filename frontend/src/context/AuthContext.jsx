import { createContext, useContext, useState, useEffect } from 'react';
import { fetchMe, fetchCsrf, login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch CSRF token first, then check if user is already logged in
    fetchCsrf()
      .catch(() => {})
      .finally(() => {
        fetchMe()
          .then((data) => setUser(data))
          .catch(() => setUser(null))
          .finally(() => setLoading(false));
      });
  }, []);

  const login = async (username, password) => {
    await fetchCsrf();
    const data = await apiLogin(username, password);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const register = async (userData) => {
    await fetchCsrf();
    const data = await apiRegister(userData);
    setUser(data.user);
    return data;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isInstructor: user?.is_instructor ?? false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
