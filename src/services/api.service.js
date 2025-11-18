// Servicio genérico para hacer peticiones HTTP al backend
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.15:3000';

class ApiService {
  /**
   * Método genérico para hacer peticiones
   * @param {string} endpoint - Endpoint de la API (ej: '/users/login')
   * @param {object} options - Opciones de fetch (method, headers, body, etc.)
   */
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Si hay token almacenado, agregarlo al header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Si la respuesta no es ok, lanzar error con el mensaje del backend
      if (!response.ok) {
        const errorData = await response.json();
        // El backend puede enviar "error", "message" o "msg"
        const errorMessage = errorData.error || errorData.message || errorData.msg || 'Error en la petición';
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en petición a ${endpoint}:`, error);
      
      // Si el error ya tiene un mensaje (del backend), mantenerlo
      if (error.message && error.message !== 'Failed to fetch') {
        throw error;
      }
      
      // Si es error de red, lanzar mensaje personalizado
      throw new Error('Error de conexión. Verifica que el backend esté activo.');
    }
  }

  /**
   * Método GET
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * Método POST
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Método POST con FormData (para archivos)
   */
  async postFormData(endpoint, formData) {
    const url = `${API_URL}${endpoint}`;
    
    const config = {
      method: 'POST',
      body: formData,
    };

    // Si hay token, agregarlo
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        // El backend puede enviar "error", "message" o "msg"
        const errorMessage = errorData.error || errorData.message || errorData.msg || 'Error en la petición';
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en petición a ${endpoint}:`, error);
      
      // Si el error ya tiene un mensaje (del backend), mantenerlo
      if (error.message && error.message !== 'Failed to fetch') {
        throw error;
      }
      
      // Si es error de red, lanzar mensaje personalizado
      throw new Error('Error de conexión. Verifica que el backend esté activo.');
    }
  }

  /**
   * Método PUT
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Método DELETE
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();
