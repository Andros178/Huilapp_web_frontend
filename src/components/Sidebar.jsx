import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import iconNavbar from "../assets/images/huilapp_imagotipo.png";
import { FiHome, FiMapPin, FiMap, FiMessageSquare, FiUser, FiPlus, FiLogOut } from "react-icons/fi";

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
  const [userName, setUserName] = useState(null);
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
    // Intentar obtener nombre de usuario para mostrar en el footer
    const nameFromPayload = payload?.nombre || payload?.name || payload?.usuario || payload?.email;
    if (nameFromPayload) {
      // Si viene un email, mostrar solo la parte antes de @
      const shortName = String(nameFromPayload).includes("@")
        ? String(nameFromPayload).split("@")[0]
        : nameFromPayload;
      setUserName(shortName);
    }
  }, [location.pathname]); // ⬅ antes estaba []

  // No renderizar el Sidebar si no está autenticado
  if (!isAuthenticated) {
    return null;
  }

  const sitesPath = isAdmin ? "/admin/panelview" : "/locations";
  const sitesLabel = isAdmin ? "Dashboard" : "Mis sitios";

  return (
    <>
      <MenuButton onClick={() => setIsOpen((s) => !s)} aria-expanded={isOpen} aria-controls="app-sidebar">
        {isOpen ? "✕" : "☰"}
      </MenuButton>

      <SidebarContainer id="app-sidebar" isOpen={isOpen}>
        <SidebarHeader>
          <Logo src={
            iconNavbar} alt="Huilapp Logo" />
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

        {/* ---------- FOOTER: usuario + CERRAR SESIÓN ---------- */}
        <NavFooter>
          <LogoutButton aria-label="Cerrar sesión" title="Cerrar sesión" onClick={() => setShowLogoutConfirm(true)}>
            <LogoutIconWrapper>
              <FiLogOut size={18} />
            </LogoutIconWrapper>
            <span>Cerrar sesión</span>
          </LogoutButton>
        </NavFooter>

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
                      await fetch("http://158.69.60.80/api/users/logout", {
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
  width: ${({ isOpen }) => (isOpen ? "85vw" : "0")};
  max-width: 320px;
  overflow: hidden;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.12);
  border-right: 1px solid #eaeaea;
  transition: width 0.26s cubic-bezier(.2,.9,.2,1);
  z-index: 1000;
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    width: 260px;
    max-width: none;
    
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
  width: 200px;
  height: auto;
  object-fit: contain;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 16px 12px 20px 12px;
  gap: 8px;
  flex: 1 1 auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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
  display: flex;
  align-items: center;
  min-width: 28px;
  justify-content: center;

  svg {
    display: block;
  }

  @media (min-width: 1024px) {
    min-width: 36px;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 12px;
  width: 100%;
  background: transparent;
  color: #b80000;
  border: 1px solid rgba(184, 0, 0, 0.12);
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  transition: all 0.22s ease;

  &:hover {
    background: rgba(184, 0, 0, 0.06);
    transform: translateX(6px);
    box-shadow: 0 4px 14px rgba(184, 0, 0, 0.07);
  }

  span {
    font-size: 16px;
    font-weight: 600;
    color: #8a0000;
  }
`;

const LogoutIconWrapper = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(184,0,0,0.06);
  color: #b80000;
`;

const NavFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px;
  margin-top: auto;
  
  @media (min-width: 1024px) {
    margin-bottom: 60px;
  }
`;

const UserName = styled.div`
  font-size: 14px;
  color: #333;
  padding: 6px 10px;
  border-radius: 8px;
  background: #f7f7f7;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
