import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import apiService from '../../services/api.service';
import authService from '../../services/auth.service';
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
  const routeLayerRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const [directionsLoading, setDirectionsLoading] = useState(false);
  const [directionsInfo, setDirectionsInfo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const userMarkerRef = useRef(null);

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

  // Try to obtain browser geolocation on mount and center the map there
  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    let mounted = true;
    const onSuccess = (pos) => {
      if (!mounted) return;
      try {
        const { latitude, longitude } = pos.coords;
        // prefer user's location as initial center
        setCenter([latitude, longitude]);
      } catch (e) {
        // ignore
      }
    };
    const onError = (err) => {
      // swallow errors, keep fallback/derived center
      try { console.warn('Geolocation error', err); } catch (e) {}
    };

    try {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 7000,
      });
    } catch (e) {}

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

    // if currentPosition was set before map was initialized, add marker now
    if (currentPosition && mapRef.current && !userMarkerRef.current) {
      try {
        userMarkerRef.current = L.circleMarker([currentPosition.latitude, currentPosition.longitude], { radius: 7, color: '#0b9f88', fillColor:'#0b9f88', fillOpacity:1 }).addTo(mapRef.current);
      } catch (e) {}
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

  // global styles for site tooltip (map labels)
  useEffect(() => {
    const id = 'huilapp-site-tooltip-style';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.innerHTML = `.site-tooltip { background: rgba(255,255,255,0.95); color: #222; border-radius:6px; padding:4px 8px; font-weight:600; box-shadow:0 6px 18px rgba(0,0,0,0.12); border:1px solid rgba(0,0,0,0.06); }`;
    document.head.appendChild(s);
  }, []);

  // small hover/mouseover styles for detail buttons and interactive controls
  useEffect(() => {
    const id = 'huilapp-detail-btn-style';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.innerHTML = `
      .huil-btn-hover { transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease; }
      .huil-btn-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 26px rgba(11,159,136,0.08); }
      .huil-btn-hover:active { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(11,159,136,0.06); }
      .huil-btn-hover.danger:hover { box-shadow: 0 8px 18px rgba(0,0,0,0.06); }
    `;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    // update markers when sites change
    const group = markersGroupRef.current;
    if (!group) return;
    group.clearLayers();

    sites.forEach(site => {
      if (!site.latitud || !site.longitud) return;
      const marker = L.marker([site.latitud, site.longitud], { icon: getIconForSite(site) });
      // remove in-map popup: we now show details in the right-side panel
      marker.on('click', () => setSelected(site));
      // show permanent label with site name for clarity
      try {
        const title = site.nombre || site.name || '';
        if (title) marker.bindTooltip(title, { permanent: true, direction: 'top', className: 'site-tooltip' });
      } catch (e) {}
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
      try {
        // center on the site; after layout changes (panel open) invalidate size
        mapRef.current.setView([selected.latitud, selected.longitud], 14);
        // pan slightly to the left so the marker remains visible under the overlay panel
        setTimeout(() => {
          try { mapRef.current.panBy([-180, 0]); } catch (e) {}
          try { mapRef.current.invalidateSize(); } catch (e) {}
        }, 260);
      } catch (e) {}
    }
  }, [selected]);

  // clear route when panel closed or selected changes
  useEffect(() => {
    if (!selected) clearRoute();
  }, [selected]);

  // Draw route from user's current location to the selected site
  function clearRoute() {
    try {
      if (routeLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(routeLayerRef.current);
      }
    } catch (e) {}
    routeLayerRef.current = null;
  }

  function showRouteOnMap(originLatLng, destLatLng) {
    try {
      clearRoute();
      if (!mapRef.current) return;
      const latlngs = [ [originLatLng.latitude, originLatLng.longitude], [destLatLng[0], destLatLng[1]] ];
      const poly = L.polyline(latlngs, { color: '#0b9f88', weight: 5, opacity: 0.9 }).addTo(mapRef.current);
      routeLayerRef.current = poly;
      const bounds = poly.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    } catch (e) {
      console.warn('Error drawing route', e);
    }
  }

  // Request a driving route from OSRM (public demo server) and draw it
  async function requestRoute(origin, destLatLng) {
    // origin: { latitude, longitude }
    // destLatLng: [lat, lng]
    setDirectionsLoading(true);
    setDirectionsInfo(null);
    try {
      const originStr = `${origin.longitude},${origin.latitude}`; // lon,lat
      const destStr = `${destLatLng[1]},${destLatLng[0]}`; // lon,lat
      const url = `https://router.project-osrm.org/route/v1/driving/${originStr};${destStr}?overview=full&geometries=geojson`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('OSRM route request failed');
      const data = await resp.json();
      if (!data || !data.routes || !data.routes.length) throw new Error('No route found');
      const route = data.routes[0];
      const coords = route.geometry && route.geometry.coordinates ? route.geometry.coordinates : null;
      if (!coords) throw new Error('Route geometry missing');
      // convert [lon,lat] -> [lat,lon]
      const latlngs = coords.map(c => [c[1], c[0]]);
      clearRoute();
      const poly = L.polyline(latlngs, { color: '#0b9f88', weight: 6, opacity: 0.95 }).addTo(mapRef.current);
      routeLayerRef.current = poly;
      const bounds = poly.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
      // set info (distance in meters, duration seconds) if available
      setDirectionsInfo({ distance: route.distance || 0, duration: route.duration || 0 });
    } catch (e) {
      console.warn('Routing error', e);
      // fallback: draw straight line
      try { showRouteOnMap(origin, destLatLng); } catch (ee) {}
      throw e;
    } finally {
      setDirectionsLoading(false);
    }
  }

  function openGoogleMapsDirections(origin, dest) {
    const originParam = `${origin.latitude},${origin.longitude}`;
    const destParam = `${dest[0]},${dest[1]}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originParam)}&destination=${encodeURIComponent(destParam)}&travelmode=driving`;
    window.open(url, '_blank');
  }

  function handleComoLlegar() {
    if (!selected || !selected.latitud || !selected.longitud) return alert('Coordenadas del sitio no disponibles');
    if (!('geolocation' in navigator)) return alert('Geolocalización no soportada en este navegador');
    // get current position and request route (OSRM)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const origin = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setCurrentPosition(origin);
      // add/update user marker
      try {
        if (userMarkerRef.current && mapRef.current) {
          mapRef.current.removeLayer(userMarkerRef.current);
        }
        if (mapRef.current) {
          userMarkerRef.current = L.circleMarker([origin.latitude, origin.longitude], { radius: 7, color: '#0b9f88', fillColor: '#0b9f88', fillOpacity: 1 }).addTo(mapRef.current);
        }
      } catch (e) {}
      const dest = [Number(selected.latitud), Number(selected.longitud)];
      try {
        await requestRoute(origin, dest);
      } catch (e) {
        // inform user but keep fallback line drawn
        alert('No se pudo obtener la ruta por calles. Se trazó una línea directa como fallback.');
      }
    }, (err) => {
      try { console.warn('Geolocation error', err); } catch (e) {}
      alert('No se pudo obtener tu ubicación');
    }, { enableHighAccuracy: true, timeout: 10000 });
  }


  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef(null);
  const filterWrapperRef = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const modalPushedRef = useRef(false);
  // close dropdown on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!showFilters) return;
      // keep open when clicking anywhere inside the filter wrapper (toggle + dropdown)
      if (filterWrapperRef.current && filterWrapperRef.current.contains(e.target)) return;
      // otherwise close
      setShowFilters(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [showFilters]);

  // Manage modal history so browser back closes modal instead of navigating away
  useEffect(() => {
    function onPop(e) {
      if (showAddModal) {
        // close modal when user presses back
        closeAddModal(true);
      }
    }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [showAddModal]);

  function openAddModal() {
    setShowAddModal(true);
    try {
      // push a new history entry so back button will trigger popstate
      window.history.pushState({ huilappModal: 'addSite' }, '');
      modalPushedRef.current = true;
    } catch (e) {}
  }

  function closeAddModal(fromPopstate = false) {
    setShowAddModal(false);
    if (modalPushedRef.current && !fromPopstate) {
      // if we pushed a state when opening, go back to remove it
      try { window.history.back(); } catch (e) {}
    }
    modalPushedRef.current = false;
  }

  // state to manage expanded categories in dropdown
  const [expandedCats, setExpandedCats] = useState(new Set());
  const [detailTab, setDetailTab] = useState('summary');
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState('');
  const [editingSaving, setEditingSaving] = useState(false);
  const [deletingReview, setDeletingReview] = useState(null);
  const [deletingSaving, setDeletingSaving] = useState(false);
  const [locating, setLocating] = useState(false);

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

  // Helper to get stable site id
  function getSiteId(site) {
    return site?.id || site?.id_sitio || site?._id || site?.idSitio || null;
  }

  // Load reviews when the reviews tab is opened
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (detailTab !== 'reviews' || !selected) return;
      setLoadingReviews(true);
      setReviews([]);
      const siteId = getSiteId(selected);
      if (!siteId) {
        setLoadingReviews(false);
        return;
      }
      const tryPaths = [
        `/resenas/sitio/${siteId}`,
        `/resenas?id_sitio=${siteId}`,
        `/resenas?site=${siteId}`,
        `/sites/${siteId}/reviews`,
        `/reviews?site=${siteId}`,
        `/sites/${siteId}` // fallback: site detail may contain embedded reviews
      ];
      let got = null;
      for (const p of tryPaths) {
        try {
          const resp = await apiService.get(p);
          if (!mounted) return;
          // If we got an array, assume it's reviews
          if (Array.isArray(resp)) { got = resp; break; }
          // If response has data array (axios style)
          if (resp && Array.isArray(resp.data)) { got = resp.data; break; }
          // If resp is an object and contains reviews field
          if (resp && (resp.reviews || resp.reseñas || resp.resenas || resp.resenas_list)) {
            got = resp.reviews || resp.reseñas || resp.resenas || resp.resenas_list; break;
          }
          // If site detail returned, try to extract reviews
          if (resp && resp.fotos !== undefined) {
            // no explicit reviews, continue
            continue;
          }
        } catch (err) {
          // ignore and try next
        }
      }
      if (mounted) {
        // normalize and attach avatars when possible
        let enriched = (got || []).map(r => ({ ...r }));
        try {
          // fetch users once and build map for avatars
          const users = await apiService.get('/users');
          const usersMap = Array.isArray(users) ? users.reduce((m,u) => { m[u.id] = u; return m; }, {}) : {};
          enriched = enriched.map(r => {
            const uid = r.id_usuario || r.userId || r.usuario_id || r.id_usuario_resena;
            const avatar = r.avatar || r.profile_picture || (uid && usersMap[uid] && usersMap[uid].profile_picture) || null;
            return { ...r, avatar };
          });
        } catch (e) {
          // ignore avatar enrichment errors
        }

        setReviews(enriched || []);
        setLoadingReviews(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [detailTab, selected]);

  // Open edit modal for a given review
  function openEditReview(review) {
    if (!review) return;
    const text = review.texto || review.comment || review.comentario || '';
    setEditingReview(review);
    setEditText(text);
  }

  async function saveEditedReview() {
    if (!editingReview) return;
    const id = editingReview.id || editingReview.id_resena || editingReview.id_resena || null;
    if (!id) return alert('ID de reseña inválido');
    setEditingSaving(true);
    try {
      await apiService.put(`/resenas/${id}`, { texto: editText });
      // reload reviews for the current site
      const siteId = getSiteId(selected);
      if (siteId) {
        setLoadingReviews(true);
        try {
          const resp = await apiService.get(`/resenas/sitio/${siteId}`);
          const raw = Array.isArray(resp) ? resp : (resp?.data || resp?.resenas || resp?.reseñas || []);
          // try to enrich avatars
          try {
            const users = await apiService.get('/users');
            const usersMap = Array.isArray(users) ? users.reduce((m,u) => { m[u.id] = u; return m; }, {}) : {};
            const enriched = (raw || []).map(r => {
              const uid = r.id_usuario || r.userId || r.usuario_id;
              const avatar = r.avatar || r.profile_picture || (uid && usersMap[uid] && usersMap[uid].profile_picture) || null;
              return { ...r, avatar };
            });
            setReviews(enriched);
          } catch (e) {
            setReviews(raw || []);
          }
        } catch (e) {
          // ignore
        } finally {
          setLoadingReviews(false);
        }
      }
      setEditingReview(null);
    } catch (err) {
      alert(err.message || 'No se pudo guardar la reseña');
    } finally {
      setEditingSaving(false);
    }
  }

  // Open delete confirmation modal for a review
  function openDeleteReview(review) {
    if (!review) return;
    setDeletingReview(review);
  }

  // Confirm and perform delete
  async function confirmDeleteReview() {
    if (!deletingReview) return;
    const id = deletingReview.id || deletingReview.id_resena || null;
    if (!id) return alert('ID de reseña inválido');
    setDeletingSaving(true);
    try {
      await apiService.delete(`/resenas/${id}`);
      // reload reviews
      const siteId = getSiteId(selected);
      if (siteId) {
        setLoadingReviews(true);
        try {
          const resp = await apiService.get(`/resenas/sitio/${siteId}`);
          const raw = Array.isArray(resp) ? resp : (resp?.data || resp?.resenas || resp?.reseñas || []);
          // try to enrich avatars like elsewhere
          try {
            const users = await apiService.get('/users');
            const usersMap = Array.isArray(users) ? users.reduce((m,u) => { m[u.id] = u; return m; }, {}) : {};
            const enriched = (raw || []).map(r => {
              const uid = r.id_usuario || r.userId || r.usuario_id;
              const avatar = r.avatar || r.profile_picture || (uid && usersMap[uid] && usersMap[uid].profile_picture) || null;
              return { ...r, avatar };
            });
            setReviews(enriched);
          } catch (e) {
            setReviews(raw || []);
          }
        } catch (e) {
          // ignore
        } finally {
          setLoadingReviews(false);
        }
      }
      setDeletingReview(null);
    } catch (err) {
      alert(err.message || 'No se pudo eliminar la reseña');
    } finally {
      setDeletingSaving(false);
    }
  }

  async function submitReview() {
    const siteId = getSiteId(selected);
    if (!siteId) return;
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      const payload = { id_sitio: siteId, calificacion: Number(reviewRating), texto: reviewText.trim() };
      await apiService.post('/resenas', payload);
      // refresh
      setReviewText(''); setReviewRating(5);
      setDetailTab('reviews');
      // reload reviews
      setLoadingReviews(true);
      try {
        const resp = await apiService.get(`/resenas/sitio/${siteId}`);
        // try to enrich avatars after posting
        const raw = Array.isArray(resp) ? resp : (resp?.data || resp?.resenas || resp?.reseñas || []);
        try {
          const users = await apiService.get('/users');
          const usersMap = Array.isArray(users) ? users.reduce((m,u) => { m[u.id] = u; return m; }, {}) : {};
          const enriched = (raw || []).map(r => {
            const uid = r.id_usuario || r.userId || r.usuario_id;
            const avatar = r.avatar || r.profile_picture || (uid && usersMap[uid] && usersMap[uid].profile_picture) || null;
            return { ...r, avatar };
          });
          setReviews(enriched);
        } catch (e) {
          setReviews(raw || []);
        }
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('Error sending review', err);
    } finally {
      setSubmittingReview(false);
      setLoadingReviews(false);
    }
  }

  // Handler for 'Centrarme' button: request current position and center map
  function locateMe() {
    if (!('geolocation' in navigator)) {
      try { console.warn('Geolocation not supported'); } catch (e) {}
      return;
    }
    setLocating(true);
    const onSuccess = (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        setCenter([latitude, longitude]);
        setCurrentPosition({ latitude, longitude });
        try {
          if (userMarkerRef.current && mapRef.current) mapRef.current.removeLayer(userMarkerRef.current);
          if (mapRef.current) {
            userMarkerRef.current = L.circleMarker([latitude, longitude], { radius: 7, color: '#0b9f88', fillColor:'#0b9f88', fillOpacity:1 }).addTo(mapRef.current);
          }
        } catch (e) {}
        if (mapRef.current) {
          try {
            mapRef.current.setView([latitude, longitude], 14);
            // pan a bit so selected panel does not overlap marker (if present)
            setTimeout(() => { try { mapRef.current.panBy([-180, 0]); } catch (e) {} }, 220);
          } catch (e) {}
        }
      } catch (e) {}
      setLocating(false);
    };
    const onError = (err) => {
      try { console.warn('Geolocation error', err); } catch (e) {}
      setLocating(false);
    };
    try {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
    } catch (e) {
      setLocating(false);
    }
  }

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

  // Reviews UI helpers
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    } catch (e) { return dateStr; }
  }

  function renderStars(n) {
    const num = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} filled={i <= num}>★</Star>);
    }
    return <span>{stars}</span>;
  }

  function formatDistance(meters) {
    if (!meters && meters !== 0) return '';
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  }

  function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return '';
    const mins = Math.round(seconds / 60);
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m ? `${h}h ${m}m` : `${h}h`;
    }
    return `${mins} min`;
  }

  // compute total reviews for the selected site (try several possible fields, fall back to loaded `reviews`)
  const totalReviews = (() => {
    if (!selected) return 0;
    // common property names used across backends
    if (Array.isArray(selected.resenas)) return selected.resenas.length;
    if (Array.isArray(selected.reseñas)) return selected.reseñas.length;
    if (Array.isArray(selected.reviews)) return selected.reviews.length;
    if (typeof selected.reseñas_count === 'number') return selected.reseñas_count;
    if (typeof selected.resenas_count === 'number') return selected.resenas_count;
    if (typeof selected.reviews_count === 'number') return selected.reviews_count;
    if (typeof selected.num_reviews === 'number') return selected.num_reviews;
    // fallback to reviews loaded in state
    try { if (Array.isArray(reviews) && reviews.length) return reviews.length; } catch (e) {}
    return 0;
  })();

  return (
    <PageContainer>
      <MapWrapper>
        <ControlsBar>
          <FilterWrapper ref={filterWrapperRef}>
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

            {showFilters && (
              <Dropdown ref={dropdownRef} role="dialog" aria-label="Filtro de sitios">
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

                  <ToggleRow>
                    <ToggleButton active={petFriendly} onClick={() => setPetFriendly(p => !p)} aria-pressed={petFriendly}>
                      <span style={{ fontSize: 18 }}>🐾</span>
                      <div>Apto para mascotas</div>
                    </ToggleButton>
                    <ToggleButton active={kidsFriendly} onClick={() => setKidsFriendly(k => !k)} aria-pressed={kidsFriendly}>
                      <span style={{ fontSize: 18 }}>🧒</span>
                      <div>Apto para niños</div>
                    </ToggleButton>
                  </ToggleRow>

                  <Buttons>
                    <button onClick={() => { applyFilters(); setShowFilters(false); }}>Buscar</button>
                    <button className="secondary" onClick={() => { resetFilters(); setShowFilters(false); }}>Restablecer</button>
                  </Buttons>
                </FilterBox>
              </Dropdown>
            )}

          </FilterWrapper>

            <SearchWrapper>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              placeholder="Buscar por nombre o categoría"
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <SearchBtn aria-label="Buscar" onClick={() => fetchSites({ q: query })}>Buscar</SearchBtn>
          </SearchWrapper>

              <LocateBtn className="huil-btn-hover" onClick={() => locateMe()} aria-label="Centrarme" title="Centrarme">
                {locating ? '⏳' : '📍'}
              </LocateBtn>

        </ControlsBar>

        {/* Registrar sitio: centered under the controls/search bar */}
        {!showFilters && (
          <AddSiteButton onClick={() => openAddModal()}>
            <PlusCircle>+</PlusCircle>
            <span>Registrar un sitio</span>
          </AddSiteButton>
        )}
        {showAddModal && (
          <ModalOverlay onClick={() => closeAddModal()}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <h3>Registrar un sitio</h3>
              <AddSiteForm onSuccess={() => closeAddModal()} onCancel={() => closeAddModal()} />
            </ModalCard>
          </ModalOverlay>
        )}

        

        <div id="huilapp-map" style={{ height: '100%', width: '100%' }} />

        {selected && (
          <DetailPanel role="region" aria-label="Detalle del sitio">
            <DetailHeader>
              <BackBtn className="huil-btn-hover" onClick={() => setSelected(null)}>‹</BackBtn>
              <h3>{selected.nombre || selected.name || 'Sitio'}</h3>
            </DetailHeader>

            <DetailBody>
              {selected.fotos && selected.fotos.length ? (
                <DetailImage src={selected.fotos[0]} alt={selected.nombre || ''} />
              ) : (
                <ImagePlaceholder>No image</ImagePlaceholder>
              )}

              <MetaRow>
                <div className="category">{selected.categoria || ''}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div className="rating">{(selected.avg_rating || selected.rating) ? `${Number(selected.avg_rating || selected.rating).toFixed(1)} ★${totalReviews ? ` (${totalReviews})` : ''}` : ''}</div>
                    <DirectionsButton className="huil-btn-hover" onClick={() => handleComoLlegar()}>Como llegar</DirectionsButton>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13, color: '#444' }}>
                    {directionsLoading ? 'Trazando ruta...' : (directionsInfo ? `${formatDistance(directionsInfo.distance)} · ${formatDuration(directionsInfo.duration)}` : '')}
                  </div>
                </div>
              </MetaRow>

              <Tabs>
                <Tab className="huil-btn-hover" active={detailTab === 'summary'} onClick={() => setDetailTab('summary')}>Resumen</Tab>
                <Tab className="huil-btn-hover" active={detailTab === 'reviews'} onClick={() => setDetailTab('reviews')}>Reseñas</Tab>
              </Tabs>

              {detailTab === 'summary' && (
                <>
                  <Description>{selected.descripcion || selected.description || 'Sin descripción'}</Description>

                  <InfoList>
                    {selected.direccion && <InfoItem>📍 {selected.direccion}</InfoItem>}
                    {selected.telefono && <InfoItem>📞 {selected.telefono}</InfoItem>}
                    <InfoItem>{selected.kids_friendly ? 'Apto para niños' : 'No apto para niños'}</InfoItem>
                    <InfoItem>{selected.pet_friendly ? 'Apto para mascotas' : 'No apto para mascotas'}</InfoItem>
                  </InfoList>
                </>
              )}

              {detailTab === 'reviews' && (
                <div>
                  {/* Review input: moved above the list so user can type without scrolling */}
                  <div style={{ marginTop: 6 }}>
                    <h4 style={{ margin: '6px 0' }}>Escribe una reseña</h4>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ fontWeight:600 }}>Puntuación</label>
                      <StarPicker aria-label="Selecciona la puntuación">
                        {[1,2,3,4,5].map(n => (
                          <StarPickerButton
                            key={n}
                            type="button"
                            aria-label={`${n} estrellas`}
                            onClick={() => setReviewRating(n)}
                            selected={n <= reviewRating}
                          >
                            ★
                          </StarPickerButton>
                        ))}
                      </StarPicker>
                      <div style={{ color: '#666', fontSize: 13 }}>{reviewRating} ★</div>
                    </div>

                    <ReviewForm style={{ maxWidth: 320, width: '100%' }}>
                      <ReviewTextarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Comparte tu experiencia (máx. 500 caracteres)" maxLength={500} />
                      <ReviewButtons>
                        <SecondaryButton type="button" onClick={() => { setReviewText(''); setReviewRating(5); }}>Cancelar</SecondaryButton>
                        <PrimaryButton type="button" onClick={() => submitReview()} disabled={submittingReview}>{submittingReview ? 'Enviando...' : 'Enviar reseña'}</PrimaryButton>
                      </ReviewButtons>
                    </ReviewForm>
                  </div>

                  <hr style={{ margin: '12px 0' }} />

                  <div>
                    {loadingReviews ? (
                      <div> Cargando reseñas... </div>
                    ) : (
                      <div>
                        {reviews.length === 0 ? <div>No hay reseñas aún.</div> : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <ReviewList>
                              {reviews.map((r, idx) => {
                                const id = r.id_resena || r.id || idx;
                                const author = r.autor || r.autor_nombre || r.nombre || 'Anónimo';
                                const rating = Number(r.rating || r.calificacion || r.calif) || 0;
                                const text = r.comment || r.texto || r.comentario || '';
                                const date = formatDate(r.created_at || r.fecha || r.date);
                                  const initials = (author || 'A').split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase();
                                  const avatarUrl = r.avatar || r.profile_picture || null;
                                  // determine if current user is the author
                                  const currentUser = authService.getCurrentUser();
                                  const currentUserId = currentUser ? (currentUser.id || currentUser.userId || currentUser._id) : null;
                                  const reviewUserId = r.id_usuario || r.userId || r.usuario_id || null;
                                  const isOwner = currentUserId && reviewUserId && String(currentUserId) === String(reviewUserId);

                                  return (
                                    <ReviewItem key={id} style={{ width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                                      <Avatar aria-hidden>
                                        {avatarUrl ? <img src={avatarUrl} alt={author} style={{ width:44, height:44, borderRadius:22, objectFit:'cover' }} /> : initials}
                                      </Avatar>
                                      <ReviewContent>
                                        <ReviewHeaderRow>
                                          <AuthorName>{author}</AuthorName>
                                          <DateText>{date}</DateText>
                                        </ReviewHeaderRow>
                                        <StarRow>{renderStars(rating)} <RatingValue>{rating ? `${rating.toFixed(1)} ★` : ''}</RatingValue></StarRow>
                                        {text && <ReviewText>{text}</ReviewText>}
                                          <ReviewActions>
                                            {isOwner ? (
                                              <>
                                                <ActionButton className="huil-btn-hover danger" onClick={() => openDeleteReview({ id, ...r })}>Eliminar</ActionButton>
                                                <ActionButton className="huil-btn-hover" onClick={() => openEditReview(r)}>Editar</ActionButton>
                                              </>
                                            ) : (
                                              <div style={{ color:'#888', fontSize:13 }}>No disponible</div>
                                            )}
                                          </ReviewActions>
                                      </ReviewContent>
                                    </ReviewItem>
                                  );
                              })}
                            </ReviewList>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DetailBody>
          </DetailPanel>
        )}

        {editingReview && (
          <ModalOverlay onClick={() => setEditingReview(null)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <h3>Editar reseña</h3>
              <div style={{ marginTop: 8 }}>
                <ReviewTextarea value={editText} onChange={(e) => setEditText(e.target.value)} maxLength={500} />
                <ReviewButtons style={{ marginTop: 12 }}>
                  <SecondaryButton onClick={() => setEditingReview(null)}>Cancelar</SecondaryButton>
                  <PrimaryButton onClick={() => saveEditedReview()} disabled={editingSaving}>{editingSaving ? 'Guardando...' : 'Guardar'}</PrimaryButton>
                </ReviewButtons>
              </div>
            </ModalCard>
          </ModalOverlay>
        )}

        {deletingReview && (
          <ModalOverlay onClick={() => setDeletingReview(null)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <h3>Eliminar reseña</h3>
              <div style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 12 }}>¿Estás seguro que quieres eliminar esta reseña? Esta acción no se puede deshacer.</div>
                <ReviewButtons>
                  <SecondaryButton onClick={() => setDeletingReview(null)}>Cancelar</SecondaryButton>
                  <PrimaryButton onClick={() => confirmDeleteReview()} disabled={deletingSaving}>{deletingSaving ? 'Eliminando...' : 'Eliminar'}</PrimaryButton>
                </ReviewButtons>
              </div>
            </ModalCard>
          </ModalOverlay>
        )}

      </MapWrapper>
    </PageContainer>
  );
}

// note: delete/edit flows handled inside component via modals



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
  padding: 20px; /* ensure spacing on small screens */
  z-index: 9999;
`;

const ModalCard = styled.div`
  width: 480px;
  max-width: 95%;
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.18);
  max-height: 80vh; /* constrain height so modal stays compact */
  overflow-y: auto; /* enable internal scrolling for long forms */

  /* ensure good spacing on very small screens */
  @media (max-width: 600px) {
    width: 100%;
    max-height: 100vh;
    padding: 12px;
  }
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

const ToggleRow = styled.div`
  display:flex;
  gap:8px;
  margin-top:10px;
`;

const ToggleButton = styled.button`
  display:flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:8px;
  border: 1px solid ${props => props.active ? '#0b9f88' : '#e6e6e6'};
  background: ${props => props.active ? 'linear-gradient(90deg,#0bb39f,#0b9f88)' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  cursor:pointer;
  font-weight:600;
  min-width: 140px;
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

const FilterWrapper = styled.div`
  position: relative; /* dropdown positioned absolutely relative to this */
  display: inline-block;
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
  top: calc(100% + 8px); /* place directly below the filter button */
  left: 0;
  z-index: 560; /* ensure dropdown appears above other floating controls (e.g. AddSiteButton) */
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

const LocateBtn = styled.button`
  margin-left: 8px;
  background: #fff;
  color: #0b9f88;
  border: 1px solid #0b9f88;
  padding: 8px 10px;
  border-radius: 12px;
  cursor: pointer;
  font-weight:700;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:44px;
  height:40px;
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

/* Details panel shown when a site is selected */
const DetailPanel = styled.aside`
  position: fixed;
  right: 40px;
  top:20px; /* below header */
  bottom: 10px;
  width: 360px;
  height: calc(100vh - 56px);
  background: #fff;
  border-radius: 30px; /* panel (no rounded card) */
  box-shadow: -8px 0 24px rgba(0,0,0,0.08);
  z-index: 980;
  overflow: hidden;
  display:flex;
  flex-direction:column;
`;

const DetailHeader = styled.div`
  display:flex; align-items:center; gap:12px; padding:12px 14px; border-bottom:1px solid #f0f0f0;
  h3 { margin:0; font-size:16px }
`;

const BackBtn = styled.button`
  width:36px; height:36px; border-radius:8px; border:none; background:#f3f3f3; cursor:pointer; font-size:22px; line-height:1; display:inline-flex; align-items:center; justify-content:center;
`;

const DetailBody = styled.div`
  padding:12px; overflow:auto; display:flex; flex-direction:column; gap:10px;
`;

const DetailImage = styled.img`
  width:100%; height:160px; object-fit:cover; border-radius:8px; background:#eee;
`;

const ImagePlaceholder = styled.div`
  width:100%; height:160px; border-radius:8px; background:#efefef; display:flex; align-items:center; justify-content:center; color:#888;
`;

const MetaRow = styled.div`
  display:flex; justify-content:space-between; align-items:center; font-weight:600; color:#333;
`;

const DirectionsButton = styled.button`
  padding:8px 10px;
  border-radius:8px;
  border:1px solid #0b9f88;
  background: #fff;
  color: #0b9f88;
  font-weight:700;
  cursor:pointer;
`;

const Tabs = styled.div`display:flex; gap:8px; margin-top:4px;`;
const Tab = styled.div`
  padding:6px 10px;
  border-radius:8px;
  background: ${p => p.active ? '#0b9f88' : '#fff'};
  color: ${p => p.active ? '#fff' : '#333'};
  border: 1px solid #e6e6e6;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(0,0,0,0.06);
    background: ${p => p.active ? '#0b9f88' : '#f8fffb'};
  }
  &:active { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.04); }
