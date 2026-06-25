import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start, check if a session cookie exists
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/check", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.authenticated) setUser(data.user);
      } catch {
        // No session
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signup = async (email, username, password) => {
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, username, password }),
    });
    const data = await res.json();
    if (data.success) setUser(data.user);
    return data;
  };

  const login = async (username, password) => {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) setUser(data.user);
    return data;
  };

  const logout = async () => {
    await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};