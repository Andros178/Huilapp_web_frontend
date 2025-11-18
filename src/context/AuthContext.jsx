import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * Provider de autenticación
 * Maneja el estado global de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay sesión al cargar la app
  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken();
      const currentUser = authService.getCurrentUser();

      if (token && currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   */
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  /**
   * Registro de usuario sin foto
   * @param {object} userData - Datos del usuario
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      // Si el backend hace login automático después del registro
      if (response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      
      return response;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  /**
   * Registro de usuario con foto
   * @param {FormData} formData - Datos del usuario con foto
   */
  const registerWithPhoto = async (formData) => {
    try {
      const response = await authService.registerWithPhoto(formData);
      
      // Si el backend hace login automático después del registro
      if (response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      
      return response;
    } catch (error) {
      console.error('Error en registro con foto:', error);
      throw error;
    }
  };

  /**
   * Logout de usuario
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    registerWithPhoto,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
