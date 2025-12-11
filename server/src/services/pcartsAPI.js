// src/services/pcartsAPI.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.PCARTS_URL || "https://api.pcarts.com/operations";
const TOKEN = process.env.PCARTS_TOKEN;

// -------------------------------
// Operación 1005 → Catálogo (sku_desc, brand, imágenes, IVA, etc.)
// -------------------------------
async function fetchPcartsCatalog() {
  const headers = {
    "content-type": "application/json",
    "x-session-token": TOKEN,
    operation: "1005",
  };

  const params = {
    offset: 0,
    limit: 5000, // traemos bastante y filtramos nosotros
  };

  try {
    const res = await axios.get(BASE_URL, { headers, params });
    return Array.isArray(res.data?.Products) ? res.data.Products : [];
  } catch (err) {
    console.error("❌ PCArts 1005 (Catálogo) error:", err.response?.data || err.message);
    return [];
  }
}

// -------------------------------
// Operación 1004 → Stock + Precio
// -------------------------------
async function fetchPcartsStock() {
  const headers = {
    "content-type": "application/json",
    "x-session-token": TOKEN,
    operation: "1004",
  };

  const params = {
    offset: 0,
    limit: 5000,
  };

  try {
    const res = await axios.get(BASE_URL, { headers, params });
    return Array.isArray(res.data?.Products) ? res.data.Products : [];
  } catch (err) {
    console.error("❌ PCArts 1004 (Stock) error:", err.response?.data || err.message);
    return [];
  }
}

// -------------------------------
// FUNCIÓN PRINCIPAL
// Unifica Catálogo (1005) + Stock (1004)
// y permite buscar por sku (código) o sku_desc (nombre)
// -------------------------------
export async function fetchProductsFromPcarts(query = "") {
  try {
    console.log("🔵 PCArts → consultando 1004 + 1005...");

    const [catalog, stock] = await Promise.all([
      fetchPcartsCatalog(),
      fetchPcartsStock(),
    ]);

    console.log(
      `🔵 PCArts → Catálogo: ${catalog.length}, Stock: ${stock.length}`
    );

    // Indexamos stock/precio por SKU
    const stockMap = new Map();
    for (const s of stock) {
      if (!s?.sku) continue;
      stockMap.set(s.sku, {
        price: Number(s.price) || 0,
        stock: Number(s.stock) || 0,
        sku_date_updated: s.sku_date_updated || null,
      });
    }

    // Unificamos tomando como base el catálogo
    let unified = catalog.map((c) => {
      const sInfo = stockMap.get(c.sku) || {};
      return {
        ...c, // sku, sku_desc, brand_desc, tax_iva_rate, images, etc.
        price: sInfo.price ?? 0,
        stock: sInfo.stock ?? 0,
        sku_date_updated: sInfo.sku_date_updated ?? null,
      };
    });

    // Si no hay query, devolvemos todo
    if (!query) return unified;

    const q = query.toLowerCase();

    // Búsqueda por código (sku) o por nombre (sku_desc)
    unified = unified.filter((p) => {
      return (
        p.sku?.toLowerCase().includes(q) ||
        p.sku_desc?.toLowerCase().includes(q)
      );
    });

    return unified;
  } catch (err) {
    console.error("❌ Error general PCArts:", err.response?.data || err.message);
    return [];
  }
}

// src/services/pcartsAPI.js

export async function fetchProductBySkuFromPcarts(sku) {
  try {
    const headersCatalog = {
      "content-type": "application/json",
      "x-session-token": TOKEN,
      operation: "1005",
    };
    const headersStock = {
      "content-type": "application/json",
      "x-session-token": TOKEN,
      operation: "1004",
    };

    const params = {
      offset: 0,
      limit: 100,
      sku: sku, // PCArts filtra por SKU exacto
    };

    // 1005 → catálogo
    const catRes = await axios.get(BASE_URL, {
      headers: headersCatalog,
      params,
    });

    const catalog = Array.isArray(catRes.data?.Products)
      ? catRes.data.Products
      : [];

    // Si no existe en catálogo → no existe
    if (catalog.length === 0) return null;

    const product = catalog[0];

    // 1004 → stock + precio del mismo SKU
    const stockRes = await axios.get(BASE_URL, {
      headers: headersStock,
      params,
    });

    const stockList = Array.isArray(stockRes.data?.Products)
      ? stockRes.data.Products
      : [];

    const stock = stockList[0] || {};

    return {
      ...product,
      price: Number(stock.price) || 0,
      stock: Number(stock.stock) || 0,
      sku_date_updated: stock.sku_date_updated || null,
    };

  } catch (err) {
    console.error(
      "❌ Error en fetchProductBySkuFromPcarts:",
      err.response?.data || err.message
    );
    return null;
  }
}