`;

const Description = styled.div`font-size:13px; color:#444; line-height:1.4;`;

const InfoList = styled.ul`list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; margin-top:8px;`;
const InfoItem = styled.li`font-size:14px; color:#333;`;

/* Reviews styles */
const ReviewList = styled.div`
  display:flex; flex-direction:column; gap:12px; margin-top:6px; width:100%; overflow-x:hidden;
`;

const ReviewItem = styled.div`
  display:flex; gap:12px; align-items:flex-start; padding:12px; border-radius:10px; background:#fff; border:1px solid #f3f3f3; width:100%; box-sizing:border-box; overflow:hidden;
`;

const Avatar = styled.div`
  width:44px; height:44px; border-radius:50%; background:linear-gradient(180deg,#f6f6f8,#efefef); display:flex; align-items:center; justify-content:center; font-weight:700; color:#444; flex:0 0 44px;
`;

const ReviewContent = styled.div`flex:1; display:flex; flex-direction:column; gap:6px;`;

const ReviewHeaderRow = styled.div`display:flex; justify-content:space-between; align-items:center; gap:8px;`;

const AuthorName = styled.div`font-weight:700; font-size:14px; color:#222;`;
const DateText = styled.div`font-size:12px; color:#888;`;

const StarRow = styled.div`display:flex; align-items:center; gap:8px; font-size:14px;`;
const Star = styled.span`
  color: ${p => p.filled ? '#ffb74d' : '#e6e6e6'}; font-size:16px; line-height:1;
`;
const RatingValue = styled.span`font-size:13px; color:#444; margin-left:6px;`;

