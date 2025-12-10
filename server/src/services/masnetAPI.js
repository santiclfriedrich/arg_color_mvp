// src/services/masnetAPI.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function fetchProductsFromMasnet(query = "") {
  try {
    const body = {
      user_id: process.env.MASNET_USER_ID,
      token: process.env.MASNET_TOKEN,
      limit: 100,
      offset: 0,
    };

    const isSku = /^[A-Za-z0-9\-]+$/.test(query);

    if (query) {
      if (isSku) body.codigo_producto = query;
      else body.nombre = query;
    }

    const res = await axios.post(process.env.MASNET_URL, body);

    return res.data?.resultado || [];

  } catch (err) {
    console.error("❌ Error Masnet:", err.response?.data || err.message);
    return [];
  }
}
