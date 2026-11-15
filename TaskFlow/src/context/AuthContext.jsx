import React, {
  createContext,
  useContext,
  useState
} from 'react';

import {
  registerUser,
  loginUser
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem('taskflow_user') ||
      sessionStorage.getItem('taskflow_user');

    return savedUser ? JSON.parse(savedUser) : null;

  });

  // Register
  const register = async (userData) => {

    const response = await registerUser(userData);

    return response;

  };

  // Login
  const login = async (email, password, rememberMe) => {

    const response = await loginUser(email, password);

    // Never store the password in the browser session
    const safeUser = {
      id: response.id,
      name: response.name,
      email: response.email,
      createdAt: response.createdAt
    };

    setUser(safeUser);

    const storage = rememberMe
      ? localStorage
      : sessionStorage;

    const otherStorage = rememberMe
      ? sessionStorage
      : localStorage;

    otherStorage.removeItem('taskflow_user');

    storage.setItem(
      'taskflow_user',
      JSON.stringify(safeUser)
    );

    return safeUser;

  };

  // Logout
  const logout = () => {

    setUser(null);

    localStorage.removeItem('taskflow_user');
    sessionStorage.removeItem('taskflow_user');

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        register,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

// Custom hook
export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;

};