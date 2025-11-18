import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";

import Home from "../pages/home/Home";
import Chat from "../pages/chat/Chat";
import Maps from "../pages/map/Maps";
import Locations from "../pages/locations/Locations";
import Profile from "../pages/profile/Profile";

function AppRouter() {
  return (
    <BrowserRouter>
      <Sidebar />

      <MainContainer>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/profile" element={<Profile />} />

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
