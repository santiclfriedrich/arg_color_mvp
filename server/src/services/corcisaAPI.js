// src/services/corcisaAPI.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://corcisa.com.ar/api/v1/productos";

export async function fetchProductsFromCorcisa(query = "") {
  try {
    // 1) Siempre traer la página completa (100 productos)
    const params = { limit: 100, offset: 0 };

    const body = {
      user_id: process.env.CORCISA_USER_ID,
      token: process.env.CORCISA_TOKEN,
    };

    console.log("🟣 Corcisa → Body:", body);
    console.log("🟣 Corcisa → Params:", params);

    const res = await axios.post(BASE_URL, body, { params });

    let products = res.data?.resultado || [];

    if (!query) return products;

    // 2) FILTRO MANUAL (es la clave para que funcione la búsqueda)
    const q = query.toLowerCase();

    products = products.filter((p) => {
      return (
        p.nombre?.toLowerCase().includes(q) ||
        p.marca?.toLowerCase().includes(q) ||
        p.codigo_producto?.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q) ||
        p.categoria?.toLowerCase().includes(q) ||
        p.sub_categoria?.toLowerCase().includes(q)
      );
    });

    return products;
  } catch (err) {
    console.error("❌ Error Corcisa:", err.response?.data || err.message);
    return [];
  }
}
