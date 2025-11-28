// src/pages/sites/EditSite.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../../services/api.service";
import CATEGORIES from "../../config/categories";

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
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 700;
  color: ${PRIMARY};
`;

const Subtitle = styled.p`
  margin: 0 0 18px 0;
  font-size: 13px;
  color: #6b7280;
`;

const Form = styled.form``;

const Label = styled.div`
  font-weight: 600;
  margin-top: 12px;
  font-size: 13px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e6e6e6;
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e6e6e6;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e6e6e6;
  font-size: 14px;
`;

const CheckboxRow = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 12px;

  label {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const FileRow = styled.div`
  margin-top: 12px;
  font-size: 13px;

  input[type="file"] {
    font-size: 13px;
  }
`;

const PreviewImage = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-image: ${({ src }) =>
    src ? `url(${src})` : "linear-gradient(135deg,#facc15,#22c55e)"};
  margin-bottom: 10px;
`;

const HelpText = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;

  button {
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
  }

  .secondary {
    background: #f3f4f6;
    color: #374151;
  }

  .primary {
    background: ${PRIMARY};
    color: #fff;
  }

  .danger {
    background: #dc2626;
    color: #fff;
  }

  button:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const ErrorBox = styled.div`
  background: #fff1f0;
  color: #9a1f1f;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ffd6d6;
  margin-bottom: 8px;
  font-size: 13px;
`;

const InfoBox = styled.div`
  background: #ecfdf5;
  color: #166534;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #bbf7d0;
  margin-bottom: 8px;
  font-size: 13px;
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ConfirmBox = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  width: 320px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.25);
`;

const ConfirmTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const ConfirmText = styled.p`
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #4b5563;
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

// usar $variant para que no salga warning de styled-components
const ConfirmButton = styled.button`
  border-radius: 999px;
  border: none;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;

  ${({ $variant }) =>
    $variant === "danger"
      ? `
    background:#dc2626;
    color:#fff;
  `
      : `
    background:#f3f4f6;
    color:#374151;
  `}
