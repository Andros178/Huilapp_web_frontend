// src/pages/admin/AdminSites.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const PRIMARY = "#008073";
const API_BASE = "https://huilapp-backend.onrender.com/sites";

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
// Styled (mismo look que Locations)
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

/* ===== TOOLBAR / BUSCADOR ===== */

const Toolbar = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  padding: 0 8px;
  position: relative; /* para posicionar el panel de filtros */
`;

const SearchWrapper = styled.div`
  width: 100%;
  max-width: 520px;
  display: grid;
  grid-template-columns: 44px 1fr;
  align-items: center;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
  overflow: hidden;
`;

const FilterButton = styled.button`
  border: none;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5f6f2;
  cursor: pointer;
  font-size: 18px;
  color: ${PRIMARY};
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

/* ===== PANEL DE FILTROS ===== */

const FiltersPanel = styled.div`
  position: absolute;
  top: 56px;
  left: 8px;
  width: 260px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
  padding: 14px 16px;
  z-index: 20;
`;

const FiltersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
`;

const FilterItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: ${({ active }) => (active ? PRIMARY : "#374151")};
  font-weight: ${({ active }) => (active ? "600" : "400")};

  &:last-child {
    border-bottom: none;
  }
`;

const FilterIcon = styled.span`
  font-size: 16px;
`;

const FiltersActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const FiltersButton = styled.button`
  flex: 1;
  height: 32px;
  border-radius: 999px;
  border: none;
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

/* ===== GRID ===== */

const SitesGridWrapper = styled.div`
  margin-top: 24px;
  padding-bottom: 24px;
`;

const SitesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;
`;

const SiteCard = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 72px;
  gap: 14px;
  background: #ffffff;
  padding: 14px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
`;

const SiteThumbnail = styled.div`
  width: 120px;
  height: 90px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  background-image: ${({ src }) =>
    src ? `url(${src})` : "linear-gradient(135deg,#facc15,#22c55e)"};
`;

const SiteInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

const SiteName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const SiteMetaLine = styled.div`
  font-size: 11px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconBullet = styled.span`
  font-size: 12px;
`;

const SiteActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  align-items: flex-end;
`;

const RoundIconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ variant }) =>
    variant === "view"
      ? "#16a34a"
      : variant === "edit"
      ? "#2563eb"
      : "#dc2626"};

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

// ======================
// Componente principal
// ======================
const AdminSites = () => {
  const navigate = useNavigate();
  const [siteList, setSiteList] = useState([]);
  const [activeTab, setActiveTab] = useState("Todos los Sitios");

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // filtros del panel
  const [categoryFilter, setCategoryFilter] = useState(null); // string
  const [kidsFilter, setKidsFilter] = useState(false);        // true / false
  const [petFilter, setPetFilter] = useState(false);          // true / false

  const [error, setError] = useState(null);

  const tabs = ["Todos los Sitios", "Usuarios"];

  // ----------- Carga normal: sitios pendientes (admin) -------------
  async function loadSites() {
    try {
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token. Inicia sesión como administrador.");
        setSiteList([]);
        return;
      }

      const payload = parseJwt(token);
      const isAdmin =
        payload && payload.rol && payload.rol.toLowerCase() === "administrador";

      if (!isAdmin) {
        setError("No tienes permisos de administrador.");
        setSiteList([]);
        return;
      }

      const url = `${API_BASE}/pendientes`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setSiteList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando sitios:", error);
      setError("Error al cargar los sitios.");
      setSiteList([]);
    }
  }

  // ----------- Búsqueda filtrada contra getSites -------------
  // Nota: aquí usamos tu snippet tal cual en forma,
  // solo añadiendo el header Authorization y base de /sites
  async function searchSites() {
    try {
      const params = new URLSearchParams();

      if (search.trim()) params.append("q", search.trim());
      if (categoryFilter) params.append("categoria", categoryFilter);
      if (kidsFilter) params.append("kids_friendly", "true");
      if (petFilter) params.append("pet_friendly", "true");

      const token = localStorage.getItem("token");

      // Aquí llamamos a /sites con filtros (getSites)
      const url = `${API_BASE}?${params.toString()}`;

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();
      setSiteList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error buscando sitios:", error);
      setError("Error al buscar sitios.");
    } finally {
      // 🔴 aquí se cierra el menú al dar en Buscar (o Enter)
      setShowFilters(false);
    }
  }

  // ----------- Admin: aprobar / rechazar (solo si Pendiente) ------------
  async function aprobarSitio(id) {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${API_BASE}/${id}/state`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ state: "Aprobada" }),
    });

    // tras aprobar, recargamos sitios pendientes originales
    loadSites();
  }

  async function rechazarSitio(id) {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${API_BASE}/${id}/state`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ state: "Rechazada" }),
    });

    loadSites();
  }

  useEffect(() => {
    if (activeTab === "Usuarios") {
      navigate("/admin/users");
      return;
    }
    // "Todos los Sitios"
    loadSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <Page>
      <Shell>
        <HeaderWrapper>
          <TabsRow>
            {tabs.map((t) => (
              <Tab
                key={t}
                active={activeTab === t}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </Tab>
            ))}
          </TabsRow>
          <SectionTitle>Gestión de Sitios (Administrador)</SectionTitle>
        </HeaderWrapper>

        <Toolbar>
          <SearchWrapper>
            <FilterButton onClick={() => setShowFilters((prev) => !prev)}>
              ☰
            </FilterButton>

            <SearchInner>
              <SearchInput
                placeholder="Buscar por nombre o categoría"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchSites();
                }}
              />
              <SearchIcon>🔍</SearchIcon>
            </SearchInner>
          </SearchWrapper>

          {showFilters && (
            <FiltersPanel>
              <FiltersList>
                <FilterItem
                  active={categoryFilter === "Comida y bebida"}
                  onClick={() => setCategoryFilter("Comida y bebida")}
                >
                  <FilterIcon>🍽️</FilterIcon>
                  <span>Comida y bebida</span>
                </FilterItem>

                <FilterItem
                  active={categoryFilter === "Compras"}
                  onClick={() => setCategoryFilter("Compras")}
                >
                  <FilterIcon>🛒</FilterIcon>
                  <span>Compras</span>
                </FilterItem>

                <FilterItem
                  active={categoryFilter === "Hoteles y alojamiento"}
                  onClick={() => setCategoryFilter("Hoteles y alojamiento")}
                >
                  <FilterIcon>🏨</FilterIcon>
                  <span>Hoteles y alojamiento</span>
                </FilterItem>

                <FilterItem
                  active={categoryFilter === "Ocio y aire libre"}
                  onClick={() => setCategoryFilter("Ocio y aire libre")}
                >
                  <FilterIcon>🌳</FilterIcon>
                  <span>Ocio y aire libre</span>
                </FilterItem>

                <FilterItem
                  active={kidsFilter}
                  onClick={() => setKidsFilter((prev) => !prev)}
                >
                  <FilterIcon>👶</FilterIcon>
                  <span>Apto para niños</span>
                </FilterItem>

                <FilterItem
                  active={petFilter}
                  onClick={() => setPetFilter((prev) => !prev)}
                >
                  <FilterIcon>🐾</FilterIcon>
                  <span>Apto para mascotas</span>
                </FilterItem>
              </FiltersList>

              <FiltersActions>
                <FiltersButton variant="primary" onClick={searchSites}>
                  Buscar
                </FiltersButton>
                <FiltersButton
                  onClick={() => {
                    setCategoryFilter(null);
                    setKidsFilter(false);
                    setPetFilter(false);
                    setSearch("");
                    loadSites();
                  }}
                >
                  Restablecer
                </FiltersButton>
              </FiltersActions>
            </FiltersPanel>
          )}
        </Toolbar>

        {error && <MessageBox>{error}</MessageBox>}

        <SitesGridWrapper>
          <SitesGrid>
            {siteList.map((site) => {
              const id = site.id ?? site.id_sitio;
              const pendiente = site.state === "Pendiente";

              // sacar primera foto
              let firstFoto = null;
              if (Array.isArray(site.fotos)) {
                firstFoto = site.fotos[0] || null;
              } else if (typeof site.fotos === "string") {
                try {
                  const parsed = JSON.parse(site.fotos);
                  if (Array.isArray(parsed)) firstFoto = parsed[0] || null;
                } catch {
                  // ignorar error de parseo
                }
              }

              return (
                <SiteCard key={id}>
                  <SiteThumbnail src={firstFoto} />

                  <SiteInfo>
                    <SiteName>{site.nombre || site.name}</SiteName>

                    <SiteMetaLine>
                      <IconBullet>📍</IconBullet>
                      <span>{site.direccion || site.address}</span>
                    </SiteMetaLine>

                    <SiteMetaLine>
                      <IconBullet>🏷</IconBullet>
                      <span>{site.categoria || site.category}</span>
                    </SiteMetaLine>

                    <SiteMetaLine>
                      <IconBullet>📌</IconBullet>
                      <span>{site.state}</span>
                    </SiteMetaLine>
                  </SiteInfo>

                  <SiteActions>
                    {/* Ver sitio (siempre) */}
                    <RoundIconButton
                      variant="view"
                      onClick={() => navigate(`/sites/${id}`)}
                      title="Ver detalle"
                    >
                      👁
                    </RoundIconButton>

                    {pendiente ? (
                      <>
                        <RoundIconButton
                          variant="view"
                          onClick={() => aprobarSitio(id)}
                          title="Aprobar sitio"
                        >
                          ✓
                        </RoundIconButton>
                        <RoundIconButton
                          variant="delete"
                          onClick={() => rechazarSitio(id)}
                          title="Rechazar sitio"
                        >
                          ✕
                        </RoundIconButton>
                      </>
                    ) : (
                      <RoundIconButton
                        variant="edit"
                        onClick={() => navigate(`/admin/sites/${id}/edit`)}
                        title="Editar sitio"
                      >
                        ✎
                      </RoundIconButton>
                    )}
                  </SiteActions>
                </SiteCard>
              );
            })}
          </SitesGrid>
        </SitesGridWrapper>
      </Shell>
    </Page>
  );
};

export default AdminSites;
