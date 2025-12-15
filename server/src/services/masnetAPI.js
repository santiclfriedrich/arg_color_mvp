// src/services/masnetAPI.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Detecta si el query parece un SKU
 * Regla simple y consistente:
 * - no espacios
 * - al menos un número
 */
function isSku(query = "") {
  const q = query.trim();
  return q && !q.includes(" ") && /\d/.test(q);
}

/**
 * 🔵 Búsqueda en Masnet
 * - Sin cache
 * - POST correcto
 * - SKU → codigo_producto
 * - Nombre → nombre (mínimo 3 caracteres)
 */
export async function fetchProductsFromMasnet(query = "") {
  try {
    const { MASNET_USER_ID, MASNET_TOKEN, MASNET_URL } = process.env;

    if (!MASNET_USER_ID || !MASNET_TOKEN || !MASNET_URL) {
      console.error("❌ Masnet → Faltan credenciales o URL");
      return [];
    }

    const trimmed = query.trim();

    // ----------------------------
    // 🔵 Body base
    // ----------------------------
    const body = {
      user_id: MASNET_USER_ID,
      token: MASNET_TOKEN,
      limit: 100,
      offset: 0,
    };

    // ----------------------------
    // 🔵 Filtro por SKU o nombre
    // ----------------------------
    if (trimmed) {
      if (isSku(trimmed)) {
        body.codigo_producto = trimmed;
      } else if (trimmed.length >= 3) {
        body.nombre = trimmed;
      }
    }

    console.log("🔵 [Masnet] POST filtros →", body);

    const res = await axios.post(MASNET_URL, body);

    const results = Array.isArray(res.data?.resultado)
      ? res.data.resultado
      : [];

    console.log(`🔵 [Masnet] Resultados: ${results.length}`);

    return results;

  } catch (err) {
    console.error(
      "❌ Error Masnet:",
      err.response?.data || err.message
    );
    return [];
  }
}
