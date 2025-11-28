// src/pages/sites/AddSiteForm.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import apiService from "../../services/api.service";
import CATEGORIES from "../../config/categories";

export default function AddSiteForm({ onSuccess, onCancel, isAdmin = false }) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [subcat, setSubcat] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [petFriendly, setPetFriendly] = useState(false);
  const [kidsFriendly, setKidsFriendly] = useState(false);
  const [file, setFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const DEFAULT_CENTER = [2.5, -75.2];

  // init mapa
  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(DEFAULT_CENTER, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );

    const initialLat = parseFloat(lat) || DEFAULT_CENTER[0];
    const initialLng = parseFloat(lng) || DEFAULT_CENTER[1];

    const marker = L.marker([initialLat, initialLng], {
      draggable: true,
    }).addTo(map);

    markerRef.current = marker;

    marker.on("dragend", () => {
      const p = marker.getLatLng();
      setLat(p.lat.toFixed(6));
      setLng(p.lng.toFixed(6));
    });

    map.on("click", (e) => {
      const { lat: clat, lng: clng } = e.latlng;
      marker.setLatLng([clat, clng]);
      setLat(clat.toFixed(6));
      setLng(clng.toFixed(6));
    });

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      try {
        map.remove();
      } catch (e) {}
    };
  }, [mapRef]);

  // sync manual lat/lng con el marcador
  useEffect(() => {
    if (!markerRef.current) return;
    const la = parseFloat(lat);
    const ln = parseFloat(lng);
    if (!isNaN(la) && !isNaN(ln)) {
      markerRef.current.setLatLng([la, ln]);
      const map = markerRef.current._map;
      if (map) map.setView([la, ln]);
    }
  }, [lat, lng]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const errs = {};
    if (!nombre.trim()) errs.nombre = true;
    if (!categoria) errs.categoria = true;
    if (!subcat) errs.subcat = true;
    if (!lat) errs.lat = true;
    if (!lng) errs.lng = true;
    if (!direccion) errs.direccion = true;
    if (!telefono) errs.telefono = true;
    if (!file) errs.file = true;

    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      setError("Completa los campos requeridos");
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      const form = new FormData();
      form.append("nombre", nombre.trim());
      form.append("categoria", categoria);
      form.append("subcategorias", JSON.stringify([subcat]));
      form.append("latitud", String(lat));
      form.append("longitud", String(lng));
      form.append("descripcion", descripcion || "");
      form.append("direccion", direccion);
      form.append("telefono", telefono);
      form.append("pet_friendly", petFriendly ? "true" : "false");
      form.append("kids_friendly", kidsFriendly ? "true" : "false");
      if (file) form.append("imagen", file, file.name);

      // El backend crea el sitio (normalmente con state = "Pendiente")
      await apiService.postFormData("/sites", form);

      // show pending modal before calling onSuccess
      setSuccessModalVisible(true);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      {error && <ErrorBox>{error}</ErrorBox>}

      <Label>
        Nombre<Req>*</Req>
      </Label>
      <Input hasError={fieldErrors.nombre} value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <Label>
        Categoría<Req>*</Req>
      </Label>
      <Select
        hasError={fieldErrors.categoria}
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

      <Label>
        Subcategoría<Req>*</Req>
      </Label>
      <Select hasError={fieldErrors.subcat} value={subcat} onChange={(e) => setSubcat(e.target.value)}>
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

      <MapPicker>
        <Label>Selecciona ubicación</Label>
        <SmallMap ref={mapRef} />
        {/* ocultamos los inputs de lat/lng, pero los mantenemos en el formulario como hidden */}
        <input type="hidden" name="latitud" value={lat} />
        <input type="hidden" name="longitud" value={lng} />
        <HelpText>
          Arrastra el marcador o haz clic en el mapa para seleccionar la
          ubicación.
        </HelpText>
      </MapPicker>

      <Label>
        Dirección<Req>*</Req>
      </Label>
      <Input hasError={fieldErrors.direccion} value={direccion} onChange={(e) => setDireccion(e.target.value)} />

      <Label>
        Teléfono<Req>*</Req>
      </Label>
      <Input hasError={fieldErrors.telefono} value={telefono} onChange={(e) => setTelefono(e.target.value)} />

      <Label>Descripción</Label>
      <TextArea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <FileRow>
          <Label>
            Imagen<Req>*</Req>
          </Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {fieldErrors.file && <FileError>La imagen es obligatoria</FileError>}
      </FileRow>

      <CheckboxRow>
        <ToggleBtn active={petFriendly} onClick={() => setPetFriendly(p => !p)} aria-pressed={petFriendly} type="button">
          <IconSpan>🐾</IconSpan>
          <div>Apto para mascotas</div>
        </ToggleBtn>

        <ToggleBtn active={kidsFriendly} onClick={() => setKidsFriendly(k => !k)} aria-pressed={kidsFriendly} type="button">
          <IconSpan>🧒</IconSpan>
          <div>Apto para niños</div>
        </ToggleBtn>
      </CheckboxRow>

      <Actions>
        <button
          type="button"
          className="secondary"
          onClick={() => onCancel && onCancel()}
        >
          Cancelar
        </button>
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Publicar"}
        </button>
      </Actions>
      {successModalVisible && (
        <ModalOverlay onClick={() => { setSuccessModalVisible(false); if (onSuccess) onSuccess(); }}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <h3>Registro pendiente</h3>
            <p>Tu sitio ha sido enviado y se encuentra en estado <strong>pendiente de aprobación</strong>. Te notificaremos cuando sea revisado.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={() => { setSuccessModalVisible(false); if (onSuccess) onSuccess(); }}>Aceptar</button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}
    </Form>
  );
}

