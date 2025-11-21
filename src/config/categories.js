// Canonical categories and subcategories used by the web app.
// Keep this list synchronized with the mobile config or backend.
const CATEGORIES = [
  {
    id: 'hotels',
    name: 'Hoteles y alojamiento',
    subcategories: ['Hotel', 'Hostal', 'Motel', 'Apartamento turístico']
  },
  {
    id: 'food',
    name: 'Comida y bebida',
    subcategories: ['Restaurante', 'Cafetería', 'Bar', 'Pizzería']
  },
  {
    id: 'shopping',
    name: 'Compras',
    subcategories: ['Supermercado', 'Farmacia', 'Librería']
  },
  {
    id: 'tourism',
    name: 'Sitios turísticos',
    subcategories: ['Monumento', 'Museo', 'Plaza']
  }
];

export default CATEGORIES;
