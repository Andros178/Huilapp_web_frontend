import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import apiService from '../../services/api.service';
import CATEGORIES from '../../config/categories';

export default function AddSiteForm({ onSuccess, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcat, setSubcat] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [petFriendly, setPetFriendly] = useState(false);
  const [kidsFriendly, setKidsFriendly] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // default center if user hasn't chosen coordinates
  const DEFAULT_CENTER = [2.5, -75.2];

  // initialize small map for selecting coordinates
  useEffect(() => {
    if (!mapRef.current) return;

    // create map instance
    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView(DEFAULT_CENTER, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // initial marker position
    const initialLat = parseFloat(lat) || DEFAULT_CENTER[0];
    const initialLng = parseFloat(lng) || DEFAULT_CENTER[1];

    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    // when marker dragged, update inputs
    marker.on('dragend', () => {
      const p = marker.getLatLng();
      setLat(p.lat.toFixed(6));
      setLng(p.lng.toFixed(6));
    });

    // allow clicking on map to move marker
    map.on('click', (e) => {
      const { lat: clat, lng: clng } = e.latlng;
      marker.setLatLng([clat, clng]);
      setLat(clat.toFixed(6));
      setLng(clng.toFixed(6));
    });

    // make sure map resizes correctly when modal opens
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      try { map.remove(); } catch (e) {}
    };
  }, [mapRef]);

  // when lat/lng inputs change manually, update marker position
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
    if (!nombre.trim() || !categoria || !subcat || !lat || !lng || !direccion || !telefono) {
      setError('Completa los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('nombre', nombre.trim());
      form.append('categoria', categoria);
      form.append('subcategorias', JSON.stringify([subcat]));
      form.append('latitud', String(lat));
      form.append('longitud', String(lng));
      form.append('descripcion', descripcion || '');
      form.append('direccion', direccion);
      form.append('telefono', telefono);
      form.append('pet_friendly', petFriendly ? 'true' : 'false');
      form.append('kids_friendly', kidsFriendly ? 'true' : 'false');
      if (file) form.append('imagen', file, file.name);

      await apiService.postFormData('/sites', form);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      {error && <ErrorBox>{error}</ErrorBox>}

      <Label>Nombre*</Label>
      <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <Label>Categoría*</Label>
      <Select value={categoria} onChange={(e) => { setCategoria(e.target.value); setSubcat(''); }}>
        <option value="">Selecciona</option>
        {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
      </Select>

      <Label>Subcategoría*</Label>
      <Select value={subcat} onChange={(e) => setSubcat(e.target.value)}>
        <option value="">Selecciona</option>
        {categoria && (CATEGORIES.find(c => c.name === categoria) || { subcategories: [] }).subcategories.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>

      <MapPicker>
        <Label>Selecciona ubicación</Label>
        <SmallMap ref={mapRef} />
        <CoordsRow>
          <div>
            <Label>Latitud*</Label>
            <SmallInput value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitud" />
          </div>
          <div>
            <Label>Longitud*</Label>
            <SmallInput value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitud" />
          </div>
        </CoordsRow>
        <HelpText>Arrastra el marcador o haz clic en el mapa para seleccionar la ubicación.</HelpText>
      </MapPicker>

      <Label>Dirección*</Label>
      <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} />

      <Label>Teléfono*</Label>
      <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />

      <Label>Descripción</Label>
      <TextArea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <FileRow>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      </FileRow>

      <CheckboxRow>
        <label><input type="checkbox" checked={petFriendly} onChange={(e) => setPetFriendly(e.target.checked)} /> Apto para mascotas</label>
        <label><input type="checkbox" checked={kidsFriendly} onChange={(e) => setKidsFriendly(e.target.checked)} /> Apto para niños</label>
      </CheckboxRow>

      <Actions>
        <button type="button" className="secondary" onClick={() => onCancel && onCancel()}>Cancelar</button>
        <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Publicar'}</button>
      </Actions>
    </Form>
  );
}

const Form = styled.form``;
const Label = styled.div`font-weight:600; margin-top:12px;`;
const Input = styled.input`width:100%; padding:8px; border-radius:6px; border:1px solid #e6e6e6;`;
const Select = styled.select`width:100%; padding:8px; border-radius:6px; border:1px solid #e6e6e6;`;
const TextArea = styled.textarea`width:100%; min-height:120px; padding:8px; border-radius:6px; border:1px solid #e6e6e6;`;
const Row = styled.div`display:flex; gap:12px; margin-top:6px;`;
const FileRow = styled.div`margin-top:12px;`;
const CheckboxRow = styled.div`display:flex; gap:18px; margin-top:12px;`;
const Actions = styled.div`display:flex; gap:12px; justify-content:flex-end; margin-top:18px; button{padding:8px 12px;border-radius:8px;border:none; cursor:pointer;} button.secondary{background:transparent;border:1px solid #0b9f88;color:#0b9f88} button:disabled{opacity:0.6}`;
const ErrorBox = styled.div`background:#fff1f0;color:#9a1f1f;padding:8px;border-radius:6px;border:1px solid #ffd6d6;margin-bottom:8px;`;
const MapPicker = styled.div`margin-top:12px;`;
const SmallMap = styled.div`width:100%; height:220px; border-radius:8px; overflow:hidden; margin-top:8px;`;
const CoordsRow = styled.div`display:flex; gap:12px; margin-top:8px;`;
const SmallInput = styled.input`width:100%; padding:8px; border-radius:6px; border:1px solid #e6e6e6;`;
const HelpText = styled.div`font-size:12px;color:#666;margin-top:6px;`;
