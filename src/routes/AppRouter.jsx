import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Chat from "../pages/chat/Chat";
import Maps from "../pages/map/Maps";
import Locations from "../pages/locations/Locations";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/locations" element={<Locations />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
