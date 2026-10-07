import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { request } from '../utils/api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // Restore the session on first load
  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (!saved) return;
    request('/auth/me', { token: saved })
      .then((d) => setUser(d.user))
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  const startSession = (data) => {
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email, password) =>
    startSession(await request('/auth/login', { method: 'POST', body: { email, password } }));

  const signup = async (name, email, password) =>
    startSession(await request('/auth/signup', { method: 'POST', body: { name, email, password } }));

  // Authenticated request helper; logs out if the token is rejected
  const call = useCallback(
    async (path, options = {}) => {
      try {
        return await request(path, { ...options, token });
      } catch (err) {
        if (err.status === 401) logout();
        throw err;
      }
    },
    [token, logout]
  );

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, call }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading, call, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
