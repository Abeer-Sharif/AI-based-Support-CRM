import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "supportdesk.session";

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");

    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

function getStoredSession() {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    if (!parsed?.token) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    const payload = decodeJwtPayload(parsed.token);

    if (payload?.exp && payload.exp * 1000 <= Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    return {
      ...parsed,
      role: parsed.role || payload?.role || "agent",
      team: parsed.team || payload?.team || "General",
      userId: parsed.userId || payload?.userId || null
    };
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession);

  const login = ({ token, email }) => {
    const payload = decodeJwtPayload(token);

    const nextSession = {
      token,
      email,
      userId: payload?.userId || null,
      role: payload?.role || "agent",
      team: payload?.team || "General"
    };

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify(nextSession)
    );

    setSession(nextSession);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      login,
      logout,
      isAuthenticated: Boolean(session?.token),
      isAdmin: session?.role === "admin"
    }),
    [session]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
