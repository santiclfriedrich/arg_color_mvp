// src/services/corcisaAPI.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://corcisa.com.ar/api/v1/productos";

/**
 * Detecta si el query parece un SKU
 * Regla simple (igual a Elit):
 * - no espacios
 * - al menos un número
 */
function isSku(query = "") {
  const q = query.trim();
  return (
    q &&
    !q.includes(" ") &&
    /[0-9]/.test(q) &&
    /[A-Z0-9/-]/i.test(q)
  );
}


/**
 * 🔵 Búsqueda en Corcisa
 * - Sin cache
 * - POST correcto
 * - SKU → codigo_producto
 * - Nombre → nombre
 */
export async function fetchProductsFromCorcisa(query = "") {
  try {
    const { CORCISA_USER_ID, CORCISA_TOKEN } = process.env;

    if (!CORCISA_USER_ID || !CORCISA_TOKEN) {
      console.error("❌ Corcisa → Falta USER_ID o TOKEN");
      return [];
    }

    const trimmed = query.trim();

    // ----------------------------
    // 🔵 Query params (filtros)
    // ----------------------------
    const params = {
      limit: 100,
      offset: 0,
    };

    if (trimmed) {
      if (isSku(trimmed)) {
        params.codigo_producto = trimmed;
      } 
    }


    // ----------------------------
    // 🔵 Body de autenticación
    // ----------------------------
    const body = {
      user_id: CORCISA_USER_ID,
      token: CORCISA_TOKEN,
    };

    console.log("🔵 [Corcisa] POST filtros →", params);

    const res = await axios.post(BASE_URL, body, { params });

    const results = Array.isArray(res.data?.resultado)
      ? res.data.resultado
      : [];

    console.log(`🔵 [Corcisa] Resultados: ${results.length}`);

    return results;

  } catch (err) {
    console.error(
      "❌ Error Corcisa:",
      err.response?.data || err.message
    );
    return [];
  }
}