`;

// Helper para leer el rol y saber si es admin
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

function EditSite() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [originalSite, setOriginalSite] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [subcat, setSubcat] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [petFriendly, setPetFriendly] = useState(false);
  const [kidsFriendly, setKidsFriendly] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [newFile, setNewFile] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function loadSite() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.get(`/sites/${id}`);
        setOriginalSite(data);

        setNombre(data.nombre || "");
        setDescripcion(data.descripcion || "");
        setCategoria(data.categoria || "");

        // 🔹 AQUÍ AJUSTAMOS LAS SUBCATEGORÍAS COMO EN AddSiteForm
        let subcats = [];
        try {
          if (Array.isArray(data.subcategorias)) {
            subcats = data.subcategorias;
          } else if (
            typeof data.subcategorias === "string" &&
            data.subcategorias.trim() !== ""
          ) {
            const parsed = JSON.parse(data.subcategorias);
            if (Array.isArray(parsed)) subcats = parsed;
          }
        } catch (e) {
          console.warn("No se pudieron parsear subcategorías:", e);
        }
        setSubcat(subcats[0] || "");

        setDireccion(data.direccion || "");
        setTelefono(data.telefono || "");
        setPetFriendly(!!data.pet_friendly);
        setKidsFriendly(!!data.kids_friendly);

        let fotosArr = [];
        if (Array.isArray(data.fotos)) {
          fotosArr = data.fotos;
        }
        setCurrentPhoto(fotosArr[0] || null);
      } catch (e) {
        console.error("Error loading site:", e);
        const msg = e.message || "Error al cargar el sitio";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    loadSite();
  }, [id]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCurrentPhoto(previewUrl);
    }
  };

  const validate = () => {
    if (!nombre.trim()) return "El nombre es obligatorio.";
    return null;
  };

  // Igualamos lo más posible al computePayload de móvil
  const buildPayload = () => {
    const current = originalSite || {};

    const finalNombre = nombre.trim() || current.nombre || "";
    const finalCategoria = categoria || current.categoria || null;

    // subcategorías: array (el back acepta array y las serializa)
    let subcategorias = [];
    if (subcat) {
      subcategorias = [subcat];
    } else if (Array.isArray(current.subcategorias)) {
      subcategorias = current.subcategorias;
    }

    const payload = {
      nombre: finalNombre,
      descripcion: descripcion || "",
      categoria: finalCategoria,
      subcategorias,
      pet_friendly: petFriendly,
      kids_friendly: kidsFriendly,
      telefono: telefono || "",
      direccion: direccion || "",
      // NO enviamos latitud/longitud → se quedan como están
    };

    console.log("Payload UPDATE WEB:", payload);
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      let imageError = null;

      // 1) Subir nueva imagen si hay
      if (newFile) {
        try {
          const formData = new FormData();
          formData.append("imagen", newFile);
          await apiService.postFormData(`/sites/${id}/upload`, formData);
        } catch (err) {
          console.error("Error subiendo imagen:", err);
          imageError = err.message || "No se pudo actualizar la imagen.";
        }
      }

      // 2) Payload de actualización
      const payload = buildPayload();
      await apiService.put(`/sites/${id}`, payload);

      if (imageError) {
        setInfo(
          `Sitio actualizado, pero hubo un problema al actualizar la imagen: ${imageError}`
        );
      } else {
        setInfo("Sitio actualizado con éxito.");
        setNewFile(null);
      }
    } catch (e) {
      console.error("Error updating site:", e);
      const msg = e.message || "No se pudo actualizar el sitio";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await apiService.delete(`/sites/${id}`);

      const token = localStorage.getItem("token");
      let isAdmin = false;
      if (token) {
        const payload = parseJwt(token);
        const rol = (payload?.rol || "").toLowerCase();
        isAdmin = rol === "administrador" || rol === "admin";
      }

      if (isAdmin) {
        navigate("/admin/sites");
      } else {
        navigate("/locations");
      }
    } catch (e) {
      console.error("Error deleting site:", e);
      const msg = e.message || "Error al eliminar el sitio";
      setError(msg);
    } finally {
      setSaving(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <Page>Cargando sitio...</Page>;
  }

  return (
    <Page>
      <Card>
        <Title>Editar sitio</Title>
        <Subtitle>
          Actualiza la información de tu sitio. Los cambios pueden ser revisados
          nuevamente por el administrador.
        </Subtitle>

        {error && <ErrorBox>{error}</ErrorBox>}
        {info && <InfoBox>{info}</InfoBox>}

        {currentPhoto && <PreviewImage src={currentPhoto} />}

        <Form onSubmit={handleSubmit}>
          <FileRow>
            <Label>Foto principal</Label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <HelpText>
              Si seleccionas una nueva foto, se actualizará al guardar.
            </HelpText>
          </FileRow>

          <Label>Nombre*</Label>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del sitio"
          />

          <Label>Descripción</Label>
          <TextArea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del sitio"
          />

          <Label>Categoría</Label>
          <Select
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              setSubcat("");
            }}
          >
            <option value="">Selecciona</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>

          <Label>Subcategoría</Label>
          <Select value={subcat} onChange={(e) => setSubcat(e.target.value)}>
            <option value="">Selecciona</option>
            {categoria &&
              (
                CATEGORIES.find((c) => c.name === categoria) || {
                  subcategories: [],
                }
              ).subcategories.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </Select>

          <Label>Dirección</Label>
          <Input
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Dirección"
          />

          <Label>Teléfono</Label>
          <Input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 3101234567"
          />

          <CheckboxRow>
            <label>
              <input
                type="checkbox"
                checked={petFriendly}
                onChange={(e) => setPetFriendly(e.target.checked)}
              />
              Apto para mascotas
            </label>

            <label>
              <input
                type="checkbox"
                checked={kidsFriendly}
                onChange={(e) => setKidsFriendly(e.target.checked)}
              />
              Apto para niños
            </label>
          </CheckboxRow>

          <Actions>
            <button
              type="button"
              className="secondary"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="danger"
              onClick={() => setShowDeleteModal(true)}
              disabled={saving}
            >
              Eliminar sitio
            </button>

            <button type="submit" className="primary" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </Actions>
        </Form>
      </Card>

      {showDeleteModal && (
        <ConfirmOverlay>
          <ConfirmBox>
            <ConfirmTitle>Eliminar sitio</ConfirmTitle>
            <ConfirmText>
              ¿Estás seguro de que deseas eliminar este sitio? Esta acción no se
              puede deshacer.
            </ConfirmText>
            <ConfirmActions>
              <ConfirmButton onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </ConfirmButton>
              <ConfirmButton $variant="danger" onClick={handleDelete}>
                Eliminar
              </ConfirmButton>
            </ConfirmActions>
          </ConfirmBox>
        </ConfirmOverlay>
      )}
    </Page>
  );
}

export default EditSite;