import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types/userTypes";
import client from "../../../api/axios.client";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user_data");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser._id) {
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("Error al leer sesión:", error);
        localStorage.removeItem("user_data");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // --- NUEVO: Escuchar evento de 401 ---
  useEffect(() => {
    const handleUnauthorized = () => {
      logout(); // Cierra sesión limpiamente
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);
  // -------------------------------------

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await client.post("/users/logout");
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    localStorage.removeItem("user_data");
  };

  const updateUser = (newUserData: Partial<User>) => {
    if (!user) return;
    const mergedUser = { ...user, ...newUserData };

    setUser(mergedUser);
    localStorage.setItem("user_data", JSON.stringify(mergedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;
