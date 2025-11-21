import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import iconNavbar from "../assets/images/navbar.PNG";
import { FiHome, FiMapPin, FiMap, FiMessageSquare, FiUser, FiPlus } from "react-icons/fi";
import logoutIcon from "../assets/images/Vector.png";

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error al parsear JWT en Sidebar:", e);
    return null;
  }
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

  // 🔄 Se ejecuta cada vez que cambia la ruta
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAdmin(false);
      setIsAuthenticated(false);
      return;
    }

    const payload = parseJwt(token);
    if (!payload) {
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
    const admin =
      payload && payload.rol && payload.rol.toLowerCase() === "administrador";
    setIsAdmin(Boolean(admin));
  }, [location.pathname]); // ⬅ antes estaba []

  // No renderizar el Sidebar si no está autenticado
  if (!isAuthenticated) {
    return null;
  }

  const sitesPath = isAdmin ? "/admin/sites" : "/locations";
  const sitesLabel = isAdmin ? "Sitios (admin)" : "Mis sitios";

  return (
    <>
      <MenuButton onClick={() => setIsOpen(true)}>☰</MenuButton>

      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <Logo src={iconNavbar} alt="Huilapp Logo" />
        </SidebarHeader>

        <Nav>
          <NavItem to="/home" active={location.pathname === "/home"}>
            <IconWrapper>
              <FiHome size={20} />
            </IconWrapper>
            Inicio
          </NavItem>

          <NavItem to={sitesPath} active={location.pathname === sitesPath}>
            <IconWrapper>
              <FiMapPin size={20} />
            </IconWrapper>
            {sitesLabel}
          </NavItem>

          <NavItem to="/maps" active={location.pathname === "/maps"}>
            <IconWrapper>
              <FiMap size={20} />
            </IconWrapper>
            Mapa interactivo
          </NavItem>

          <NavItem to="/chat" active={location.pathname === "/chat"}>
            <IconWrapper>
              <FiMessageSquare size={20} />
            </IconWrapper>
            Chat bot
          </NavItem>

          <NavItem to="/profile" active={location.pathname === "/profile"}>
            <IconWrapper>
              <FiUser size={20} />
            </IconWrapper>
            Perfil
          </NavItem>
        </Nav>

        {/* ---------- BOTÓN DE CERRAR SESIÓN ---------- */}
        <LogoutButton onClick={() => setShowLogoutConfirm(true)}>
          <LogoutIcon src={logoutIcon} alt="Cerrar sesión" />
          <span>Cerrar sesión</span>
        </LogoutButton>

        {showLogoutConfirm && (
          <ConfirmModalOverlay onClick={() => setShowLogoutConfirm(false)}>
            <ConfirmModal onClick={(e) => e.stopPropagation()}>
              <ModalTitle>¿Cerrar sesión?</ModalTitle>
              <ModalText>¿Estás seguro que deseas cerrar la sesión?</ModalText>
              <ModalButtons>
                <ModalCancel onClick={() => setShowLogoutConfirm(false)}>Cancelar</ModalCancel>
                <ModalConfirm
                  onClick={async () => {
                    try {
                      await fetch("https://huilapp-backend.onrender.com/users/logout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                      });
                    } catch (e) {
                      console.error("Error en logout:", e);
                    }

                    localStorage.removeItem("token");
                    setIsOpen(false);
                    setShowLogoutConfirm(false);
                    window.location.href = "/login";
                  }}
                >
                  Confirmar
                </ModalConfirm>
              </ModalButtons>
            </ConfirmModal>
          </ConfirmModalOverlay>
        )}
      </SidebarContainer>

      {isOpen && <Overlay onClick={() => setIsOpen(false)} />}
    </>
  );
}

/* ======================================================= */
/* ================== ESTILOS COMPLETOS =================== */
/* ======================================================= */

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
  gap: 12px;

  &:hover {
    background: ${({ active }) => (active ? "#008073" : "#e6f4f1")};
    color: ${({ active }) => (active ? "#ffffff" : "#008073")};
    transform: translateX(4px);
  }
`;

const IconWrapper = styled.span`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
  }
`;

const LogoutButton = styled.button`
  margin-top: 20px;
  margin-left: 12px;
  margin-right: 12px;
  padding: 12px 16px;
  width: calc(100% - 24px);
  background: #ffe9e9;
  color: #b80000;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
  transition: 0.25s ease;

  &:hover {
    background: #ffcccc;
    transform: translateX(4px);
  }

  span {
    font-size: 18px;
  }
`;

const LogoutIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
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

/* ------------------ Modal confirm logout ------------------ */
const ConfirmModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConfirmModal = styled.div`
  width: 92%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
`;

const ModalTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
`;

const ModalText = styled.p`
  margin: 0 0 18px 0;
  color: #444;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalConfirm = styled.button`
  background: #d32f2f;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
`;

const ModalCancel = styled.button`
  background: transparent;
  color: #444;
  border: 1px solid #ddd;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
`;
