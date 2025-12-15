// src/services/nucleoAPI.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const LOGIN_URL = "https://api.gruponucleosa.com/Authentication/Login";
const CATALOG_URL = "https://api.gruponucleosa.com/API_V1/GetCatalog";

// ================================
// 🔵 LOGIN DIRECTO (SIN CACHE)
// ================================
async function loginNucleo() {
  try {
    const body = {
      id: Number(process.env.NUCLEO_ID),
      username: process.env.NUCLEO_USER,
      password: process.env.NUCLEO_PASSWORD,
    };

    const res = await axios.post(LOGIN_URL, body);
    return res.data; // token directo
  } catch (err) {
    console.error("❌ Núcleo login error:", err.response?.data || err.message);
    return null;
  }
}

// ================================
// 🔵 DETECCIÓN SIMPLE DE SKU
// ================================
function looksLikeSku(q = "") {
  const t = q.trim();
  return t && !t.includes(" ") && /\d/.test(t);
}

// ================================
// 🔵 NORMALIZACIÓN DE TEXTO
// ================================
function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/notebook|laptop|portátil/g, "note")
    .replace(/\bnb\b/g, "note");
}

// ================================
// 🔵 BÚSQUEDA PRINCIPAL
// ================================
export async function fetchProductsFromNucleo(query = "") {
  try {
    const token = await loginNucleo();
    if (!token) return [];

    const res = await axios.get(CATALOG_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let products = Array.isArray(res.data) ? res.data : [];

    if (!query) return products;

    const trimmed = query.trim();
    const q = normalize(trimmed);
    const isSkuSearch = looksLikeSku(trimmed);

    console.log(
      `🔵 [Núcleo] Buscando "${trimmed}" como ${isSkuSearch ? "SKU" : "nombre"}`
    );

    products = products.filter((p) => {
      const name = normalize(p.item_desc_0 || "");
      const partNumber = (p.partNumber || "").toLowerCase();

      // 🔍 SKU → partNumber
      if (isSkuSearch) {
        return (
          partNumber === q ||
          partNumber.includes(q)
        );
      }

      // 🔍 Nombre → mínimo 3 caracteres
      if (q.length < 3) return false;
      return name.includes(q);
    });

    console.log(`🔵 [Núcleo] Resultados: ${products.length}`);
    return products;

  } catch (err) {
    console.error(
      "❌ Error consultando Núcleo:",
      err.response?.data || err.message
    );
    return [];
  }
}
