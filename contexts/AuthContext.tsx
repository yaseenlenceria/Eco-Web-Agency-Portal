import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useConvex } from 'convex/react';
import { api } from '../convex/_generated/api';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface User {
  _id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const convex = useConvex();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Check for existing session
        const token = localStorage.getItem('authToken');
        if (token) {
          const userData = await convex.query(api.auth.validateSession, { token });
          if (userData && isMounted) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem('authToken');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!isMounted) return;

      try {
        if (firebaseUser) {
          // Create or get user in Convex
          const userId = await convex.mutation(api.auth.createUser, {
            email: firebaseUser.email!,
            name: firebaseUser.displayName || undefined,
            avatar: firebaseUser.photoURL || undefined,
            googleId: firebaseUser.uid,
          });

          // Create session
          const sessionToken = generateSessionToken();
          await convex.mutation(api.auth.createSession, {
            userId,
            token: sessionToken,
          });

          localStorage.setItem('authToken', sessionToken);
          const userData = await convex.query(api.auth.getUserById, { userId });
          if (userData && isMounted) {
            setUser(userData);
            setError(null);
          }
        } else {
          setUser(null);
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setError('Authentication error occurred');
        localStorage.removeItem('authToken');
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    initializeAuth();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [convex]);

  const generateSessionToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      // Add scopes to get user info
      provider.addScope('email');
      provider.addScope('profile');
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setError(error.message || 'Failed to sign in with Google');
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
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};