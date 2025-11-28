// src/pages/SiteDetail.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://158.69.60.80/api/sites"; // 👈 CAMBIADO
const PRIMARY = "#008073";

const Page = styled.div`
  padding: 20px;
`;

const Card = styled.div`
  max-width: 820px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: ${PRIMARY};
`;

const Meta = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const Photo = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  margin-bottom: 16px;
  background-image: ${({ src }) =>
    src ? `url(${src})` : "linear-gradient(135deg,#facc15,#22c55e)"};
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
  margin: 8px 0 16px;
  flex-wrap: wrap;
`;

const StateBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
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

const Tag = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  background: #f3f4f6;
  color: #374151;
`;

const Description = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: #4b5563;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;

  button {
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 13px;
  }

  .secondary {
    background: #f3f4f6;
    color: #374151;
  }

  .primary {
    background: ${PRIMARY};
    color: #fff;
  }
`;

export default function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setLoading(true);

        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) {
          throw new Error("Error al cargar el sitio");
        }
        const data = await res.json();
        setSite(data);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <Page>Cargando sitio...</Page>;
  }

  if (error || !site) {
    return <Page>Ocurrió un error: {error || "Sitio no encontrado"}</Page>;
  }

  // getSiteById YA parsea fotos y subcategorias en el backend
  const fotos = Array.isArray(site.fotos) ? site.fotos : [];
  const mainPhoto = fotos.length > 0 ? fotos[0] : null;

  const subcats = Array.isArray(site.subcategorias)
    ? site.subcategorias
    : [];

  return (
    <Page>
      <Card>
        <Photo src={mainPhoto} />

        <Title>{site.nombre}</Title>
        <Meta>📍 {site.direccion}</Meta>
        <Meta>🏷 {site.categoria}</Meta>

        <BadgeRow>
          <StateBadge state={site.state}>
            {site.state || "Pendiente"}
          </StateBadge>

          {subcats.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}

          <Tag>Apto niños: {site.kids_friendly ? "Sí" : "No"}</Tag>
          <Tag>Apto mascotas: {site.pet_friendly ? "Sí" : "No"}</Tag>
        </BadgeRow>

        <Description>{site.descripcion || "Sin descripción"}</Description>

        <Actions>
          <button className="secondary" onClick={() => navigate(-1)}>
            Volver
          </button>
          <button
            className="primary"
            onClick={() => navigate(`/sites/${id}/edit`)}
          >
            Editar sitio
          </button>
        </Actions>
      </Card>
    </Page>
  );
}
