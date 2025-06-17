'use client';  // Añadir esta línea al principio del archivo

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';  // Usamos useRouter de Next.js

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();  // Usamos useRouter de Next.js para navegación

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://198.211.105.95:8080/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);  // Guardamos los datos del usuario si el token es válido
        })
        .catch(() => {
          localStorage.removeItem('token');
          router.push('/auth/login');  // Redirigimos a login si el token no es válido
        });
    }
  }, [router]);

  const login = (token: string) => {
    localStorage.setItem('token', token);  // Guardamos el token en el localStorage
    axios
      .get('http://198.211.105.95:8080/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);  // Guardamos el usuario en el contexto
        router.push('/');  // Redirigimos al dashboard
      });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');  // Eliminamos el token
    router.push('/auth/login');  // Redirigimos a login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
