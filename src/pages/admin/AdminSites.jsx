// src/pages/admin/AdminSites.jsx
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
// Estilos por categoría
// ======================
const CATEGORY_STYLES = {
  "comida y bebida": {
    bg: "#FFF7ED",
    border: "#FED7AA",
  },
  compras: {
    bg: "#ECFEFF",
    border: "#A5F3FC",
  },
  "hoteles y alojamiento": {
    bg: "#EEF2FF",
    border: "#C7D2FE",
  },
  "ocio y aire libre": {
    bg: "#ECFDF5",
    border: "#BBF7D0",
  },
  // nueva categoría: sitios turísticos (con y sin tilde)
  "sitios turisticos": {
    bg: "#FEF2F2",
    border: "#FCA5A5",
  },
  "sitios turísticos": {
    bg: "#EFFFDB",
    border: "#ABD880",
  },
};

const CATEGORY_ORDER = [
  "comida y bebida",
  "compras",
  "hoteles y alojamiento",
  "ocio y aire libre",
  "sitios turisticos", // forma base para ordenar
];

const getCatKey = (site) =>
  (site.categoria || site.category || "").toLowerCase().trim();

// ======================
// Styled
// ======================
const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background: #ffffffff;
  font-family: "Inter", sans-serif;
`;

const Shell = styled.div`
  width: 100%;
  max-width: 1200px;
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
  position: relative;
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
      ? `background: ${PRIMARY}; color: #fff;`
      : `background: #f3f4f6; color: #374151;`};
`;

const SitesGridWrapper = styled.div`
  margin-top: 24px;
  padding-bottom: 24px;
`;

const SitesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px 18px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SiteCard = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr 70px;
  gap: 14px;
  background: ${({ $catKey, $state }) =>
    $state === "Rechazada"
      ? "#f72f2fff" // rojo suave para rechazados
      : CATEGORY_STYLES[$catKey]?.bg || "#ffffff"};
  border: 1px solid
    ${({ $catKey, $state }) =>
      $state === "Rechazada"
        ? "#ff0000ff"
        : CATEGORY_STYLES[$catKey]?.border || "rgba(229,231,235,1)"};
  padding: 14px 16px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.08s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
  }

  @media (max-width: 768px) {
    grid-template-columns: 140px 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      "thumb info"
      "thumb actions";
  }
`;

const SiteThumbnail = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  background-image: ${({ src }) =>
    src ? `url(${src})` : "linear-gradient(135deg,#facc15,#22c55e)"};
  align-self: center;

  @media (max-width: 768px) {
    grid-area: thumb;
  }
`;

const SiteInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;

  @media (max-width: 768px) {
    grid-area: info;
  }
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

  @media (max-width: 768px) {
    grid-area: actions;
  }
`;

const RoundIconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ variant }) =>
    variant === "approve" ? "#16a34a" : "#dc2626"};

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
// Component
// ======================
const AdminSites = () => {
  const navigate = useNavigate();
  const [allSites, setAllSites] = useState([]);   // 👈 lista completa (incluye Pendientes)
  const [siteList, setSiteList] = useState([]);   // 👈 lista filtrada para mostrar
  const [activeTab, setActiveTab] = useState("Todos los Sitios");

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // guardamos la categoría en minúsculas para comparar con getCatKey
  const [categoryFilter, setCategoryFilter] = useState("");
  const [kidsFilter, setKidsFilter] = useState(false);
  const [petFilter, setPetFilter] = useState(false);

  const [error, setError] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  // 👇 aquí añadimos Dashboard a las pestañas
  const tabs = ["Dashboard", "Todos los Sitios", "Pendientes", "Usuarios"];

  // helper para aplicar filtros sobre la lista completa
  const applyFilters = (baseList) => {
    let list = [...baseList];

    // texto de búsqueda (nombre o categoría)
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((s) => {
        const name = (s.nombre || s.name || "").toLowerCase();
        const cat = (s.categoria || s.category || "").toLowerCase();
        return name.includes(term) || cat.includes(term);
      });
    }

    // filtro por categoría
    if (categoryFilter) {
      list = list.filter((s) => {
        const catKey = getCatKey(s);
        const filterKey = categoryFilter.toLowerCase();

        if (filterKey === "sitios turisticos") {
          // aceptamos ambas variaciones
          return (
            catKey === "sitios turisticos" || catKey === "sitios turísticos"
          );
        }

        return catKey === filterKey;
      });
    }

    // filtros booleanos
    if (kidsFilter) {
      list = list.filter((s) => s.kids_friendly === true);
    }
    if (petFilter) {
      list = list.filter((s) => s.pet_friendly === true);
    }

    // en AdminSites queremos mostrar solo NO pendientes
    list = list.filter((s) => s.state !== "Pendiente");

    return list;
  };

  // ======================
  // LOAD ALL (usando /sites/pendientes como master)
  // ======================
  async function loadSites() {
    try {
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token. Inicia sesión como administrador.");
        setAllSites([]);
        setSiteList([]);
        setPendingCount(0);
        return;
      }

      const payload = parseJwt(token);
      const isAdmin =
        payload && payload.rol && payload.rol.toLowerCase() === "administrador";

      if (!isAdmin) {
        setError("No tienes permisos de administrador.");
        setAllSites([]);
        setSiteList([]);
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

      setAllSites(list);
      setPendingCount(onlyPending.length);

      // aplicar filtros actuales sobre la nueva lista
      const filtered = applyFilters(list);
      setSiteList(filtered);
    } catch (error) {
      console.error("Error cargando sitios:", error);
      setError("Error al cargar los sitios.");
      setAllSites([]);
      setSiteList([]);
      setPendingCount(0);
    }
  }

  // ======================
  // SEARCH (ahora solo filtra en el front)
  // ======================
  function searchSites() {
    const filtered = applyFilters(allSites);
    setSiteList(filtered);
    setShowFilters(false);
  }

  // ======================
  // APPROVE / REJECT
  // ======================
  async function aprobarSitio(id) {
    try {
      await apiService.put(`/sites/${id}/state`, { state: "Aprobada" });
      loadSites();
    } catch (e) {
      console.error("Error aprobando sitio:", e);
    }
  }

  async function rechazarSitio(id) {
    try {
      await apiService.put(`/sites/${id}/state`, { state: "Rechazada" });
      loadSites();
    } catch (e) {
      console.error("Error rechazando sitio:", e);
    }
  }

  useEffect(() => {
    // 👇 nueva ruta para Dashboard
    if (activeTab === "Dashboard") {
      navigate("/admin/panelview");
      return;
    }

    if (activeTab === "Usuarios") {
      navigate("/admin/users");
      return;
    }

    if (activeTab === "Pendientes") {
      navigate("/admin/Sitesval");
      return;
    }

    // Solo "Todos los Sitios" carga aquí
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
                {t === "Pendientes"
                  ? pendingCount > 0
                    ? `Pendientes (${pendingCount})`
                    : "Pendientes"
                  : t}
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
                  if (e.key === "Enter") {
                    e.preventDefault();
                    searchSites();
                  }
                }}
              />
              <SearchIcon>🔍</SearchIcon>
            </SearchInner>
          </SearchWrapper>

          {showFilters && (
            <FiltersPanel>
              <FiltersList>
                <FilterItem
                  active={categoryFilter === "comida y bebida"}
                  onClick={() => setCategoryFilter("comida y bebida")}
                >
                  <FilterIcon>🍽️</FilterIcon>
                  <span>Comida y bebida</span>
                </FilterItem>

                <FilterItem
                  active={categoryFilter === "compras"}
                  onClick={() => setCategoryFilter("compras")}
                >
                  <FilterIcon>🛒</FilterIcon>
                  <span>Compras</span>
                </FilterItem>

                <FilterItem
                  active={categoryFilter === "hoteles y alojamiento"}
                  onClick={() =>
                    setCategoryFilter("hoteles y alojamiento")
                  }
                >
                  <FilterIcon>🏨</FilterIcon>
                  <span>Hoteles y alojamiento</span>
                </FilterItem>

                <FilterItem
                  active={categoryFilter === "sitios turisticos"}
                  onClick={() => setCategoryFilter("sitios turisticos")}
                >
                  <FilterIcon>🌳</FilterIcon>
                  <span>Sitios Turisticos</span>
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
                    setCategoryFilter("");
                    setKidsFilter(false);
                    setPetFilter(false);
                    setSearch("");
                    // restaurar lista base sin filtros
                    const base = allSites.filter(
                      (s) => s.state !== "Pendiente"
                    );
                    setSiteList(base);
                    setShowFilters(false);
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
            {siteList
              .slice()
              .sort((a, b) => {
                // primero: estado (Aprobada antes que Rechazada)
                const stateOrder = (s) => {
                  if (s.state === "Aprobada") return 0;
                  if (s.state === "Rechazada") return 1;
                  return 2;
                };
                const sA = stateOrder(a);
                const sB = stateOrder(b);
                if (sA !== sB) return sA - sB;

                // luego categoría
                const catA = getCatKey(a);
                const catB = getCatKey(b);

                const idxA = CATEGORY_ORDER.indexOf(catA);
                const idxB = CATEGORY_ORDER.indexOf(catB);

                if (idxA !== -1 || idxB !== -1) {
                  if (idxA === -1) return 1;
                  if (idxB === -1) return -1;
                  if (idxA !== idxB) return idxA - idxB;
                }

                // luego subcategoría y nombre
                const subA = (a.subcategorias || a.subcategoria || "")
                  .toString()
                  .toLowerCase();
                const subB = (b.subcategorias || b.subcategoria || "")
                  .toString()
                  .toLowerCase();

                if (subA !== subB) return subA.localeCompare(subB);

                const nameA = (a.nombre || a.name || "").toLowerCase();
                const nameB = (b.nombre || b.name || "").toLowerCase();
                return nameA.localeCompare(nameB);
              })
              .map((site) => {
                const id = site.id ?? site.id_sitio;

                let firstFoto = null;
                if (Array.isArray(site.fotos)) {
                  firstFoto = site.fotos[0] || null;
                } else if (typeof site.fotos === "string") {
                  try {
                    const parsed = JSON.parse(site.fotos);
                    if (Array.isArray(parsed)) firstFoto = parsed[0] || null;
                  } catch {}
                }

                const categoria = site.categoria || site.category || "";
                const catKey = getCatKey(site);

                return (
                  <SiteCard
                    key={id}
                    $catKey={catKey}
                    $state={site.state}
                    onClick={() =>
                      navigate(`/sites/${id}`, { state: { fromAdmin: true } })
                    }
                  >
                    <SiteThumbnail src={firstFoto} />

                    <SiteInfo>
                      <SiteName>{site.nombre || site.name}</SiteName>

                      <SiteMetaLine>
                        <IconBullet>📍</IconBullet>
                        <span>{site.direccion || site.address}</span>
                      </SiteMetaLine>

                      <SiteMetaLine>
                        <IconBullet>🏷</IconBullet>
                        <span>{categoria}</span>
                      </SiteMetaLine>

                      <SiteMetaLine>
                        <IconBullet>📌</IconBullet>
                        <span>{site.state}</span>
                      </SiteMetaLine>
                    </SiteInfo>

                    <SiteActions>
                      {/* aquí en teoría ya no llegan Pendientes, 
                          pero dejamos la lógica por si acaso */}
                      {site.state === "Pendiente" && (
                        <>
                          <RoundIconButton
                            variant="approve"
                            title="Aprobar sitio"
                            onClick={(e) => {
                              e.stopPropagation();
                              aprobarSitio(id);
                            }}
                          >
                            ✓
                          </RoundIconButton>
                          <RoundIconButton
                            variant="delete"
                            title="Rechazar sitio"
                            onClick={(e) => {
                              e.stopPropagation();
                              rechazarSitio(id);
                            }}
                          >
                            ✕
                          </RoundIconButton>
                        </>
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
