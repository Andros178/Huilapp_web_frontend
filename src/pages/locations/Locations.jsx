// src/pages/locations/Locations.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const PRIMARY = "#008073";
const API_BASE = "https://huilapp-backend.onrender.com/sites";

/* ====================== */
/*       UI STYLES        */
/* ====================== */

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

const SectionTitle = styled.h2`
  margin-top: 24px;
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

/* ====================== */
/*  COMPONENTE PRINCIPAL  */
/* ====================== */

const Locations = () => {
  const navigate = useNavigate();

  const [allSites, setAllSites] = useState([]);
  const [siteList, setSiteList] = useState([]);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState(null);
  const [kidsFilter, setKidsFilter] = useState(false);
  const [petFilter, setPetFilter] = useState(false);

  const [error, setError] = useState(null);

  /* ==========================
     Cargar MIS SITIOS
  ========================== */
  async function loadMySites() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Debes iniciar sesión.");
        return;
      }

      const res = await fetch(`${API_BASE}/my-sites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];

      setAllSites(arr);
      setSiteList(arr);
    } catch (e) {
      setError("Error cargando tus sitios.");
    }
  }

  useEffect(() => {
    loadMySites();
  }, []);

  /* ==========================
     Filtrar en el frontend
  ========================== */
  const applyFilters = (list) => {
    return list.filter((site) => {
      const term = search.trim().toLowerCase();
      const name = (site.nombre || "").toLowerCase();
      const category = (site.categoria || "").toLowerCase();

      const matchesText =
        !term || name.includes(term) || category.includes(term);

      const matchesCategory =
        !categoryFilter || site.categoria === categoryFilter;

      const matchesKids = !kidsFilter || site.kids_friendly === true;
      const matchesPet = !petFilter || site.pet_friendly === true;

      return matchesText && matchesCategory && matchesKids && matchesPet;
    });
  };

  function searchSites() {
    setSiteList(applyFilters(allSites));
    setShowFilters(false);
  }

  function resetFilters() {
    setCategoryFilter(null);
    setKidsFilter(false);
    setPetFilter(false);
    setSearch("");
    setSiteList(allSites);
  }

  /* ==========================
     Eliminar sitio
  ========================== */
  async function borrarSitio(id) {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      loadMySites();
    } catch (e) {}
  }

  return (
    <Page>
      <Shell>
        <HeaderWrapper>
          <SectionTitle>Mis sitios creados</SectionTitle>
        </HeaderWrapper>

        <Toolbar>
          <SearchWrapper>
            <FilterButton onClick={() => setShowFilters(!showFilters)}>
              ☰
            </FilterButton>

            <SearchInner>
              <SearchInput
                placeholder="Buscar por nombre o categoría"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchSites()}
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
                  <FilterIcon>🍽️</FilterIcon> Comida y bebida
                </FilterItem>

                <FilterItem
                  active={categoryFilter === "Compras"}
                  onClick={() => setCategoryFilter("Compras")}
                >
                  <FilterIcon>🛒</FilterIcon> Compras
                </FilterItem>

                <FilterItem
                  active={categoryFilter === "Hoteles y alojamiento"}
                  onClick={() => setCategoryFilter("Hoteles y alojamiento")}
                >
                  <FilterIcon>🏨</FilterIcon> Hoteles y alojamiento
                </FilterItem>

                <FilterItem
                  active={categoryFilter === "Ocio y aire libre"}
                  onClick={() => setCategoryFilter("Ocio y aire libre")}
                >
                  <FilterIcon>🌳</FilterIcon> Ocio y aire libre
                </FilterItem>

                <FilterItem
                  active={kidsFilter}
                  onClick={() => setKidsFilter(!kidsFilter)}
                >
                  <FilterIcon>👶</FilterIcon> Apto para niños
                </FilterItem>

                <FilterItem
                  active={petFilter}
                  onClick={() => setPetFilter(!petFilter)}
                >
                  <FilterIcon>🐾</FilterIcon> Apto para mascotas
                </FilterItem>
              </FiltersList>

              <FiltersActions>
                <FiltersButton variant="primary" onClick={searchSites}>
                  Buscar
                </FiltersButton>

                <FiltersButton onClick={resetFilters}>
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
              const id = site.id_sitio;

              let firstFoto = null;
              try {
                const arr = JSON.parse(site.fotos);
                if (Array.isArray(arr)) firstFoto = arr[0] || null;
              } catch {}

              return (
                <SiteCard key={id}>
                  <SiteThumbnail src={firstFoto} />

                  <SiteInfo>
                    <SiteName>{site.nombre}</SiteName>

                    <SiteMetaLine>
                      <IconBullet>📍</IconBullet>
                      {site.direccion}
                    </SiteMetaLine>

                    <SiteMetaLine>
                      <IconBullet>🏷</IconBullet>
                      {site.categoria}
                    </SiteMetaLine>

                    <SiteMetaLine>
                      <IconBullet>📌</IconBullet>
                      {site.state}
                    </SiteMetaLine>
                  </SiteInfo>

                  <SiteActions>
                    <RoundIconButton
                      variant="view"
                      onClick={() => navigate(`/sites/${id}`)}
                    >
                      👁
                    </RoundIconButton>

                    <RoundIconButton
                      variant="edit"
                      onClick={() => navigate(`/sites/${id}/edit`)}
                    >
                      ✎
                    </RoundIconButton>

                    <RoundIconButton
                      variant="delete"
                      onClick={() => borrarSitio(id)}
                    >
                      🗑
                    </RoundIconButton>
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

export default Locations;
