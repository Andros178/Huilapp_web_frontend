// src/pages/admin/Users.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const PRIMARY = "#008073";
const API_BASE = "https://huilapp-backend.onrender.com";

// ======================
// Helpers
// ======================
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
    console.error("Error al parsear JWT:", e);
    return null;
  }
};

// ======================
// Styled
// ======================
const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background: #f3f4f6;
  font-family: "Inter", sans-serif;
`;

const Shell = styled.div`
  width: 100%;
  max-width: 1100px;
`;

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const TabsRow = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 40px;
  justify-content: center;
`;

const Tab = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  padding-bottom: 6px;
  color: ${({ active }) => (active ? "#111827" : "#6b7280")};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: ${({ active }) => (active ? "100%" : "0")};
    height: 2px;
    background: ${PRIMARY};
    border-radius: 999px;
    transition: width 0.15s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const SectionTitle = styled.h2`
  margin-top: 4px;
  font-size: 22px;
  font-weight: 700;
  color: ${PRIMARY};
`;

const Toolbar = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  padding: 0 8px;
`;

const SearchWrapper = styled.div`
  width: 100%;
  max-width: 520px;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
  overflow: hidden;
`;

const SearchInner = styled.div`
  position: relative;
  height: 44px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  height: 44px;
  width: 100%;
  padding: 0 40px 0 10px;
  font-size: 13px;
`;

const SearchIcon = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #9ca3af;
`;

const UsersGridWrapper = styled.div`
  margin-top: 24px;
  padding-bottom: 24px;
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 80px;
  gap: 12px;
  background: #ffffff;
  padding: 14px;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 999px;
  background-size: cover;
  background-position: center;
  background-image: ${({ src }) =>
    src
      ? `url(${src})`
      : "linear-gradient(135deg,#22c55e,#0ea5e9)"};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
`;

const UserName = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const UserMeta = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
  background: ${({ $isAdmin }) =>
    $isAdmin ? "#fef3c7" : "#e5f3ff"};
  color: ${({ $isAdmin }) => ($isAdmin ? "#92400e" : "#1d4ed8")};
  margin-top: 3px;
`;

const UserActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  align-items: flex-end;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 11px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${({ variant }) =>
    variant === "edit" ? "#e0f2fe" : "#fee2e2"};
  color: ${({ variant }) =>
    variant === "edit" ? "#0369a1" : "#b91c1c"};

  &:hover {
    filter: brightness(0.96);
  }
`;

const MessageBox = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
`;

/* ===== MODAL EDICIÓN ===== */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 22px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalLabel = styled.label`
  font-size: 12px;
  color: #4b5563;
`;

const ModalInput = styled.input`
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: ${PRIMARY};
    box-shadow: 0 0 0 1px ${PRIMARY}20;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

const ModalButton = styled.button`
  border-radius: 999px;
  border: none;
  padding: 7px 14px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  ${({ variant }) =>
    variant === "primary"
      ? `
    background: ${PRIMARY};
    color: #ffffff;
  `
      : `
    background: #f3f4f6;
    color: #374151;
  `}
`;

