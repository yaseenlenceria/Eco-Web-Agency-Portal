import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useConvex } from 'convex/react';
import { api } from '../convex/_generated/api';

interface User {
  _id: string;
  email: string;
  name?: string;
  role?: string;
}

interface EmailAuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const EmailAuthContext = createContext<EmailAuthContextType | undefined>(undefined);

export const EmailAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const convex = useConvex();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('authToken');
    if (token) {
      validateSession(token);
    } else {
      setLoading(false);
    }
  }, [convex]);

  const validateSession = async (token: string) => {
    try {
      const userData = await convex.query(api.auth.validateSession, { token });
      if (userData) {
        setUser(userData);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Error validating session:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const generateSessionToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setError(null);
      setLoading(true);

      const userId = await convex.mutation(api.auth.registerUser, {
        email,
        password,
        name,
      });

      // Create session
      const sessionToken = generateSessionToken();
      await convex.mutation(api.auth.createSession, {
        userId,
        token: sessionToken,
      });

      localStorage.setItem('authToken', sessionToken);
      const userData = await convex.query(api.auth.getUserById, { userId });
      setUser(userData);
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const userId = await convex.mutation(api.auth.loginUser, {
        email,
        password,
      });

      // Create session
      const sessionToken = generateSessionToken();
      await convex.mutation(api.auth.createSession, {
        userId,
        token: sessionToken,
      });

      localStorage.setItem('authToken', sessionToken);
      const userData = await convex.query(api.auth.getUserById, { userId });
      setUser(userData);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await convex.mutation(api.auth.logout, { token });
      }
      setUser(null);
      localStorage.removeItem('authToken');
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message || 'Logout failed');
    }
  };

  const value: EmailAuthContextType = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <EmailAuthContext.Provider value={value}>
      {children}
    </EmailAuthContext.Provider>
  );
};

export const useEmailAuth = () => {
  const context = useContext(EmailAuthContext);
  if (context === undefined) {
    throw new Error('useEmailAuth must be used within an EmailAuthProvider');
  }
  return context;
};