import { createContext, useContext, useState, useEffect } from 'react';
import {api} from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setUser({ name: 'João', email: 'joao@example.com' });
    }

    setLoading(false);
  }, []);

  const login = (body) => {
    api.post('/api/auth/login', body)
      .then(response => {
        const { token } = response.data.data;
        localStorage.setItem('token', token);
        setUser({ name: 'João', email: 'joao@example.com' });
      })
      .catch(error => {
        console.error('Login failed:', error);
        throw error;
      });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
