// src/pages/locations/Locations.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/api.service";

const PRIMARY = "#008073";

// ===================== estilos por categoría =====================

const CATEGORY_STYLES = {
  "comida y bebida": {
    bg: "#FFF7ED", // naranja muy suave
    border: "#FED7AA",
  },
  compras: {
    bg: "#ECFEFF", // azul agua muy suave
    border: "#A5F3FC",
  },
  "hoteles y alojamiento": {
    bg: "#EEF2FF", // lila suave
    border: "#C7D2FE",
  },
  "ocio y aire libre": {
    bg: "#ECFDF5", // verde suave
    border: "#BBF7D0",
  },
};

const CATEGORY_ORDER = [
  "comida y bebida",
  "compras",
  "hoteles y alojamiento",
  "ocio y aire libre",
];

const getCatKey = (cat) => (cat || "").toLowerCase().trim();

// ===================== styled =====================

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  justify-content: center;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
`;

const Shell = styled.div`
  width: 100%;
  max-width: 1200px; /* un poco más ancho como en AdminSites */
`;

const Header = styled.header`
  margin-top: 10px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${PRIMARY};
  margin-bottom: 4px;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: #6b7280;
`;

// Buscador + filtros
const Toolbar = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: center;
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
  padding: 0 40px 0 16px;
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

// Grid de tarjetas
const GridWrapper = styled.div`
  margin-top: 20px;
  padding-bottom: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px 18px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr 60px; /* imagen más ancha a la izq + col de acciones */
  gap: 14px;
  background: ${({ $catKey }) =>
    CATEGORY_STYLES[$catKey]?.bg || "#ffffff"};
  border: 1px solid
    ${({ $catKey }) =>
      CATEGORY_STYLES[$catKey]?.border || "rgba(229,231,235,1)"};
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
    grid-template-columns: 150px 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      "thumb info"
      "thumb actions";
  }
`;

const Thumbnail = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3; /* se adapta al ancho */
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  background-image: ${({ src }) =>
    src
      ? `url(${src})`
      : "linear-gradient(135deg,#e5e7eb,#cbd5f5)"};
  align-self: center; /* centrada verticalmente */

  @media (max-width: 768px) {
    grid-area: thumb;
  }
`;

const Info = styled.div`
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
  margin: 0;
`;

const MetaLine = styled.div`
  font-size: 11px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MetaIcon = styled.span`
  font-size: 12px;
`;

// Estado (solo visual, sin filtros por estado ya)
const StatusBadge = styled.span`
  display: inline-block;
  margin-top: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;

  ${({ state }) => {
    if (state === "Aprobada") {
      return `background:#dcfce7;color:#166534;`;
    }
    if (state === "Pendiente") {
      return `background:#fef9c3;color:#854d0e;`;
    }
    if (state === "Rechazada") {
      return `background:#fee2e2;color:#b91c1c;`;
    }
    return `background:#e5e7eb;color:#374151;`;
  }}
`;

// Acciones
const ActionsCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  align-items: flex-end;

  @media (max-width: 768px) {
    grid-area: actions;
  }
`;

const ActionButton = styled.button`
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

  ${({ variant }) => {
    if (variant === "view") return `background:#16a34a;`;
    if (variant === "edit") return `background:#2563eb;`;
    if (variant === "delete") return `background:#dc2626;`;
    return `background:#6b7280;`;
  }}
`;

// Mensajes
const MessageBox = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
`;

// ===================== componente =====================

