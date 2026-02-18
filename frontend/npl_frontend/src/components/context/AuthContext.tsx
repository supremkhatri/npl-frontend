import  { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getCSRF, getCookie } from "../csrf"; // your CSRF helper

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getCSRF();
        const res = await fetch(`${API_BASE_URL}/users/session/`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          // Only set user if username exists
          if (data.username) {
            setUser({ username: data.username });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
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

    const res = await fetch(`${API_BASE_URL}/users/login/`, {
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

    const res = await fetch(`${API_BASE_URL}/users/register/`, {
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
    await getCSRF();
    const csrfToken = getCookie("csrftoken");

    await fetch(`${API_BASE_URL}/users/logout/`, {
      method: "POST",
      credentials: "include",
      headers: {
        ...(csrfToken && { "X-CSRFToken": csrfToken }),
      },
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
