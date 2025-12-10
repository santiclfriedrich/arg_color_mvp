// src/services/nucleoAPI.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const LOGIN_URL = "https://api.gruponucleosa.com/Authentication/Login";
const CATALOG_URL = "https://api.gruponucleosa.com/API_V1/GetCatalog";

let cachedToken = null;
let tokenExpiration = null;

async function getNucleoToken() {
  try {
    const body = {
      id: Number(process.env.NUCLEO_ID),
      username: process.env.NUCLEO_USER,
      password: process.env.NUCLEO_PASSWORD,
    };

    const res = await axios.post(LOGIN_URL, body);

    cachedToken = res.data;
    tokenExpiration = Date.now() + 14 * 60 * 1000;

    return cachedToken;

  } catch (err) {
    console.error("❌ Error Token Núcleo:", err.response?.data || err.message);
    return null;
  }
}

async function getValidToken() {
  if (!cachedToken || Date.now() > tokenExpiration) {
    return await getNucleoToken();
  }
  return cachedToken;
}

export async function fetchProductsFromNucleo(query = "") {
  try {
    const token = await getValidToken();
    if (!token) return [];

    const res = await axios.get(CATALOG_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let products = res.data || [];

    if (!query) return products;

    const q = query.toLowerCase();

    products = products.filter((p) =>
      p.item_desc_0?.toLowerCase().includes(q) ||
      p.partNumber?.toLowerCase().includes(q) ||
      p.codigo?.toLowerCase().includes(q)
    );

    return products;

  } catch (err) {
    console.error("❌ Error consultando Núcleo:", err.response?.data || err.message);
    return [];
  }
}
