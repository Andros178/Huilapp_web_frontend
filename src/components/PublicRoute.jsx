import { Navigate } from 'react-router-dom';

/**
 * Componente para rutas públicas (login, register, etc.)
 * Redirige a /home si el usuario ya está autenticado
 */
export default function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
}
