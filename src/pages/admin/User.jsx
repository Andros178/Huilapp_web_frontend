// src/pages/admin/Users.jsx 
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/api.service";

const PRIMARY = "#008073";

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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "avatar info"
    "buttons buttons";
  gap: 10px;

  background: ${({ $isAdmin }) => ($isAdmin ? "#FFF4E5" : "#ffffff")};
  border: ${({ $isAdmin }) =>
    $isAdmin ? "1px solid #FCD9B6" : "1px solid #E5E7EB"};
  padding: 14px 16px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
`;

const Avatar = styled.div`
  grid-area: avatar;
  width: 50px;
  height: 50px;
  border-radius: 999px;
  background-size: cover;
  background-position: center;
  background-image: ${({ src }) =>
    src ? `url(${src})` : "linear-gradient(135deg,#22c55e,#0ea5e9)"};
`;

const UserInfo = styled.div`
  grid-area: info;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;

const AdminTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  background: #f97316;
  color: #fff;
  border-radius: 999px;
  align-self: flex-start;
  margin-bottom: 2px;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const UserMeta = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const UserActions = styled.div`
  grid-area: buttons;
  display: flex;
  gap: 6px;
  margin-top: 6px;
`;

const ActionButton = styled.button`
  flex: 1;
  border: none;
  border-radius: 12px;
  padding: 6px 0;
  font-size: 11px;
  cursor: pointer;
  font-weight: 500;

  background: ${({ variant }) =>
    variant === "edit" ? "#E5F3FF" : "#FEE2E2"};
  color: ${({ variant }) =>
    variant === "edit" ? "#0369A1" : "#B91C1C"};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    filter: brightness(0.95);
  }
`;

const MessageBox = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
`;

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
  padding: 36px 40px;
  width: 100%;
  max-width: 820px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
`;

const ModalLayout = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 40% 60%;
  gap: 22px;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const ModalProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  height: 100%;
`;

const ModalAvatar = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 999px;
  background-size: cover;
  background-position: center;
  background-image: ${({ src }) =>
    src ? `url(${src})` : "linear-gradient(135deg,#22c55e,#0ea5e9)"};
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.15);
`;

const ModalProfileName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  text-align: center;
`;

const ModalProfileMeta = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-align: center;
`;

const ModalRoleChip = styled.span`
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 999px;
  background: ${({ $isAdmin }) =>
    $isAdmin ? "#FEF3C7" : "#E5F3FF"};
  color: ${({ $isAdmin }) =>
    $isAdmin ? "#92400E" : "#1D4ED8"};
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const ModalLabel = styled.label`
  font-size: 12px;
  color: #4b5563;
