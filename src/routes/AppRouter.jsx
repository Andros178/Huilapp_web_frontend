import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "../pages/welcome";
import Home from "../pages/home/Home";
import Chat from "../pages/chat/Chat";
import Maps from "../pages/map/Maps";
import Locations from "../pages/locations/Locations";
import Login from '../pages/login/Login';
import Register from '../pages/register/register';

function AppRouter() {
  return (
    <BrowserRouter>
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

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
