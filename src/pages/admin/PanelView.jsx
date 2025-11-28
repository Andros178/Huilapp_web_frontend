// src/pages/admin/PanelView.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/api.service";

// 🔹 Imágenes de las tarjetas
import pendientesImg from "../../assets/pendientes.png";
import sitiosImg from "../../assets/sitios.png";
import usuariosImg from "../../assets/usuarios.png";

const PRIMARY = "#008073";

// ===== Colores por categoría (mismos criterios que en Sites/AdminSites) =====
const CATEGORY_COLORS = {
  "comida y bebida": "#FDBA74", // naranja suave
  compras: "#38BDF8", // azul
  "hoteles y alojamiento": "#A5B4FC", // lila
  "ocio y aire libre": "#4ADE80", // verde
  "sitios turisticos": "#F97373", // rojo suave
  "sitios turísticos": "#F97373",
};

const getCatKeyFromName = (name) =>
  String(name || "").toLowerCase().trim();

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
  gap: 6px;
  margin-bottom: 18px;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${PRIMARY}; /* 🔹 color de marca */
`;

const PageSubtitle = styled.p`
  font-size: 13px;
  color: #4b5563;
`;

// Cards métricas
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 8px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.button`
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 16px 18px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: transform 0.08s ease, box-shadow 0.08s ease, background 0.08s ease,
    color 0.08s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
    background: ${PRIMARY};
  }

  &:hover * {
    color: #ffffff !important;
  }
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
`;

const MetricImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const MetricValue = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: #111827;
`;

const MetricHint = styled.div`
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MetricIcon = styled.span`
  font-size: 18px;
`;

// Sección categorías
const SectionTitle = styled.h2`
  margin-top: 30px;
  font-size: 18px;
  font-weight: 600;
  color: ${PRIMARY};
`;

// 🔹 Gráfico de columnas
const ChartWrapper = styled.div`
  margin-top: 10px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  padding: 12px 16px;
`;

const ChartTitle = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
`;

const ChartInner = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 180px;
  padding-left: 34px; /* espacio para etiquetas de eje Y */
`;

const ChartGrid = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const GridLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #e5e7eb;
`;

const GridLabel = styled.span`
  position: absolute;
  left: 0;
  top: -7px;
  font-size: 10px;
  color: #9ca3af;
`;

// Barras
const BarContainer = styled.div`
  flex: 1;
  min-width: 40px;
  height: 100%;              /* 🔹 CLAVE: da altura para que el % funcione */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
`;

const Bar = styled.div`
  width: 100%;
  border-radius: 10px 10px 0 0;
  background: ${({ $color }) => $color || PRIMARY};
  height: ${({ $height }) => `${$height}%`};
  min-height: 4px;
  transition: height 0.2s ease;
`;

const BarValue = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #111827;
`;

const BarLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
  text-align: center;
`;

// Tabla de categorías
const TableWrapper = styled.div`
  margin-top: 8px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  overflow: hidden;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px; /* compacto */
`;

const Th = styled.th`
  text-align: left;
  padding: 6px 10px;
  background: #f9fafb;
  color: #6b7280;
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 6px 10px;
  border-bottom: 1px solid #f3f4f6;
  color: #111827;

  &:nth-child(3) {
    text-align: right;
  }
`;

const Tr = styled.tr`
  &:hover {
    background: #f9fafb;
  }
`;

const EmptyRow = styled.tr`
  td {
    text-align: center;
    color: #9ca3af;
    padding: 10px 12px;
  }
`;

const MessageBox = styled.div`
  margin-top: 16px;
  font-size: 13px;
  color: #6b7280;
`;

