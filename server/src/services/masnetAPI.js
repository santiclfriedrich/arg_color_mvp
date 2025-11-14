// src/services/masnetAPI.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MASNET_BASE_URL = "https://masnet.com.ar/api/v1/productos";

/**
 * 🔹 Busca productos de Masnet (por nombre o código)
 */
export async function fetchProductsFromMasnet(query = "") {
  const { MASNET_USER_ID, MASNET_TOKEN } = process.env;

  if (!MASNET_USER_ID || !MASNET_TOKEN) {
    console.error("❌ Faltan credenciales MASNET_USER_ID o MASNET_TOKEN en .env");
    return [];
  }

  const body = {
    user_id: MASNET_USER_ID.trim(),
    token: MASNET_TOKEN.trim(),
    limit: 100,
    offset: 0,
  };

  if (query) {
    if (/^[A-Za-z0-9\-]+$/.test(query)) {
      body.codigo_producto = query;
    } else {
      body.nombre = query;
    }
  }

  console.log("🟡 Masnet → Enviando body:", body);

  try {
    const res = await axios.post(MASNET_BASE_URL, body, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://masnet.com.ar",
        "Referer": "https://masnet.com.ar/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 10000,
    });

    console.log("📬 Status:", res.status);
    console.log("🔑 Keys:", Object.keys(res.data || {}));

    if (Array.isArray(res.data?.resultado)) {
      console.log(`✅ Masnet devolvió ${res.data.resultado.length} productos`);
      return res.data.resultado;
    } else {
      console.warn("⚠️ Masnet no devolvió productos válidos:", res.data);
      return [];
    }
  } catch (err) {
    console.error("❌ Error Masnet:", err.response?.data || err.message);
    return [];
  }
}
