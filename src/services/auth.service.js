import apiService from './api.service';

/**
 * Servicio de autenticación
 * Maneja login, registro, logout y gestión de tokens
 */
class AuthService {
  /**
   * Login de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise} - Respuesta del backend con token y datos del usuario
   */
  async login(email, password) {
    try {
      const response = await apiService.post('/users/login', {
        email,
        contrasena: password,   
      });

      // Guardar token y datos del usuario en localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Registro de usuario (sin foto)
   * @param {object} userData - Datos del usuario
   * @returns {Promise} - Respuesta del backend
   */
  async register(userData) {
    try {
      const response = await apiService.post('/users/register', userData);
      
      // Si el backend devuelve token automáticamente después del registro
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Registro de usuario con foto (FormData)
   * @param {FormData} formData - Datos del usuario incluyendo foto
   * @returns {Promise} - Respuesta del backend
   */
  async registerWithPhoto(formData) {
    try {
      const response = await apiService.postFormData('/users/register', formData);
      
      // Si el backend devuelve token automáticamente después del registro
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout de usuario
   * Limpia localStorage
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Obtener usuario actual desde localStorage
   * @returns {object|null} - Datos del usuario o null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Obtener token actual
   * @returns {string|null} - Token o null
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} - true si hay token
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Verificar token con el backend (opcional)
   * @returns {Promise<boolean>} - true si el token es válido
   */
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) return false;

      // Hacer una petición al backend para verificar el token
      // Ajusta el endpoint según tu backend
      await apiService.get('/users/verify');
      return true;
    } catch (error) {
      console.error('Token inválido:', error);
      this.logout();
      return false;
    }
  }
}

export default new AuthService();
