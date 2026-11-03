import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { authApi, LoginPayload, RegisterPayload } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user session', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (payload: LoginPayload): Promise<User> => {
    const data = await authApi.login(payload);
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);

    const fullUser: User = {
      id: data.user_id,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      is_active: true,
    };
    setUser(fullUser);
    localStorage.setItem('user', JSON.stringify(fullUser));
    return fullUser;
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    const data = await authApi.register(payload);
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);

    const fullUser: User = {
      id: data.user_id,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      is_active: true,
    };
    setUser(fullUser);
    localStorage.setItem('user', JSON.stringify(fullUser));
    return fullUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.error('Error refreshing user', e);
    }
  };

  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

