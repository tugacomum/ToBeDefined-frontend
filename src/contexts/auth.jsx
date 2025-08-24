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
    const token = localStorage.getItem("11token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const user = await api.get("/api/auth/profile").then((r) => r.data.data);
      setUser(user);
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
      throw new Error("Credenciais incorretas");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