// ======================
// Componente principal
// ======================
const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Usuarios");

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellidos: "",
    usuario: "",
    email: "",
    telefono: "",
  });
  const [saving, setSaving] = useState(false);

  const TABS = ["Todos los sitios", "Usuarios"];

  async function loadUsers() {
    try {
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token. Inicia sesión como administrador.");
        setUsers([]);
        return;
      }

      const payload = parseJwt(token);
      const isAdmin =
        payload && payload.rol && payload.rol.toLowerCase() === "administrador";

      if (!isAdmin) {
        setError("No tienes permisos de administrador.");
        setUsers([]);
        return;
      }

      const res = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error cargando usuarios");

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios.");
      setUsers([]);
    }
  }

  useEffect(() => {
    if (activeTab === "Todos los sitios") {
      navigate("/admin/sites");
      return;
    }
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const name = `${u.nombre || ""} ${u.apellidos || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    const usuario = (u.usuario || "").toLowerCase();
    return (
      name.includes(term) || email.includes(term) || usuario.includes(term)
    );
  });

  // ======================
  // Editar usuario
  // ======================
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      nombre: user.nombre || "",
      apellidos: user.apellidos || "",
      usuario: user.usuario || "",
      email: user.email || "",
      telefono: user.telefono || "",
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setSaving(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al actualizar usuario");
      }

      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? { ...u, ...editForm } : u
      );
      setUsers(updatedUsers);
      closeEditModal();
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      alert(err.message || "No se pudo actualizar el usuario");
      setSaving(false);
    }
  };

  // ======================
  // Eliminar usuario
  // ======================
  const handleDeleteUser = async (user) => {
    const ok = window.confirm(
      `¿Seguro que deseas eliminar al usuario "${user.usuario}"? Esta acción no se puede deshacer.`
    );
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al eliminar usuario");
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      alert(err.message || "No se pudo eliminar el usuario");
    }
  };

  return (
    <Page>
      <Shell>
        <HeaderWrapper>
          <TabsRow>
            {TABS.map((t) => (
              <Tab
                key={t}
                active={activeTab === t}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </Tab>
            ))}
          </TabsRow>
          <SectionTitle>Usuarios (Administrador)</SectionTitle>
        </HeaderWrapper>

        <Toolbar>
          <SearchWrapper>
            <SearchInner>
              <SearchInput
                placeholder="Buscar por nombre, usuario o email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SearchIcon>🔍</SearchIcon>
            </SearchInner>
          </SearchWrapper>
        </Toolbar>

        {error && <MessageBox>{error}</MessageBox>}

        <UsersGridWrapper>
          <UsersGrid>
            {filteredUsers.map((u) => {
              const isAdmin =
                u.rol && u.rol.toLowerCase() === "administrador";

              return (
                <UserCard key={u.id}>
                  <Avatar src={u.profile_picture} />
                  <UserInfo>
                    <UserName>
                      {u.nombre} {u.apellidos}
                    </UserName>
                    <UserMeta>@{u.usuario}</UserMeta>
                    <UserMeta>{u.email}</UserMeta>
                    <UserMeta>📞 {u.telefono}</UserMeta>
                    {u.rol && (
                      <RoleBadge $isAdmin={isAdmin}>
                        {isAdmin ? "Administrador" : u.rol}
                      </RoleBadge>
                    )}
                  </UserInfo>
                  <UserActions>
                    <ActionButton
                      variant="edit"
                      type="button"
                      onClick={() => openEditModal(u)}
                    >
                      ✎ Editar
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      type="button"
                      onClick={() => handleDeleteUser(u)}
                    >
                      🗑 Eliminar
                    </ActionButton>
                  </UserActions>
                </UserCard>
              );
            })}
          </UsersGrid>
        </UsersGridWrapper>
      </Shell>

      {editingUser && (
        <ModalOverlay onClick={closeEditModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              Editar usuario: {editingUser.usuario}
            </ModalTitle>
            <ModalForm onSubmit={handleSaveEdit}>
              <div>
                <ModalLabel>Nombre</ModalLabel>
                <ModalInput
                  name="nombre"
                  value={editForm.nombre}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div>
                <ModalLabel>Apellidos</ModalLabel>
                <ModalInput
                  name="apellidos"
                  value={editForm.apellidos}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div>
                <ModalLabel>Usuario</ModalLabel>
                <ModalInput
                  name="usuario"
                  value={editForm.usuario}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div>
                <ModalLabel>Email</ModalLabel>
                <ModalInput
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div>
                <ModalLabel>Teléfono</ModalLabel>
                <ModalInput
                  name="telefono"
                  value={editForm.telefono}
                  onChange={handleEditChange}
                />
              </div>

              <ModalActions>
                <ModalButton
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                >
                  Cancelar
                </ModalButton>
                <ModalButton
                  variant="primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar"}
                </ModalButton>
              </ModalActions>
            </ModalForm>
          </ModalContent>
        </ModalOverlay>
      )}
    </Page>
  );
};

export default Users;
