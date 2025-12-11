// src/services/corcisaAPI.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://corcisa.com.ar/api/v1/productos";

// ================================
// 🔵 CACHE EN MEMORIA
// ================================
let corcisaCache = [];
let lastCacheTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

// ================================
// 🔵 SEGURIDAD: validar credenciales
// ================================
function validateCredentials() {
  if (!process.env.CORCISA_USER_ID || !process.env.CORCISA_TOKEN) {
    console.error("❌ Corcisa → Credenciales faltantes en .env");
    return false;
  }
  return true;
}

// ================================
// 🔵 FETCH DE UNA SOLA PÁGINA (con error handling)
// ================================
async function fetchCorcisaPage(offset = 0) {
  try {
    const body = {
      user_id: process.env.CORCISA_USER_ID,
      token: process.env.CORCISA_TOKEN,
    };

    const params = { limit: 100, offset };

    console.log(`🔵 [Corcisa] Descargando página offset=${offset}`);

    const res = await axios.post(BASE_URL, body, { params });

    return Array.isArray(res.data?.resultado) ? res.data.resultado : [];

  } catch (err) {
    console.error("❌ Error Corcisa (fetchCorcisaPage):", err.message);
    return [];
  }
}

// ================================
// 🔵 DESCARGA COMPLETA DEL CATÁLOGO
// ================================
async function fetchFullCatalog() {
  console.log("🔵 [Corcisa] Descargando catálogo completo...");

  if (!validateCredentials()) return [];

  let all = [];
  let offset = 0;
  let page = [];

  do {
    page = await fetchCorcisaPage(offset);
    all = all.concat(page);
    offset += 100;
  } while (page.length === 100);

  console.log("🔵 [Corcisa] Total productos descargados:", all.length);

  corcisaCache = all;
  lastCacheTime = Date.now();

  return all;
}

// ================================
// 🔵 FUNCIÓN PRINCIPAL CON CACHE
// ================================
export async function fetchProductsFromCorcisa(query = "") {
  const now = Date.now();

  // Refrescar cache si expiró
  if (!lastCacheTime || now - lastCacheTime > CACHE_TTL || corcisaCache.length === 0) {
    await fetchFullCatalog();
  }

  // Si sigue vacío → error de token o de API
  if (corcisaCache.length === 0) {
    console.warn("⚠️ [Corcisa] Catálogo vacío. Verificar token o API.");
    return [];
  }

  if (!query) return corcisaCache;

  const q = query.toLowerCase();

  const filtered = corcisaCache.filter((p) => {
    return (
      p.nombre?.toLowerCase().includes(q) ||
      p.codigo_producto?.toLowerCase() === q ||
      p.codigo_producto?.toLowerCase().includes(q) ||
      p.codigo_alfa?.toLowerCase().includes(q)
    );
  });

  console.log(`🔵 [Corcisa] Filtrados por '${query}': ${filtered.length}`);

  return filtered;
}
