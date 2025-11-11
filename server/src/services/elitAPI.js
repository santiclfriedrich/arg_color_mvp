import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const BASE_URL = "https://clientes.elit.com.ar/v1/api";

/**
 * 🔹 Busca listado de productos (por nombre o general)
 */
export async function fetchProductsFromElit(query = "") {
  const { ELIT_USER_ID, ELIT_TOKEN } = process.env;
  const url =
    `${BASE_URL}/productos?limit=100` +
    (query && query.trim().length > 0
      ? `&nombre=${encodeURIComponent(query)}`
      : "");

  const body = { user_id: Number(ELIT_USER_ID), token: ELIT_TOKEN.trim() };

  try {
    const res = await axios.post(url, body, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });

    const raw = res.data;
    const products = Array.isArray(raw?.resultado) ? raw.resultado : [];
    return products;
  } catch (err) {
    console.error("❌ Error al consultar listado de productos:", err.response?.data || err.message);
    throw new Error("No se pudo obtener lista de productos desde Elit");
  }
}

/**
 * 🔹 Busca producto exacto por código_producto (usa paginador de Elit)
 */
export async function fetchProductBySkuFromElit(sku) {
  const { ELIT_USER_ID, ELIT_TOKEN } = process.env;
  const url = `${BASE_URL}/productos?limit=100`;
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  const baseBody = { user_id: Number(ELIT_USER_ID), token: ELIT_TOKEN.trim() };

  console.log(`🔍 Buscando código_producto '${sku}' en Elit...`);

  let currentPage = 1;
  let totalPages = 1;

  try {
    while (currentPage <= totalPages) {
      // 👇 Usamos "pagina" en el body (no en la URL)
      const res = await axios.post(url, { ...baseBody, pagina: currentPage }, { headers });
      const data = res.data;

      const productos = Array.isArray(data?.resultado) ? data.resultado : [];
      const paginador = data?.paginador || { pagina: 1, total_paginas: 1 };

      totalPages = paginador.total_paginas || 1;

      const found = productos.find(
        (p) =>
          p.codigo_producto?.toUpperCase?.() === sku.toUpperCase() ||
          p.codigo?.toUpperCase?.() === sku.toUpperCase()
      );

      if (found) {
        console.log(`✅ Producto encontrado en página ${currentPage}: ${found.nombre}`);
        return found;
      }

      console.log(`⏭️ Revisada página ${currentPage}/${totalPages}...`);
      currentPage++;
    }

    console.warn(`⚠️ Producto '${sku}' no encontrado en Elit.`);
    return null;
  } catch (err) {
    console.error("❌ Error al consultar producto por código:", err.response?.data || err.message);
    throw new Error("Error al obtener producto por código_producto desde Elit");
  }
}