// ======================
// Componente
// ======================
const PanelView = () => {
  const navigate = useNavigate();

  const [totalSites, setTotalSites] = useState(0);
  const [pendingSites, setPendingSites] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [topCategories, setTopCategories] = useState([]);
  const [error, setError] = useState(null);

  // carga de datos
  const loadData = async () => {
    try {
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token. Inicia sesión como administrador.");
        return;
      }

      const payload = parseJwt(token);
      const isAdmin =
        payload && payload.rol && payload.rol.toLowerCase() === "administrador";

      if (!isAdmin) {
        setError("No tienes permisos de administrador.");
        return;
      }

      // 1) sitios (usamos /sites/pendientes como master, igual que AdminSites)
      const sitesRes = await apiService.get("/sites/pendientes");
      const sitesData = sitesRes.data || sitesRes;

      let sitesList = [];
      if (Array.isArray(sitesData)) sitesList = sitesData;
      else if (Array.isArray(sitesData.data)) sitesList = sitesData.data;
      else if (Array.isArray(sitesData.sites)) sitesList = sitesData.sites;

      const totalSitesCount = sitesList.length;
      const pendingSitesCount = sitesList.filter(
        (s) => s.state === "Pendiente"
      ).length;

      setTotalSites(totalSitesCount);
      setPendingSites(pendingSitesCount);

      // 2) usuarios
      const usersRes = await apiService.get("/users");
      const usersData = usersRes.data || usersRes;
      const usersList = Array.isArray(usersData)
        ? usersData
        : usersData.users || usersData.data || [];
      setTotalUsers(usersList.length);

      // 3) categorías más registradas (sobre todos los sitios)
      const categoryMap = {};
      for (const s of sitesList) {
        const rawCat = s.categoria || s.category || "Sin categoría";
        const key = String(rawCat).trim().toLowerCase() || "sin categoría";
        if (!categoryMap[key]) {
          categoryMap[key] = {
            name: rawCat || "Sin categoría",
            count: 0,
          };
        }
        categoryMap[key].count += 1;
      }

      const categoriesArray = Object.values(categoryMap).sort(
        (a, b) => b.count - a.count
      );

      const top5 = categoriesArray.slice(0, 5);
      setTopCategories(top5);
    } catch (err) {
      console.error("Error cargando datos del panel:", err);
      setError(err.message || "Error al cargar el panel de administración.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalSitesSafe = totalSites || 0;

  // 🔹 Escala adaptativa: 5 / 10 / 20 / 50 / 100...
  const maxCount =
    topCategories.length > 0
      ? Math.max(...topCategories.map((c) => c.count))
      : 0;

  let niceMax = 0;
  let step = 0;

  if (maxCount === 0) {
    niceMax = 0;
  } else if (maxCount <= 5) {
    niceMax = 5;
    step = 1;
  } else if (maxCount <= 10) {
    niceMax = 10;
    step = 2;
  } else if (maxCount <= 20) {
    niceMax = 20;
    step = 5;
  } else if (maxCount <= 50) {
    niceMax = 50;
    step = 10;
  } else if (maxCount <= 100) {
    niceMax = 100;
    step = 20;
  } else {
    const power = Math.ceil(Math.log10(maxCount));
    niceMax = Math.pow(10, power);
    step = niceMax / 5;
  }

  const ticks = [];
  if (niceMax > 0 && step > 0) {
    for (let v = step; v <= niceMax; v += step) {
      ticks.push(v);
    }
  }

  return (
    <Page>
      <Shell>
        <HeaderWrapper>
          <TitleRow>
            <PageTitle>Panel de administración</PageTitle>
            <PageSubtitle>
              Resumen rápido de sitios, pendientes y usuarios. Haz clic en cada
              tarjeta para ir al módulo correspondiente.
            </PageSubtitle>
          </TitleRow>
        </HeaderWrapper>

        <MetricsGrid>
          <MetricCard onClick={() => navigate("/admin/Sitesval")}>
            <MetricHeader>
              <MetricLabel>Sitios pendientes</MetricLabel>
              <MetricImage src={pendientesImg} alt="Sitios pendientes" />
            </MetricHeader>
            <MetricValue>{pendingSites}</MetricValue>
            <MetricHint>
              Ver lista de sitios por revisar
            </MetricHint>
          </MetricCard>

          <MetricCard onClick={() => navigate("/admin/sites")}>
            <MetricHeader>
              <MetricLabel>Todos los sitios</MetricLabel>
              <MetricImage src={sitiosImg} alt="Todos los sitios" />
            </MetricHeader>
            <MetricValue>{totalSites}</MetricValue>
            <MetricHint>
              Ir a la gestión completa de sitios
            </MetricHint>
          </MetricCard>

          <MetricCard onClick={() => navigate("/admin/users")}>
            <MetricHeader>
              <MetricLabel>Usuarios registrados</MetricLabel>
              <MetricImage src={usuariosImg} alt="Usuarios registrados" />
            </MetricHeader>
            <MetricValue>{totalUsers}</MetricValue>
            <MetricHint>
              Administrar usuarios de la plataforma
            </MetricHint>
          </MetricCard>
        </MetricsGrid>

        {error && <MessageBox>{error}</MessageBox>}

        <SectionTitle>Categorías más registradas</SectionTitle>

        {/* 🔹 Gráfico de columnas */}
        <ChartWrapper>
          <ChartTitle>
            Distribución de sitios por categoría (Top {topCategories.length}){" "}
           
          </ChartTitle>

          {topCategories.length === 0 ? (
            <MessageBox>
              No hay datos suficientes para mostrar el gráfico.
            </MessageBox>
          ) : (
            <ChartInner>
              {/* Líneas de guía */}
              <ChartGrid>
                {ticks.map((v) => {
                  const pos = (v / niceMax) * 100;
                  return (
                    <GridLine key={v} style={{ bottom: `${pos}%` }}>
                      <GridLabel>{v}</GridLabel>
                    </GridLine>
                  );
                })}
              </ChartGrid>

              {/* Barras */}
              {topCategories.map((cat) => {
                const catKey = getCatKeyFromName(cat.name);
                const color =
                  CATEGORY_COLORS[catKey] ||
                  CATEGORY_COLORS["sitios turisticos"] ||
                  PRIMARY;

                const height =
                  niceMax > 0 ? (cat.count / niceMax) * 100 : 0;

                return (
                  <BarContainer key={cat.name}>
                    <Bar $height={height} $color={color} />
                    <BarValue>{cat.count}</BarValue>
                    <BarLabel>{cat.name}</BarLabel>
                  </BarContainer>
                );
              })}
            </ChartInner>
          )}
        </ChartWrapper>

        {/* Tabla debajo del gráfico */}
        <TableWrapper>
          <DataTable>
            <thead>
              <tr>
                <Th>Categoría</Th>
                <Th>Sitios</Th>
                <Th>% sobre el total</Th>
              </tr>
            </thead>
            <tbody>
              {topCategories.length === 0 ? (
                <EmptyRow>
                  <td colSpan={3}>No hay datos de categorías aún.</td>
                </EmptyRow>
              ) : (
                topCategories.map((cat) => {
                  const pct =
                    totalSitesSafe > 0
                      ? ((cat.count / totalSitesSafe) * 100).toFixed(1)
                      : "0.0";
                  return (
                    <Tr key={cat.name}>
                      <Td>{cat.name}</Td>
                      <Td>{cat.count}</Td>
                      <Td>{pct}%</Td>
                    </Tr>
                  );
                })
              )}
            </tbody>
          </DataTable>
        </TableWrapper>
      </Shell>
    </Page>
  );
};

export default PanelView;
