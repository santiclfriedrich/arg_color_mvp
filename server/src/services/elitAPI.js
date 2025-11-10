import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const ELIT_BASE_URL = "https://clientes.elit.com.ar/v1/api/productos";

export async function fetchProductsFromElit(query = "") {
  const { ELIT_USER_ID, ELIT_TOKEN } = process.env;

  const url =
    ELIT_BASE_URL +
    "?limit=100" +
    (query && query.trim().length > 0
      ? `&nombre=${encodeURIComponent(query)}`
      : "");

  const body = {
    user_id: Number(ELIT_USER_ID),
    token: ELIT_TOKEN.trim(),
  };

  console.log("🔍 Enviando a Elit:", {
    url,
    user_id: ELIT_USER_ID,
    token: ELIT_TOKEN ? ELIT_TOKEN.slice(0, 6) + "..." : null,
  });

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // 🧠 Ahora sabemos que los productos vienen en "resultado"
    const raw = response.data;
    const products = Array.isArray(raw.resultado) ? raw.resultado : [];

    if (!products.length) {
      console.warn("⚠️ No se encontraron productos en la respuesta de Elit.");
    } else {
      console.log(`✅ Recibidos ${products.length} productos de Elit.`);
    }

    return products;
  } catch (err) {
    console.error(
      "Error al consultar Elit API:",
      err.response?.data || err.message
    );
    throw new Error("No se pudo obtener datos de Elit");
  }
}
