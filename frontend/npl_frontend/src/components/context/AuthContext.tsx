import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getCSRF, getCookie } from "../csrf"; // your helper

interface AuthContextType {
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Optional: check session on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getCSRF();
        const res = await fetch("http://127.0.0.1:8000/users/session/", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser({ username: data.username });
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    await getCSRF();
    const csrfToken = getCookie("csrftoken");
    const res = await fetch("http://127.0.0.1:8000/users/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken && { "X-CSRFToken": csrfToken }),
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setUser({ username });
    } else {
      const data = await res.json();
      throw new Error(data.error || "Login failed");
    }
  };

  const register = async (username: string, password: string) => {
    await getCSRF();
    const csrfToken = getCookie("csrftoken");
    const res = await fetch("http://127.0.0.1:8000/users/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken && { "X-CSRFToken": csrfToken }),
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Registration failed");
    }
  };

  const logout = async () => {
    await fetch("http://127.0.0.1:8000/users/logout/", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
