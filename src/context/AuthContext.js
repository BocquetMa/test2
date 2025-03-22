import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour vérifier si l'utilisateur est correctement formé
  const validateUser = (user) => {
    if (!user) return false;
    // Vérifiez que l'utilisateur a un ID valide
    return user.id && typeof user.id === 'number';
  };

  useEffect(() => {
    const initAuth = () => {
      const user = AuthService.getCurrentUser();
      console.log("Loaded user from storage:", user);
      
      if (user && validateUser(user)) {
        setCurrentUser(user);
      } else {
        // Si l'utilisateur n'est pas valide, effacer le localStorage
        console.log("Invalid user data found in storage, clearing...");
        AuthService.logout();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await AuthService.login(username, password);
      console.log("Login response:", data);
      
      // Vérifiez que l'utilisateur retourné a un ID valide
      if (!validateUser(data)) {
        console.error("Received invalid user data from login:", data);
        throw new Error("Informations utilisateur incomplètes. Veuillez contacter l'administrateur.");
      }
      
      setCurrentUser(data);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out...");
    AuthService.logout();
    setCurrentUser(null);
  };

  const register = async (username, email, password) => {
    try {
      await AuthService.register(username, email, password);
      // Une fois inscrit, on connecte l'utilisateur
      return login(username, password);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser && validateUser(currentUser)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};