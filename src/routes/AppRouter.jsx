import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";

import Welcome from "../pages/welcome";
import Home from "../pages/home/Home";
import Chat from "../pages/chat/Chat";
import Maps from "../pages/map/Maps";
import Locations from "../pages/locations/Locations";
import Login from '../pages/login/Login';
import Register from '../pages/register/register';

import Profile from "../pages/profile/Profile";
import Help from "../pages/profile/Help";
import Terms from "../pages/profile/Terms";
import Security from "../pages/profile/Security";
import EditProfile from "../pages/profile/EditProfile";

function AppRouter() {
  return (
    <BrowserRouter>
      <Sidebar />

      <MainContainer>
      <Routes>
        {/* Ruta pública - Landing page */}
        <Route path="/" element={<Welcome />} />
        
        {/* Rutas de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
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

      </Routes>
           </MainContainer>
    </BrowserRouter>
  );
}
const MainContainer = styled.main`
  padding: 20px;

  @media (min-width: 1024px) {
    margin-left: 240px; /* Solo en desktop */
  }
`;

export default AppRouter;