const Form = styled.form``;
const Label = styled.div`
  font-weight: 600;
  margin-top: 12px;
`;
const Input = styled.input`
  width: 95%;
  padding: 8px;
  border-radius: 6px;
  border: ${p => (p.hasError ? '2px solid #e05555' : '1px solid #e6e6e6')};
  &:focus {
    outline: none;
    border: 2px solid #008073;
  }
`;  
const Select = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: ${p => (p.hasError ? '2px solid #e05555' : '1px solid #e6e6e6')};
  &:focus {
    outline: none;
    border: 2px solid #008073;
  }
`;
const TextArea = styled.textarea`
  width: 95%;
  min-height: 120px;
  padding: 8px;
  border-radius: 6px;
  border: ${p => (p.hasError ? '2px solid #e05555' : '1px solid #e6e6e6')};
  &:focus {
    outline: none;
    border: 2px solid #008073;
  }
`;
const FileRow = styled.div`
  margin-top: 12px;
`;
const CheckboxRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;
const ToggleBtn = styled.button`
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  border-radius:10px;
  border: 1px solid ${p => p.active ? '#0b9f88' : '#e6e6e6'};
  background: ${p => p.active ? 'linear-gradient(90deg,#0bb39f,#0b9f88)' : '#fff'};
  color: ${p => p.active ? '#fff' : '#333'};
  cursor:pointer;
  font-weight:600;
  min-width: 160px;
`;
const IconSpan = styled.span`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:28px;
  height:28px;
  border-radius:14px;
  background: ${p => p.active ? 'rgba(255,255,255,0.12)' : 'transparent'};
  font-size:16px;
`;
const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 18px;

  button {
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }

  button.secondary {
    background: transparent;
    border: 1px solid #0b9f88;
    color: #0b9f88;
  }

  button:disabled {
    opacity: 0.6;
  }
`;
const ErrorBox = styled.div`
  background: #fff1f0;
  color: #9a1f1f;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ffd6d6;
  margin-bottom: 8px;
`;
const MapPicker = styled.div`
  margin-top: 12px;
`;
const SmallMap = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
`;
const CoordsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;
const SmallInput = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: ${p => (p.hasError ? '2px solid #e05555' : '1px solid #e6e6e6')};
  &:focus {
    outline: none;
    border: 2px solid #008073;
  }
`;
const Req = styled.span`
  color: #e05555;
  margin-left: 6px;
`;
const FileError = styled.div`
  color: #e05555;
  font-size: 13px;
  margin-top: 6px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index: 9999;
`;

const ModalCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  width: 420px;
  max-width: 94%;
  box-shadow: 0 12px 36px rgba(0,0,0,0.18);
  p { color: #333 }
  button { background: #0b9f88; color: #fff; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer }
`;
const HelpText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 6px;
`;
