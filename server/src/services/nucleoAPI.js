// src/services/nucleoAPI.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const LOGIN_URL = "https://api.gruponucleosa.com/Authentication/Login";
const CATALOG_URL = "https://api.gruponucleosa.com/API_V1/GetCatalog";

// Cache interno del token
let cachedToken = null;
let tokenExpiration = null;

// Obtener nuevo token
async function getNucleoToken() {
  try {
    const body = {
      id: Number(process.env.NUCLEO_ID),
      username: process.env.NUCLEO_USER,
      password: process.env.NUCLEO_PASSWORD,
    };

    console.log("🟦 Núcleo → Solicitando token...");

    const res = await axios.post(LOGIN_URL, body);

    cachedToken = res.data; // respuesta FULL es el token en string
    tokenExpiration = Date.now() + 14 * 60 * 1000; // 14 min (1 min antes de expirar)

    return cachedToken;

  } catch (err) {
    console.error("❌ Error obteniendo token Núcleo:", err.response?.data || err.message);
    return null;
  }
}

// Obtener token vigente (o regenerarlo)
async function getValidToken() {
  if (!cachedToken || Date.now() > tokenExpiration) {
    return await getNucleoToken();
  }
  return cachedToken;
}

// Consulta principal del catálogo
export async function fetchProductsFromNucleo(query = "") {
  try {
    const token = await getValidToken();
    if (!token) return [];

    const res = await axios.get(CATALOG_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let products = res.data || [];

    if (!query) return products;

    const q = query.toLowerCase();

    // Filtrado manual EXACTO igual que Corcisa
    products = products.filter((p) => {
      return (
        p.item_desc_0?.toLowerCase().includes(q) ||
        p.item_desc_1?.toLowerCase().includes(q) ||
        p.partNumber?.toLowerCase().includes(q) ||
        p.marca?.toLowerCase().includes(q) ||
        p.codigo?.toLowerCase().includes(q) ||
        p.ean?.toLowerCase().includes(q)
      );
    });

    return products;

  } catch (err) {
    console.error("❌ Error consultando Núcleo:", err.response?.data || err.message);
    return [];
  }
}
