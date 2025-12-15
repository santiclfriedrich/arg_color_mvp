// src/services/elitAPI.js
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const BASE_URL = "https://clientes.elit.com.ar/v1/api";

/**
 * Detecta si el query parece un SKU
 * Regla simple y efectiva:
 * - no espacios
 * - tiene al menos un número
 */
function isSku(query = "") {
  const q = query.trim();
  return q && !q.includes(" ") && /\d/.test(q);
}

// =======================================================
// 🔎 BÚSQUEDA GENERAL (SKU o nombre)
// =======================================================
export async function fetchProductsFromElit(query = "") {
  const { ELIT_USER_ID, ELIT_TOKEN } = process.env;

  const params = new URLSearchParams();
  params.set("limit", "100");

  if (query) {
    if (isSku(query)) {
      params.set("codigo_producto", query.trim());
    } else {
      params.set("nombre", query.trim());
    }
  }

  const url = `${BASE_URL}/productos?${params.toString()}`;

  const body = {
    user_id: Number(ELIT_USER_ID),
    token: ELIT_TOKEN.trim(),
  };

  try {
    console.log("🔵 [Elit] URL:", url);

    const res = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
    });

    return Array.isArray(res.data?.resultado)
      ? res.data.resultado
      : [];

  } catch (err) {
    console.error(
      "❌ Error Elit:",
      err.response?.data || err.message
    );
    return [];
  }
}

// =======================================================
// 🔍 BÚSQUEDA EXACTA POR SKU (para /products/:sku)
// =======================================================
export async function fetchProductBySkuFromElit(sku) {
  const { ELIT_USER_ID, ELIT_TOKEN } = process.env;

  const url = `${BASE_URL}/productos?limit=100&codigo_producto=${encodeURIComponent(sku)}`;

  const body = {
    user_id: Number(ELIT_USER_ID),
    token: ELIT_TOKEN.trim(),
  };

  try {
    const res = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
    });

    const products = res.data?.resultado || [];
    return products.length > 0 ? products[0] : null;

  } catch (err) {
    console.error(
      "❌ Error SKU Elit:",
      err.response?.data || err.message
    );
    return null;
  }
}