const Locations = () => {
  const navigate = useNavigate();

  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [kidsFilter, setKidsFilter] = useState(false);
  const [petFilter, setPetFilter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ------- helper: mapear respuesta del back -------
  const mapRemoteToLocal = (item) => {
    // fotos
    let fotosArr = [];
    try {
      if (Array.isArray(item.fotos)) {
        fotosArr = item.fotos;
      } else if (typeof item.fotos === "string" && item.fotos.trim() !== "") {
        const parsed = JSON.parse(item.fotos);
        if (Array.isArray(parsed)) fotosArr = parsed;
      }
    } catch (e) {}

    const image =
      fotosArr[0] ||
      "https://via.placeholder.com/400x300.png?text=Sin+imagen";

    // subcategorías
    let subcategories = [];
    try {
      if (Array.isArray(item.subcategorias)) {
        subcategories = item.subcategorias;
      } else if (
        typeof item.subcategorias === "string" &&
        item.subcategorias.trim() !== ""
      ) {
        const parsed = JSON.parse(item.subcategorias);
        if (Array.isArray(parsed)) subcategories = parsed;
      }
    } catch (e) {}

    return {
      id: String(item.id_sitio || item.id || item._id || Math.random()),
      backendId: item.id_sitio,
      title: item.nombre || "Sin título",
      address: item.direccion || "",
      phone: item.telefono || "",
      image,
      state: item.state || "Pendiente",
      category: item.categoria || "",
      kidsFriendly: !!item.kids_friendly,
      petFriendly: !!item.pet_friendly,
      subcategories,
      raw: item,
    };
  };

  // ------- cargar mis sitios -------
  const loadSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.get("/sites/my-sites");
      const data = res.data || res;
      if (Array.isArray(data)) {
        setSites(data.map(mapRemoteToLocal));
      } else {
        setSites([]);
      }
    } catch (e) {
      console.error("Error cargando mis sitios:", e);
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e.message ||
        "Error al cargar tus sitios.";
      setError(msg);
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  // ------- filtrado (en memoria) -------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    let list = [...sites];

    if (q) {
      list = list.filter((s) => {
        const subcatsText = (s.subcategories || []).join(" ").toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          (s.category || "").toLowerCase().includes(q) ||
          subcatsText.includes(q)
        );
      });
    }

    if (categoryFilter) {
      const keyFilter = getCatKey(categoryFilter);
      list = list.filter(
        (s) => getCatKey(s.category) === keyFilter
      );
    }

    if (kidsFilter) {
      list = list.filter((s) => s.kidsFriendly);
    }

    if (petFilter) {
      list = list.filter((s) => s.petFriendly);
    }

    // ordenar igual que admin: por categoría y nombre
    list.sort((a, b) => {
      const catAKey = getCatKey(a.category);
      const catBKey = getCatKey(b.category);

      const idxA = CATEGORY_ORDER.indexOf(catAKey);
      const idxB = CATEGORY_ORDER.indexOf(catBKey);

      if (idxA !== -1 || idxB !== -1) {
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        if (idxA !== idxB) return idxA - idxB;
      }

      const nameA = a.title.toLowerCase();
      const nameB = b.title.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    return list;
  }, [sites, search, categoryFilter, kidsFilter, petFilter]);

  // ------- handlers de acciones -------
  const handleSearchSubmit = () => {
    setSearch((prev) => prev.trim());
  };

  const handleView = (site) => {
    const id = site.backendId || site.raw?.id_sitio || site.id;
    if (!id) return;
    navigate(`/sites/${id}`);
  };

  const handleEdit = (site) => {
    const id = site.backendId || site.raw?.id_sitio || site.id;
    if (!id) return;
    navigate(`/sites/${id}/edit`);
  };

  const handleDelete = (site) => {
    // por ahora lo mandamos a la vista de edición, donde ya tienes eliminar
    const id = site.backendId || site.raw?.id_sitio || site.id;
    if (!id) return;
    navigate(`/sites/${id}/edit`);
  };

  // ================== render ==================
  return (
    <Page>
      <Shell>
        <Header>
          <Title>Mis sitios creados</Title>
          <Subtitle>
            Gestiona los lugares que has registrado en Huilapp.
          </Subtitle>
        </Header>

        <Toolbar>
          <SearchWrapper>
            <FilterButton
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              ☰
            </FilterButton>

            <SearchInner>
              <SearchInput
                placeholder="Buscar por nombre, dirección, categoría o subcategoría"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchSubmit();
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
                <FiltersButton variant="primary" onClick={handleSearchSubmit}>
                  Aplicar
                </FiltersButton>
                <FiltersButton
                  onClick={() => {
                    setCategoryFilter(null);
                    setKidsFilter(false);
                    setPetFilter(false);
                    setSearch("");
                    setShowFilters(false);
                  }}
                >
                  Restablecer
                </FiltersButton>
              </FiltersActions>
            </FiltersPanel>
          )}
        </Toolbar>

        {loading && <MessageBox>Cargando sitios...</MessageBox>}
        {error && <MessageBox>{error}</MessageBox>}
        {!loading && !error && filtered.length === 0 && (
          <MessageBox>No tienes sitios que coincidan con la búsqueda.</MessageBox>
        )}

        <GridWrapper>
          <Grid>
            {filtered.map((site) => {
              const catKey = getCatKey(site.category);

              return (
                <Card
                  key={site.id}
                  $catKey={catKey}
                  onClick={() => handleView(site)}
                >
                  <Thumbnail src={site.image} />

                  <Info>
                    <SiteName>{site.title}</SiteName>
                    <MetaLine>
                      <MetaIcon>📍</MetaIcon>
                      <span>{site.address || "Sin dirección"}</span>
                    </MetaLine>
                    <MetaLine>
                      <MetaIcon>🏷</MetaIcon>
                      <span>{site.category || "Sin categoría"}</span>
                    </MetaLine>
                    <MetaLine>
                      <MetaIcon>👶</MetaIcon>
                      <span>
                        Apto niños: {site.kidsFriendly ? "Sí" : "No"}
                      </span>
                    </MetaLine>
                    <MetaLine>
                      <MetaIcon>🐾</MetaIcon>
                      <span>
                        Apto mascotas: {site.petFriendly ? "Sí" : "No"}
                      </span>
                    </MetaLine>
                    <StatusBadge state={site.state}>
                      {site.state || "Pendiente"}
                    </StatusBadge>
                  </Info>

                  <ActionsCol
                    onClick={(e) => {
                      // para que los botones no disparen el onClick del card
                      e.stopPropagation();
                    }}
                  >
                   
                  </ActionsCol>
                </Card>
              );
            })}
          </Grid>
        </GridWrapper>
      </Shell>
    </Page>
  );
};

export default Locations;
