import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profileType, setProfileType] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    const savedProfile = localStorage.getItem("profileType");
    if (access && refresh) {
      if (savedProfile) setProfileType(savedProfile);
      fetchUser(access);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        await fetchProfileType(token);
      } else {
        const refreshed = await tryRefresh();
        if (!refreshed) {
          logout();
        }
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileType = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile_type/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProfileType(data.profile_type);
        localStorage.setItem("profileType", data.profile_type);
        return data.profile_type;
      }
    } catch {
      // ignore
    }
    return null;
  };

  const tryRefresh = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return false;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access", data.access);
        await fetchUser(data.access);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const login = useCallback(async (rut, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rut, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Error al iniciar sesion");
    }
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    setUser(data.user);
    const pt = await fetchProfileType(data.access);
    return { ...data, profile_type: pt };
  }, []);

  const register = useCallback(async (rut, password, password2) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rut, password, password2 }),
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(data.detail || "Acceso denegado debido a que no perteneces a la Universidad");
      }
      const firstError = Object.values(data).flat().join(". ");
      throw new Error(firstError || "Error al registrarse");
    }
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    setUser(data.user);
    const pt = await fetchProfileType(data.access);
    return { ...data, profile_type: pt };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("profileType");
    setUser(null);
    setProfileType(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profileType, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
