'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { clearTempToken, getOrCreateTempToken } from '../lib/temp-token';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  userData: {
    firstName?: string;
    lastName?: string;
    zipcode?: string;
    gender?: string;
    dateOfBirth?: string;
    language?: string;
  } | null;
  login: (email: string, userData?: { email: string; name: string }) => void;
  logout: () => void;
  updateUser: (data: Partial<AuthContextType['userData']>) => void;
  chatHistory: { role: 'user' | 'ai'; content: string }[];
  setChatHistory: React.Dispatch<React.SetStateAction<AuthContextType['chatHistory']>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userData, setUserData] = useState<AuthContextType['userData']>(null);
  const [chatHistory, setChatHistory] = useState<AuthContextType['chatHistory']>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async (tokenOverride?: string) => {
    if (typeof window === 'undefined') return;

    const token = tokenOverride || localStorage.getItem('alphadx_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Validate token with backend via our proxy
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUserEmail(data.user.email);
        setUserName(data.user.name);
        setUserData({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          zipcode: data.user.zipcode,
          gender: data.user.gender,
          dateOfBirth: data.user.dateOfBirth,
          language: data.user.language
        });
      } else if (!tokenOverride) {
        // Token is invalid and we weren't just given a new one, clear it
        localStorage.removeItem('alphadx_token');
        document.cookie = 'alphadx_session=; path=/; max-age=0';
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (!tokenOverride) {
        localStorage.removeItem('alphadx_token');
        document.cookie = 'alphadx_session=; path=/; max-age=0';
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load guest history if any
    if (typeof window !== 'undefined') {
      const guestHistory = localStorage.getItem('alphadx_guest_history');
      if (guestHistory) {
        try {
          setChatHistory(JSON.parse(guestHistory));
        } catch (e) {
          console.error('Failed to parse guest history', e);
        }
      }
      
      // Ensure temp token exists if user is not authenticated
      const authToken = localStorage.getItem('alphadx_token');
      if (!authToken) {
        getOrCreateTempToken();
      }
    }
    checkAuthStatus();
  }, []);

  const login = async (email: string, userDataParam?: { email: string; name: string }) => {
    // We already set the token in localStorage in the Login component
    // but we need to trigger a data fetch to get everything else
    setIsLoading(true);
    await checkAuthStatus();
  };

  const logout = async () => {
    const token = localStorage.getItem('alphadx_token');

    // Call logout API
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }

    // Clear local state
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserName(null);
    setUserData(null);
    setChatHistory([]);

    // Clear storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('alphadx_token');
      document.cookie = 'alphadx_session=; path=/; max-age=0';
      // Clear temp token on logout
      clearTempToken();
    }
  };

  const updateUser = (data: Partial<AuthContextType['userData']>) => {
    if (!data) return;
    setUserData(prev => prev ? { ...prev, ...data } : data as AuthContextType['userData']);
    if (data.firstName || data.lastName) {
      const first = data.firstName ?? userData?.firstName ?? '';
      const last = data.lastName ?? userData?.lastName ?? '';
      setUserName(`${first} ${last}`.trim());
    }
  };

  // Don't render children until we've checked localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, userName, userData, login, logout, updateUser, chatHistory, setChatHistory }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

