import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types/index";
import client from "../api/axios.client";

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

  // Cargar usuario al iniciar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user_data");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Validación mínima para asegurar que no es basura
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

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Intentamos avisar al backend, pero limpiamos localmente pase lo que pase
      await client.post("/users/logout");
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    localStorage.removeItem("user_data");
  };

  // 🛠️ FUNCIÓN DE ACTUALIZACIÓN BLINDADA (MERGE)
  const updateUser = (newUserData: Partial<User>) => {
    if (!user) return; // No hacemos nada si no hay sesión

    // Creamos el nuevo objeto mezclando lo viejo con lo nuevo
    const mergedUser = { ...user, ...newUserData };

    console.log("Actualizando estado de usuario:", mergedUser); // Debug

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
