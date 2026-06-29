import { createContext, useEffect, useState, useCallback } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync user on mount
    const stored = authService.getCurrentUser();
    setUser(stored);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const auth = await authService.login(email, password);
      setUser(auth.user);
      return auth;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const auth = await authService.signup(name, email, password);
      setUser(auth.user);
      return auth;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isAuthenticated = Boolean(user && localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
