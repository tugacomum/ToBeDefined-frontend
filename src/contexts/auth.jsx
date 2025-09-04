import { createContext, useContext, useState, useEffect } from "react";

import { api } from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = localStorage.getItem("token1");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const user = await api
          .get("/api/auth/profile")
          .then((r) => r.data.data);
        setUser(user);
      } catch (err) {
        console.error("Token inválido ou expirado:", err.response?.data?.error);
        logout();
      }
    }

    setLoading(false);
  };

  const login = async (body) => {
  try {
    const response = await api.post("/api/auth/login", body);
    const { token, user } = response.data.data;
    localStorage.setItem("token", token);
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
    const res = await api.post("/api/auth/register", body);
    return res.data;
  } catch (error) {
    console.error("Register failed:", error);

    if (error.response?.data) {
      throw error.response.data;
    }
    
    throw new Error("Erro ao registar o utilizador");
  }
};


  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {loading ? <div>Carregando...</div> : children}
    </AuthContext.Provider>
  );
}
