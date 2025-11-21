import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import apiService from '../../services/api.service';
import AddSiteForm from '../sites/AddSiteForm';

import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Ensure default icon images are set (bundlers sometimes lose default paths)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

export default function Maps() {
  const [sites, setSites] = useState([]);
  const [center, setCenter] = useState([2.5, -75.2]); // fallback center
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [initialCategories, setInitialCategories] = useState([]);
  const [initialCategoriesTree, setInitialCategoriesTree] = useState([]);
  const [petFriendly, setPetFriendly] = useState(false);
  const [kidsFriendly, setKidsFriendly] = useState(false);
  const mapRef = useRef(null);
  const markersGroupRef = useRef(null);
  const searchDebounceRef = useRef(null);

  // Fetch sites with current filters
  const fetchSites = async (opts = {}) => {
    try {
      const params = new URLSearchParams();
      const q = typeof opts.q !== 'undefined' ? opts.q : query;
      const cat = typeof opts.category !== 'undefined' ? opts.category : category;
      const pet = typeof opts.petFriendly !== 'undefined' ? opts.petFriendly : petFriendly;
      const kids = typeof opts.kidsFriendly !== 'undefined' ? opts.kidsFriendly : kidsFriendly;

      if (q) params.append('q', q);
      if (cat) params.append('categoria', cat);
      if (pet) params.append('pet_friendly', 'true');
      if (kids) params.append('kids_friendly', 'true');

      const path = params.toString() ? `/sites?${params.toString()}` : '/sites';
      const data = await apiService.get(path);
      setSites(data || []);
      if (data && data.length) {
        const coords = data.filter(d => d.latitud && d.longitud).map(d => [d.latitud, d.longitud]);
        if (coords.length) {
          const avgLat = coords.reduce((s, c) => s + c[0], 0) / coords.length;
          const avgLng = coords.reduce((s, c) => s + c[1], 0) / coords.length;
          setCenter([avgLat, avgLng]);
        }
      }
      // derive categories for filter select
      const catSet = new Set((data || []).map(d => d.categoria).filter(Boolean));
      const catList = Array.from(catSet);
      setCategories(catList);
      // preserve the full list/tree on first successful load so filters don't disappear
      if (!initialCategories || initialCategories.length === 0) {
        setInitialCategories(catList);
      }

      // build categories tree with subcategories
      const treeMap = new Map();
      (data || []).forEach(d => {
        const cat = d.categoria || 'Otros';
        const subs = Array.isArray(d.subcategorias) ? d.subcategorias : [];
        if (!treeMap.has(cat)) treeMap.set(cat, new Set());
        subs.forEach(s => { if (s) treeMap.get(cat).add(s); });
      });
      // Merge with predefined category config (adds icons and common subcategories)
      const tree = Array.from(treeMap.entries()).map(([cat, subsSet]) => ({
        categoria: cat,
        subcategorias: Array.from(subsSet)
      }));

      // If there are default categories defined, ensure they're present and merge subcategories
      const CATEGORY_CONFIG = {
        'Hoteles y alojamiento': {
          subcategorias: ['Hotel', 'Hostal', 'Motel', 'Apartamento turístico']
        },
        // add more defaults here as needed
      };

      const finalMap = new Map(tree.map(t => [t.categoria, new Set(t.subcategorias)]));
      Object.entries(CATEGORY_CONFIG).forEach(([k, v]) => {
        if (!finalMap.has(k)) finalMap.set(k, new Set(v.subcategorias || []));
        else {
          (v.subcategorias || []).forEach(s => finalMap.get(k).add(s));
        }
      });

      const finalTree = Array.from(finalMap.entries()).map(([cat, subsSet]) => ({
        categoria: cat,
        subcategorias: Array.from(subsSet)
      }));
      setCategoriesTree(finalTree);
      if (!initialCategoriesTree || initialCategoriesTree.length === 0) {
        setInitialCategoriesTree(finalTree);
      }
    } catch (err) {
      // keep previous data on error
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchSites();
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // initialize map once
    if (!mapRef.current) {
      mapRef.current = L.map('huilapp-map', { zoomControl: true }).setView(center, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);
      markersGroupRef.current = L.layerGroup().addTo(mapRef.current);
      // ensure map layout is correct after being added to the DOM
      setTimeout(() => {
        try { mapRef.current.invalidateSize(); } catch (e) {}
      }, 200);
      // keep map responsive
      const onResize = () => { try { mapRef.current && mapRef.current.invalidateSize(); } catch (e) {} };
      window.addEventListener('resize', onResize);
      // store listener so we can remove later if needed
      mapRef.current.__onResize = onResize;
    }
    // update view when center changes
    if (mapRef.current && center) {
      mapRef.current.setView(center, mapRef.current.getZoom());
    }

    return () => {
      // remove resize listener if present
      try {
        if (mapRef.current && mapRef.current.__onResize) window.removeEventListener('resize', mapRef.current.__onResize);
      } catch (e) {}
    };
  }, [center]);

  // Adjust Leaflet zoom control vertical offset so it doesn't sit at the very top edge
  useEffect(() => {
    const styleId = 'huilapp-leaflet-zoom-style';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      /* default small offset for mobile */
      .leaflet-top .leaflet-control-zoom { top: 88px !important; }

      /* on desktop, push zoom controls further down to clear header and controls bar */
      @media (min-width: 1024px) {
        .leaflet-top .leaflet-control-zoom { top: 140px !important; }
      }
    `;
    document.head.appendChild(style);
    // keep style persistent across navigation (do not remove on unmount)
  }, []);

  useEffect(() => {
    // update markers when sites change
    const group = markersGroupRef.current;
    if (!group) return;
    group.clearLayers();

    sites.forEach(site => {
      if (!site.latitud || !site.longitud) return;
      const marker = L.marker([site.latitud, site.longitud], { icon: getIconForSite(site) });
      const popupEl = document.createElement('div');
      popupEl.style.minWidth = '200px';
      popupEl.innerHTML = `
        <div>
          <h4 style="margin:0">${escapeHtml(site.nombre || '')}</h4>
          <p style="margin:6px 0">${escapeHtml(site.categoria || '')}</p>
        </div>
      `;
      if (site.fotos && site.fotos.length) {
        const img = document.createElement('img');
        img.src = site.fotos[0];
        img.alt = site.nombre || '';
        img.style.width = '100%';
        img.style.borderRadius = '6px';
        popupEl.appendChild(img);
      }
      marker.bindPopup(popupEl);
      marker.on('click', () => setSelected(site));
      marker.addTo(group);
    });
  }, [sites]);

  // Icon generation helpers: generate lightweight SVG data URL icons per category
  const iconCache = useRef(new Map()).current;

  function createSvgForCategory(cat) {
    const name = (cat || '').toLowerCase();
    // choose color per broad category (extend as needed)
    let color = '#0b9f88';
    if (name.includes('comida') || name.includes('restaurante') || name.includes('bar')) color = '#ff6b6b';
    if (name.includes('compra') || name.includes('tienda')) color = '#ffb74d';
    if (name.includes('hotel') || name.includes('alojamiento') || name.includes('hostal')) color = '#4f83ff';
    if (name.includes('parque') || name.includes('ocio') ) color = '#4bd39a';

    // small house icon for hotels otherwise simple pin
    const housePath = 'M12 3 L2 12 H5 V21 H10 V14 H14 V21 H19 V12 H22 Z';
    const pinPath = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z';

    const path = (name.includes('hotel') || name.includes('alojamiento') || name.includes('hostal')) ? housePath : pinPath;

    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24'>
        <defs></defs>
        <path d='${path}' fill='${color}' stroke='white' stroke-width='0.6'/>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  function createIconForCategory(cat) {
    const url = createSvgForCategory(cat);
    return L.icon({
      iconUrl: url,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -28]
    });
  }

  function getIconForSite(site) {
    const cat = site && (site.categoria || site.categoría || '');
    if (!cat) return L.Icon.Default.prototype;
    if (iconCache.has(cat)) return iconCache.get(cat);
    const ic = createIconForCategory(cat);
    iconCache.set(cat, ic);
    return ic;
  }

  // Search input handler with debounce
  const onSearchChange = (value) => {
    setQuery(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      fetchSites({ q: value });
    }, 450);
  };

  const applyFilters = () => {
    fetchSites({ category, petFriendly, kidsFriendly, q: query });
  };

  const resetFilters = () => {
    setQuery('');
    setCategory('');
    setPetFriendly(false);
    setKidsFriendly(false);
    fetchSites({ q: '', category: '', petFriendly: false, kidsFriendly: false });
  };

  useEffect(() => {
    if (selected && selected.latitud && selected.longitud && mapRef.current) {
      mapRef.current.setView([selected.latitud, selected.longitud], 14);
    }
  }, [selected]);

  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);
  // close dropdown on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!showFilters) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [showFilters]);

  // state to manage expanded categories in dropdown
  const [expandedCats, setExpandedCats] = useState(new Set());

  const toggleCategory = (cat) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const onSelectSubcategory = (cat, sub) => {
    // set both category and query (backend will filter by categoria and subcategorias via q)
    setCategory(cat);
    setQuery(sub);
    fetchSites({ category: cat, q: sub });
    setShowFilters(false);
  };

  // Small helper to map category names to icons (using emoji as lightweight icons)
  const getCategoryIcon = (cat) => {
    if (!cat) return '📍';
    const c = cat.toLowerCase();
    if (c.includes('comida') || c.includes('restaurante') || c.includes('pizzer') || c.includes('bar') || c.includes('caf')) return '🍴';
    if (c.includes('compra') || c.includes('tienda') || c.includes('compras')) return '🛒';
    if (c.includes('hotel') || c.includes('alojamiento') || c.includes('hostal')) return '🛏️';
    if (c.includes('ocio') || c.includes('aire') || c.includes('parque')) return '🏞️';
    if (c.includes('niños') || c.includes('apto para niños')) return '🧒';
    if (c.includes('mascota') || c.includes('pet')) return '🐾';
    return '📌';
  };

  return (
    <PageContainer>
      <MapWrapper>
        <ControlsBar>
          <FilterToggle onClick={() => setShowFilters(s => !s)} aria-expanded={showFilters} aria-label="Abrir filtros">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M3 12h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M15 6h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 18h12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="6" cy="6" r="1.6" fill="#fff" />
              <circle cx="12" cy="12" r="1.6" fill="#fff" />
              <circle cx="18" cy="18" r="1.6" fill="#fff" />
            </svg>
          </FilterToggle>

          <SearchWrapper>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              placeholder="Buscar por nombre o categoría"
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <SearchBtn aria-label="Buscar" onClick={() => fetchSites({ q: query })}>Buscar</SearchBtn>
          </SearchWrapper>

        </ControlsBar>

        {/* Registrar sitio: centered under the controls/search bar */}
        <AddSiteButton onClick={() => setShowAddModal(true)}>
          <PlusCircle>+</PlusCircle>
          <span>Registrar un sitio</span>
        </AddSiteButton>
        {showAddModal && (
          <ModalOverlay onClick={() => setShowAddModal(false)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <h3>Registrar un sitio</h3>
              <AddSiteForm onSuccess={() => setShowAddModal(false)} onCancel={() => setShowAddModal(false)} />
            </ModalCard>
          </ModalOverlay>
        )}

        {showFilters && (
          <Dropdown ref={dropdownRef}>
            <FilterBox>
              <CategoryList>
                {(
                  (initialCategoriesTree && initialCategoriesTree.length) ? initialCategoriesTree : categoriesTree
                ).map(catObj => (
                  <CategoryItem key={catObj.categoria}>
                      <CategoryHeader onClick={() => toggleCategory(catObj.categoria)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{getCategoryIcon(catObj.categoria)}</span>
                          <div>{catObj.categoria}</div>
                        </div>
                        <div>{expandedCats.has(catObj.categoria) ? '▾' : '▸'}</div>
                      </CategoryHeader>
                    {expandedCats.has(catObj.categoria) && (
                      <SubList>
                        {catObj.subcategorias.length === 0 && <SubItem className="empty">(sin subcategorías)</SubItem>}
                        {catObj.subcategorias.map(sub => (
                          <SubItem key={sub} onClick={() => onSelectSubcategory(catObj.categoria, sub)}>
                            <span className="icon">•</span>
                            <span>{sub}</span>
                          </SubItem>
                        ))}
                      </SubList>
                    )}
                  </CategoryItem>
                ))}
              </CategoryList>

              <Row>
                <label>Buscar</label>
                <input placeholder="Texto" value={query} onChange={(e) => onSearchChange(e.target.value)} />
              </Row>

              <Row>
                <label>Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Todas</option>
                    {((initialCategories && initialCategories.length) ? initialCategories : categories).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Row>

              <Row>
                <label><input type="checkbox" checked={petFriendly} onChange={(e) => setPetFriendly(e.target.checked)} /> Apto para mascotas</label>
              </Row>

              <Row>
                <label><input type="checkbox" checked={kidsFriendly} onChange={(e) => setKidsFriendly(e.target.checked)} /> Apto para niños</label>
              </Row>

              <Buttons>
                <button onClick={() => { applyFilters(); setShowFilters(false); }}>Buscar</button>
                <button className="secondary" onClick={() => { resetFilters(); setShowFilters(false); }}>Restablecer</button>
              </Buttons>
            </FilterBox>
          </Dropdown>
        )}

        <div id="huilapp-map" style={{ height: '100%', width: '100%' }} />

      </MapWrapper>
    </PageContainer>
  );
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const PageContainer = styled.div`
  display: flex;
  height: calc(100vh - 48px);
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index: 9999;
`;

const ModalCard = styled.div`
  width: 720px;
  max-width: 95%;
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.18);
`;

const SidePanel = styled.aside`
  width: 360px;
  background: #fff;
  border-right: 1px solid #e6e6e6;
  padding: 18px;
  overflow-y: auto;
`;

const SiteList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Empty = styled.div`
  color: #777;
  padding: 8px 0;
`;

const MapWrapper = styled.div`
  flex: 1;
  height: 100%;
`;



const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  label { font-size: 13px; color: #333; }
  select, input[type="text"], input[type="search"], input { padding: 8px; border-radius: 6px; border: 1px solid #e6e6e6; }
`;

const SearchRow = styled(Row)`
  input { width: 100%; }
`;

const Buttons = styled.div`
  display:flex;
  gap:8px;
  margin-top:10px;
  button { padding:8px 12px; border-radius:8px; border: none; cursor: pointer; background:#0b9f88; color:#fff }
  button.secondary { background:transparent; color:#0b9f88; border:1px solid #0b9f88 }
`;

const Header = styled.div`
  display:flex;
  align-items:center;
  gap:12px;
  padding-bottom:12px;
  border-bottom:1px solid #f0f0f0;
`;

const Logo = styled.div`
  background: #0b9f88;
  color: #fff;
  font-weight:700;
  padding:8px 12px;
  border-radius: 8px;
  font-size:14px;
`;

const HeaderTitle = styled.div`
  font-size:18px;
  font-weight:600;
`;

const Thumb = styled.div`
  width:64px;
  height:64px;
  border-radius:8px;
  overflow:hidden;
  background:#f2f2f2;
  flex: 0 0 64px;
  img { width:100%; height:100%; object-fit:cover }
  .placeholder { width:100%; height:100%; background: linear-gradient(90deg,#f6f6f6,#efefef); }
`;

// SiteItem layout update
const SiteItem = styled.button`
  display:flex;
  gap:12px;
  align-items:center;
  padding:10px;
  background:#fff;
  border:1px solid #eee;
  border-radius:10px;
  cursor:pointer;
  text-align:left;
  .meta { flex:1 }
  .title { font-weight:600; font-size:14px }
  .sub { font-size:12px; color:#777; margin-top:4px }
`;

const RegisterButton = styled.button`
  position: absolute;
  z-index: 400;
  background: #0b9f88;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(11,159,136,0.12);
  cursor: pointer;
`;

const PlusCircle = styled.span`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:28px;
  height:28px;
  background: rgba(255,255,255,0.2);
  border-radius:50%;
  margin-right:8px;
  font-weight:700;
`;

const ControlsBar = styled.div`
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 450;
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(255,255,255,0.95);
  padding: 8px 12px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);

  @media (min-width: 1024px) {
    /* reduce left gap from sidebar and add top spacing on desktop */
    top: 34px;
    left: 300px; /* sidebar width (260) + gap (~40px) */
    transform: none;
  }
`;

const AddSiteButton = styled(RegisterButton)`
  top: 86px; /* slightly lower to sit under controls */
  left: 50%;
  transform: translateX(calc(-50% - 120px));
  display: inline-flex;
  align-items: center;
  gap: 8px;
  z-index: 520; /* ensure it's above controls and map layers */
  background: #0b9f88;
  color: white;
  padding: 8px 12px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(11,159,136,0.18);

  @media (min-width: 1024px) {
    /* align under the adjusted ControlsBar on desktop */
    top: 108px;
    left: 300px;
    transform: none;
  }
`;

const SearchInput = styled.input`
  width: 480px;
  padding: 10px 12px;
  border-radius: 18px;
  border: 1px solid #e6e6e6;
  outline: none;
`;

const FiltersInline = styled.div`
  display:flex;
  gap:8px;
  align-items:center;
  select { padding:8px; border-radius:8px; border:1px solid #e6e6e6 }
  label.small { font-size:13px; display:flex; align-items:center; gap:6px }
  button { padding:8px 10px; border-radius:8px; border:none; background:#0b9f88; color:#fff; cursor:pointer }
  button.secondary { background:transparent; color:#0b9f88; border:1px solid #0b9f88 }
`;

const FilterToggle = styled.button`
  width:40px;
  height:40px;
  border-radius:999px;
  border:none;
  background:#0b9f88;
  box-shadow:0 6px 16px rgba(0,0,0,0.06);
  display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:700; color: #fff;
  svg { width:18px; height:18px }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 460;
  width: 360px;
  max-height: 60vh;
  overflow: auto;
  background: transparent;
`;

const SearchWrapper = styled.div`
  display:flex;
  align-items:center;
  gap:8px;
  background: #fff;
  padding:4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
`;

const SearchIcon = styled.div`
  padding-left: 6px;
  color: #6b6b6b;
`;

const SearchBtn = styled.button`
  background: #0b9f88;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 14px;
  cursor: pointer;
  font-weight:600;
`;

// tweak dropdown card to look like mockup
const FilterBox = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  padding: 12px;
`;



const CategoryList = styled.div`
  background: #fff;
  border: 1px solid #e7eaec;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 10px;
`;

const CategoryItem = styled.div`
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none }
`;

const CategoryHeader = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:8px 6px;
  cursor:pointer;
  font-weight:600;
`;

const SubList = styled.div`
  padding: 6px 6px 12px 6px;
  display:flex;
  flex-direction:column;
  gap:6px;
`;

const SubItem = styled.button`
  text-align:left;
  padding:8px 10px;
  border-radius:8px;
  border:none;
  background: #fff;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap:10px;
  &:hover { background:#f6f7f8 }
  &.empty { color:#888; font-style:italic }
  span.icon { width:22px; text-align:center }
`;
