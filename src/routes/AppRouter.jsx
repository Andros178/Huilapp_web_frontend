import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";

import Welcome from "../pages/welcome";
import Home from "../pages/home/Home";
import Chat from "../pages/chat/Chat";
import Maps from "../pages/map/Maps";
import Locations from "../pages/locations/Locations";
import Login from '../pages/login/Login';
import Register from '../pages/register/register';
import RecoverPassword from '../recoverPassword/recover-password';
import VerifyCode from '../recoverPassword/verify-code';
import ResetPassword from '../recoverPassword/reset-password';

import Profile from "../pages/profile/Profile";
import AdminSites from "../pages/admin/AdminSites";
import Users from "../pages/admin/User";
import Help from "../pages/profile/Help";
import Terms from "../pages/profile/Terms";
import Security from "../pages/profile/Security";
import EditProfile from "../pages/profile/EditProfile";

// Rutas públicas donde NO debe aparecer el sidebar ni el margen
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/verify-code', '/reset-password'];

function AppContent() {
  const location = useLocation();
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <>
      <Sidebar />
      <MainContainer isPublicRoute={isPublicRoute}>
        <Routes>
          {/* Ruta pública - Landing page */}
          <Route path="/" element={<Welcome />} />
          
          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<RecoverPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Rutas protegidas - requieren autenticación */}
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<Help />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/security" element={<Security />} />
        <Route path="/editProfile" element={<EditProfile />} />

          {/* Ruta de administrador */}
          <Route path="/admin/sites" element={<AdminSites />} />
          <Route path="/admin/users" element={<Users />} />
        </Routes>
      </MainContainer>
    </>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

const MainContainer = styled.main`
  padding: ${({ isPublicRoute }) => (isPublicRoute ? '0' : '20px')};

  @media (min-width: 1024px) {
    margin-left: ${({ isPublicRoute }) => (isPublicRoute ? '0' : '240px')}; /* Solo en desktop */
  }
`;

export default AppRouter;