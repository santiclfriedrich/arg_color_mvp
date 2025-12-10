// src/services/elitAPI.js

import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const BASE_URL = "https://clientes.elit.com.ar/v1/api";

export async function fetchProductsFromElit(query = "") {
  const { ELIT_USER_ID, ELIT_TOKEN } = process.env;

  const url =
    `${BASE_URL}/productos?limit=100` +
    (query ? `&nombre=${encodeURIComponent(query)}` : "");

  const body = {
    user_id: Number(ELIT_USER_ID),
    token: ELIT_TOKEN.trim(),
  };

  try {
    const res = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
    });

    return Array.isArray(res.data?.resultado) ? res.data.resultado : [];

  } catch (err) {
    console.error("❌ Error en listado Elit:", err.response?.data || err.message);
    return [];
  }
}


// 🔍 Búsqueda exacta de SKU usando paginador
export async function fetchProductBySkuFromElit(sku) {
  const { ELIT_USER_ID, ELIT_TOKEN } = process.env;

  const url = `${BASE_URL}/productos?limit=100`;
  const headers = { "Content-Type": "application/json" };
  const baseBody = { user_id: Number(ELIT_USER_ID), token: ELIT_TOKEN.trim() };

  let page = 1;
  let total = 1;

  try {
    while (page <= total) {
      const res = await axios.post(url, { ...baseBody, pagina: page }, { headers });

      const productos = res.data?.resultado || [];
      const pag = res.data?.paginador || {};
      total = pag.total_paginas || 1;

      const found = productos.find(p =>
        p.codigo_producto?.toUpperCase() === sku.toUpperCase() ||
        p.codigo?.toUpperCase() === sku.toUpperCase()
      );

      if (found) return found;

      page++;
    }

    return null;

  } catch (err) {
    console.error("❌ Error buscando SKU en Elit:", err.response?.data || err.message);
    return null;
  }
}
