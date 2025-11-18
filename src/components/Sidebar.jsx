import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import iconNavbar from "../assets/images/navbar.png";

// ICONOS (puedes cambiarlos por los que quieras)
import { FiHome, FiMapPin, FiMap, FiMessageSquare, FiUser } from "react-icons/fi";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <MenuButton onClick={() => setIsOpen(true)}>☰</MenuButton>

      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <Logo src={iconNavbar} alt="Huilapp Logo" />
        </SidebarHeader>

        <Nav>
          <NavItem to="/home" active={location.pathname === "/home"}>
            <IconWrapper className="icon-web"><FiHome size={20} /></IconWrapper>
            Inicio
          </NavItem>

          <NavItem to="/locations" active={location.pathname === "/locations"}>
            <IconWrapper className="icon-web"><FiMapPin size={20} /></IconWrapper>
            Mis sitios
          </NavItem>

          <NavItem to="/maps" active={location.pathname === "/maps"}>
            <IconWrapper className="icon-web"><FiMap size={20} /></IconWrapper>
            Mapa interactivo
          </NavItem>

          <NavItem to="/chat" active={location.pathname === "/chat"}>
            <IconWrapper className="icon-web"><FiMessageSquare size={20} /></IconWrapper>
            Chat bot
          </NavItem>

          <NavItem to="/profile" active={location.pathname === "/profile"}>
            <IconWrapper className="icon-web"><FiUser size={20} /></IconWrapper>
            Perfil
          </NavItem>
        </Nav>
      </SidebarContainer>

      {isOpen && <Overlay onClick={() => setIsOpen(false)} />}
    </>
  );
}

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: #ffffff;
  width: ${({ isOpen }) => (isOpen ? "260px" : "0")};
  overflow: hidden;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.12);
  border-right: 1px solid #eaeaea;
  transition: width 0.3s ease;
  z-index: 1000;
  font-family: "Roboto", sans-serif;

  @media (min-width: 1024px) {
    width: 260px;
  }
`;

const SidebarHeader = styled.div`
  width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 140px;
  height: auto;
  object-fit: contain;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
  gap: 6px;
`;

const NavItem = styled(Link)`
  text-decoration: none;
  color: ${({ active }) => (active ? "#ffffff" : "#707070")};
  background: ${({ active }) => (active ? "#008073" : "transparent")};
  font-size: 17px;
  padding: 12px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  transition: all 0.25s ease;

  &:hover {
    background: ${({ active }) => (active ? "#008073" : "#e6f4f1")};
    color: ${({ active }) => (active ? "#ffffff" : "#008073")};
    transform: translateX(4px);
  }
    
  gap: 12px;
`;

/* Iconos visibles SOLO en pantallas grandes */
const IconWrapper = styled.span`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
  }
`;

const MenuButton = styled.button`
  position: fixed;
  top: 18px;
  left: 18px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  z-index: 1100;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  @media (min-width: 1024px) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 900;

  @media (min-width: 1024px) {
    display: none;
  }
`;