`;

const ModalInput = styled.input`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: ${PRIMARY};
    box-shadow: 0 0 0 1px ${PRIMARY}20;
  }

  &:read-only {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
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
      ? `background: ${PRIMARY}; color: #ffffff;`
      : `background: #f3f4f6; color: #374151;`}
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
  const [pendingCount, setPendingCount] = useState(0);

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellidos: "",
    usuario: "",
    email: "",
    telefono: "",
  });
  const [saving, setSaving] = useState(false);

  // 👇 añadimos Dashboard al inicio
  const TABS = ["Dashboard", "Todos los sitios", "Pendientes", "Usuarios"];

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

      const data = await apiService.get("/users");
      const list = Array.isArray(data)
        ? data
        : data.users || data.data || [];

      setUsers(list);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios.");
      setUsers([]);
    }
  }

  async function loadPendingCount() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPendingCount(0);
        return;
      }

      const payload = parseJwt(token);
      const isAdmin =
        payload && payload.rol && payload.rol.toLowerCase() === "administrador";

      if (!isAdmin) {
        setPendingCount(0);
        return;
      }

      const res = await apiService.get("/sites/pendientes");
      const data = res.data || res;

      let list = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data.data)) list = data.data;
      else if (Array.isArray(data.sites)) list = data.sites;

      const onlyPending = list.filter((s) => s.state === "Pendiente");
      setPendingCount(onlyPending.length);
    } catch (err) {
      console.error("Error cargando pendientes:", err);
      setPendingCount(0);
    }
  }

  useEffect(() => {
    // 👇 nueva ruta de Dashboard
    if (activeTab === "Dashboard") {
      navigate("/admin/panelview");
      return;
    }

    if (activeTab === "Todos los sitios") {
      navigate("/admin/sites");
      return;
    }

    if (activeTab === "Pendientes") {
      navigate("/admin/Sitesval");
      return;
    }

    // Usuarios
    loadUsers();
    loadPendingCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    loadPendingCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const name = `${u.nombre || ""} ${u.apellidos || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    const usuario = (u.usuario || "").toLowerCase();
    return (
      name.includes(term) || email.includes(term) || usuario.includes(term)
    );
  });

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

    const { nombre, apellidos, usuario, email, telefono } = editForm;

    if (
      !nombre.trim() ||
      !apellidos.trim() ||
      !usuario.trim() ||
      !email.trim() ||
      !telefono.trim()
    ) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const tel = telefono.trim();

    if (!/^[0-9]{10}$/.test(tel)) {
      alert("El teléfono debe tener exactamente 10 dígitos numéricos.");
      return;
    }

    try {
      setSaving(true);

      await apiService.put(`/users/${editingUser.id}`, {
        ...editForm,
        telefono: tel,
        email: editingUser.email,
      });

      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? { ...u, ...editForm, telefono: tel } : u
      );
      setUsers(updatedUsers);
      closeEditModal();
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      alert(err.message || "No se pudo actualizar el usuario");
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user) => {
    const ok = window.confirm(
      `¿Seguro que deseas eliminar al usuario "${user.usuario}"? Esta acción no se puede deshacer.`
    );
    if (!ok) return;

    try {
      await apiService.delete(`/users/${user.id}`);
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
                {t === "Pendientes"
                  ? pendingCount > 0
                    ? `Pendientes (${pendingCount})`
                    : "Pendientes"
                  : t}
              </Tab>
            ))}
          </TabsRow>
          <SectionTitle>Usuarios (Administrador)</SectionTitle>
        </HeaderWrapper>

        <Toolbar>
          <SearchWrapper>
            <SearchInner>
              <SearchInput
                placeholder="Buscar por nombre o email"
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
            {filteredUsers
              .slice()
              .sort((a, b) => {
                const aIsAdmin =
                  a.rol && a.rol.toLowerCase() === "administrador";
                const bIsAdmin =
                  b.rol && b.rol.toLowerCase() === "administrador";

                if (aIsAdmin && !bIsAdmin) return -1;
                if (!aIsAdmin && bIsAdmin) return 1;

                return (a.usuario || "").localeCompare(b.usuario || "");
              })
              .map((u) => {
                const isAdmin =
                  u.rol && u.rol.toLowerCase() === "administrador";

                return (
                  <UserCard key={u.id} $isAdmin={isAdmin}>
                    <Avatar src={u.profile_picture} />
                    <UserInfo>
                      {isAdmin && <AdminTag>Admin</AdminTag>}
                      <UserName>{u.usuario}</UserName>
                      <UserMeta>{u.email}</UserMeta>
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
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Editar usuario</ModalTitle>

            <ModalLayout>
              <ModalProfile>
                <ModalAvatar src={editingUser.profile_picture} />
                <ModalProfileName>
                  {editingUser.nombre} {editingUser.apellidos}
                </ModalProfileName>
                <ModalProfileMeta>{editingUser.email}</ModalProfileMeta>

                {editingUser.rol && (
                  <ModalRoleChip
                    $isAdmin={
                      editingUser.rol.toLowerCase() === "administrador"
                    }
                  >
                    {editingUser.rol}
                  </ModalRoleChip>
                )}
              </ModalProfile>

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
                  <ModalLabel>Email (no editable)</ModalLabel>
                  <ModalInput
                    type="email"
                    name="email"
                    value={editForm.email}
                    readOnly
                  />
                </div>

                <div>
                  <ModalLabel>Teléfono</ModalLabel>
                  <ModalInput
                    type="tel"
                    name="telefono"
                    value={editForm.telefono}
                    onChange={handleEditChange}
                    required
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
            </ModalLayout>
          </ModalContent>
        </ModalOverlay>
      )}
    </Page>
  );
};

export default Users;
