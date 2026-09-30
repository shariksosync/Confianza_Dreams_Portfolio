"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const KEY = "confianza:admin:v1";
const CREDENTIALS = { username: "admin", password: "admin123" };

const AuthContext = createContext(null);

/** Frontend-only admin session, persisted in LocalStorage. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const login = useCallback((username, password) => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      const session = { username, at: new Date().toISOString() };
      window.localStorage.setItem(KEY, JSON.stringify(session));
      setUser(session);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
