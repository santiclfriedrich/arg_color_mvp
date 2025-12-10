// src/services/corcisaAPI.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://corcisa.com.ar/api/v1/productos";

export async function fetchProductsFromCorcisa(query = "") {
  try {
    const params = { limit: 100, offset: 0 };
    const isSku = /^[A-Za-z0-9\-]+$/.test(query);

    if (query) {
      if (isSku) params.codigo_producto = query;
      else params.nombre = query;
    }

    const body = {
      user_id: process.env.CORCISA_USER_ID,
      token: process.env.CORCISA_TOKEN,
    };

    const res = await axios.post(BASE_URL, body, { params });

    return res.data?.resultado || [];

  } catch (err) {
    console.error("❌ Error Corcisa:", err.response?.data || err.message);
    return [];
  }
}