const ReviewText = styled.div`font-size:13px; color:#444; line-height:1.4; word-break:break-word;`;

const ReviewActions = styled.div`display:flex; gap:8px; justify-content:flex-end; margin-top:6px;`;
const ActionButton = styled.button`
  padding:6px 10px; border-radius:8px; border:1px solid #e6e6e6; background: ${p => p.className && p.className.includes('danger') ? '#fff' : '#fff'}; color: ${p => p.className && p.className.includes('danger') ? '#e05555' : '#0b9f88'}; cursor:pointer; font-weight:600;
`;

const StarPicker = styled.div`
  display:flex;
  gap:6px;
  align-items:center;
`;

const StarPickerButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  line-height: 1;
  padding: 2px 6px;
  cursor: pointer;
  color: ${p => p.selected ? '#ffb74d' : '#e6e6e6'};
  transition: transform 0.08s ease, color 0.08s ease;
  &:hover { transform: scale(1.12); }
  &:focus { outline: 2px solid rgba(11,159,136,0.18); border-radius:6px }
`;

/* Review form inside detail panel */
const ReviewForm = styled.div`
  display:flex;
  flex-direction:column;
  gap:8px;
  margin-top:6px;
`;

const ReviewTextarea = styled.textarea`
  width:100%;
  max-width:320px;
  min-height:60px;
  max-height:120px;
  padding:10px;
  border-radius:8px;
  border:1px solid #e6e6e6;
  resize:vertical;
  font-size:14px;
  line-height:1.3;
  box-sizing:border-box;
`;

const ReviewButtons = styled.div`
  display:flex;
  gap:8px;
  justify-content:flex-end;
  margin-top:4px;
`;

const SecondaryButton = styled.button`
  padding:8px 12px;
  border-radius:8px;
  border:1px solid #d6eae3;
  background: #fff;
  color: #0b9f88;
  cursor:pointer;
  font-weight:600;
`;

const PrimaryButton = styled.button`
  padding:8px 12px;
  border-radius:8px;
  border:none;
  background: linear-gradient(90deg,#d9f3ee,#bfeee2);
  color: #056a52;
  cursor:pointer;
  font-weight:700;
  box-shadow: 0 6px 14px rgba(11,159,136,0.08);
  &:disabled{ opacity:0.6; cursor:not-allowed }
`;

/* tooltip style for site names on map */
const SiteTooltipStyle = styled.div``;
