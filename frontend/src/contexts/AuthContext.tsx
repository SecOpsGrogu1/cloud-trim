import React, { createContext, useContext, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AuthState, LoginCredentials, SignupCredentials, User } from '../types/auth';
import { loginUser, logout as logoutAction } from '../store/slices/authSlice';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:8080';

const fetchWithCredentials = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error(`API Error (${endpoint}):`, data);
    throw new Error(data.error || `API request to ${endpoint} failed`);
  }

  return data;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      console.log('Making login request to backend...');
      const data = await fetchWithCredentials('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('Login successful:', data);
      dispatch(loginUser());
      setState({
        user: data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [dispatch]);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      console.log('Making signup request to backend...');
      const data = await fetchWithCredentials('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('Signup successful:', data);
      dispatch(loginUser());
      setState({
        user: data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Signup error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await fetchWithCredentials('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    dispatch(logoutAction());
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
