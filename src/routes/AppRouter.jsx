// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import styled from "styled-components";

import Welcome from "../pages/welcome";
import Home from "../pages/home/Home";
import Chat from "../pages/chat/Chat";
import Maps from "../pages/map/Maps";
import Locations from "../pages/locations/Locations";
import AddSite from "../pages/sites/AddSite";
import Login from "../pages/login/Login";
import Register from "../pages/register/register";
import RecoverPassword from "../recoverPassword/recover-password";
import VerifyCode from "../recoverPassword/verify-code";
import ResetPassword from "../recoverPassword/reset-password";

import Profile from "../pages/profile/Profile";
import AdminSites from "../pages/admin/AdminSites";
import Users from "../pages/admin/User";
import SitesVal from "../pages/admin/Sitesval"
import PanelView from "../pages/admin/panelview";
import Help from "../pages/profile/Help";
import Terms from "../pages/profile/Terms";
import Security from "../pages/profile/Security";
import EditProfile from "../pages/profile/EditProfile";
import SiteDetail from "../pages/sites/SiteDetail";
import EditSite from "../pages/sites/EditSite";

// Rutas públicas donde NO debe aparecer el sidebar ni el margen
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/verify-code",
  "/reset-password",
];

function AppContent() {
  const location = useLocation();
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <>
      {!isPublicRoute && <Sidebar />}
      <MainContainer isPublicRoute={isPublicRoute}>
        <Routes>
          {/* Ruta pública - Landing page */}
          <Route path="/" element={<Welcome />} />

          {/* Rutas de autenticación */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <RecoverPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-code"
            element={
              <PublicRoute>
                <VerifyCode />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maps"
            element={
              <ProtectedRoute>
                <Maps />
              </ProtectedRoute>
            }
          />
          <Route
            path="/locations"
            element={
              <ProtectedRoute>
                <Locations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <ProtectedRoute>
                <Terms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/security"
            element={
              <ProtectedRoute>
                <Security />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editProfile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Sitios - detalle y edición */}
          <Route
            path="/sites/:id"
            element={
              <ProtectedRoute>
                <SiteDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sites/:id/edit"
            element={
              <ProtectedRoute>
                <EditSite />
              </ProtectedRoute>
            }
          />

          {/* Rutas de administrador */}
          <Route
            path="/admin/sites"
            element={
              <ProtectedRoute>
                <AdminSites />
              </ProtectedRoute>
            }
          />
          {/* pendientes */}
          <Route
            path="/admin/Sitesval"
            element={
              <ProtectedRoute>
                <SitesVal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/PanelView"
            element={
              <ProtectedRoute>
                <PanelView/>
              </ProtectedRoute>
            }
          />

          {/* Crear sitio */}
          <Route
            path="/sites/add"
            element={
              <ProtectedRoute>
                <AddSite />
              </ProtectedRoute>
            }
          />
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
  padding: ${({ isPublicRoute }) => (isPublicRoute ? "0" : "20px")};

  @media (min-width: 1024px) {
    margin-left: ${({ isPublicRoute }) =>
      isPublicRoute ? "0" : "240px"}; /* Solo en desktop */
  }
`;

export default AppRouter;
