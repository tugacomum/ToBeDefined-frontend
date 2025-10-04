import { createContext, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import { api } from "../services/api";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCsrfToken = async () => {
    const res = await api.get("/api/auth/csrf-token", { withCredentials: true });
    return res.data.csrfToken;
  };

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const user = await api.get("/api/auth/profile", { withCredentials: true }).then((r) => r.data.data);
      setUser(user);
    } catch (err) {
      setUser(null);
      console.error("Sessão inválida ou expirada:", err.response?.data?.error);
    }
    setLoading(false);
  };

  const login = async (body) => {
    try {
      const response = await api.post("/api/auth/login", body, { withCredentials: true });
      const { user } = response.data.data;
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Credenciais incorretas");
    }
  };


  const register = async (body) => {
    try {
      const res = await api.post("/api/auth/register", body, { withCredentials: true });
      return res.data;
    } catch (error) {
      console.error("Register failed:", error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error("Erro ao registar o utilizador");
    }
  };


  const logout = async () => {
    const csrfToken = await getCsrfToken();
    await api.post("/api/auth/logout", {}, { headers: { "X-CSRF-Token": csrfToken }, withCredentials: true });
    setUser(null);
    alert("Sessão terminada com sucesso.");
    return <Navigate to="/login" />;
  };

  useEffect(() => {
    let timer;
    const scheduleRefresh = () => {
      timer = setTimeout(async () => {
        try {
          const csrfToken = await getCsrfToken();
          const res = await api.post("/api/auth/refresh", {}, { headers: { "X-CSRF-Token": csrfToken }, withCredentials: true });
          if (res.data?.reason === "token_reuse") {
            setUser(null);
            alert("A sua sessão foi terminada por motivos de segurança. Inicie sessão novamente.");
            return <Navigate to="/login" />;
          }
          scheduleRefresh(); // Reagendar
        } catch (err) {
          setUser(null);
          alert("A sua sessão expirou. Inicie sessão novamente.");
          return <Navigate to="/login" />;
        }
      }, 10 * 60 * 1000); // 10 minutos (antes do access token expirar)
    };
    if (user) scheduleRefresh();
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {loading ? <div>Carregando...</div> : children}
    </AuthContext.Provider>
  );
}
