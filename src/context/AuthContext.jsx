import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import apiService from '../services/api.service';

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

  /**
   * Actualizar datos del perfil del usuario
   * @param {string|number} id - id del usuario
   * @param {object} data - campos a actualizar
   */
  const updateProfile = async (id, data) => {
    try {
      // El backend espera también el campo `usuario` (nombre de usuario). Si no viene en `data`, tomarlo del user actual.
      const payload = { ...data };
      if ((!payload.usuario || payload.usuario === '') && user && user.usuario) {
        payload.usuario = user.usuario;
      }

      await apiService.put(`/users/${id}`, payload);

      // Actualizar user en contexto y en localStorage
      setUser((prev) => {
        const updated = { ...(prev || {}), ...payload };
        try {
          localStorage.setItem('user', JSON.stringify(updated));
        } catch (e) {
          console.error('No se pudo guardar user en localStorage', e);
        }
        return updated;
      });

      return { success: true };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  };

  /**
   * Refrescar los datos del usuario obteniéndolos del backend
   */
  const refreshUser = async () => {
    try {
      if (!user || !user.id) return null;
      const users = await apiService.get('/users');
      if (Array.isArray(users)) {
        const updated = users.find((u) => String(u.id) === String(user.id));
        if (updated) {
          setUser(updated);
          try {
            localStorage.setItem('user', JSON.stringify(updated));
          } catch (e) {
            console.error('No se pudo guardar user en localStorage', e);
          }
          return updated;
        }
      }
      return null;
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
      return null;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    registerWithPhoto,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
