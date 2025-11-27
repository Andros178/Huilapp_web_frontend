// src/pages/sites/AddSite.jsx
import React from "react";
import styled from "styled-components";
import AddSiteForm from "./AddSiteForm";
import { useNavigate } from "react-router-dom";

// helper para saber si el usuario es admin leyendo el token
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

export default function AddSite() {
  const navigate = useNavigate();

  // averiguamos UNA VEZ por render si es admin
  const token = localStorage.getItem("token");
  let isAdmin = false;
  if (token) {
    const payload = parseJwt(token);
    isAdmin =
      payload && payload.rol && payload.rol.toLowerCase() === "administrador";
  }

  const handleSuccess = () => {
    if (isAdmin) {
      // 👉 si el que creó el sitio es admin, lo mandamos a la vista admin
      navigate("/admin/sites");
    } else {
      // 👉 usuario normal va a LOCATIONS (no a maps)
      navigate("/locations");
    }
  };

  return (
    <Page>
      <Card>
        <h2>Registrar un sitio</h2>
        <AddSiteForm
          isAdmin={isAdmin}
          onSuccess={handleSuccess}
          onCancel={() => navigate(-1)}
        />
      </Card>
    </Page>
  );
}

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
