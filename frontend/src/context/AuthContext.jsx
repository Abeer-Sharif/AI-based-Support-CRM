import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const SESSION_KEY = 'supportdesk.session';

const getStoredSession = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession);

  const login = ({ token, email }) => {
    const nextSession = { token, email };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  const value = useMemo(() => ({ session, login, logout, isAuthenticated: Boolean(session?.token) }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
