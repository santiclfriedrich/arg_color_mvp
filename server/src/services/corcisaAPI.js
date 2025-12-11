// src/services/corcisaAPI.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://corcisa.com.ar/api/v1/productos";

// Corcisa necesita paginado manual
async function fetchCorcisaPage(offset = 0) {
  const body = {
    user_id: process.env.CORCISA_USER_ID,
    token: process.env.CORCISA_TOKEN,
  };

  const params = { limit: 100, offset };

  const res = await axios.post(BASE_URL, body, { params });

  return res.data?.resultado || [];
}

export async function fetchProductsFromCorcisa(query = "") {
  console.log("🔵 [Corcisa] Buscando:", query);

  try {
    let allProducts = [];
    let offset = 0;
    let page;

    // DESCARGAR TODO EL CATALOGO
    do {
      page = await fetchCorcisaPage(offset);
      allProducts = allProducts.concat(page);
      offset += 100;
    } while (page.length === 100);

    console.log("🔵 [Corcisa] Total productos descargados:", allProducts.length);

    if (!query) return allProducts;

    const q = query.toLowerCase();

    // FILTRO LOCAL (porque el API NO soporta nombre)
    const filtered = allProducts.filter((p) => {
      return (
        p.nombre?.toLowerCase().includes(q) ||
        p.codigo_producto?.toLowerCase() === q ||
        p.codigo_producto?.toLowerCase().includes(q)
      );
    });

    console.log("🔵 [Corcisa] Resultados filtrados:", filtered.length);

    return filtered;

  } catch (err) {
    console.error("❌ Error Corcisa:", err.response?.data || err.message);
    return [];
  }
}
