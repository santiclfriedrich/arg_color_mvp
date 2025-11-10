import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ELIT_BASE_URL = "https://clientes.elit.com.ar/v1/api/productos";

export async function fetchProductsFromElit(query = "") {
  const { ELIT_USER_ID, ELIT_TOKEN } = process.env;

  // 🚨 Evitá enviar nombre vacío — solo lo agregamos si hay texto
  const url =
    ELIT_BASE_URL +
    "?limit=100" +
    (query && query.trim().length > 0 ? `&nombre=${encodeURIComponent(query)}` : "");

  const body = {
    user_id: Number(ELIT_USER_ID),
    token: ELIT_TOKEN.trim(),
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Aseguramos que la respuesta sea un array
    if (!Array.isArray(response.data)) {
      console.error("Respuesta inesperada de Elit:", response.data);
      throw new Error("Respuesta inesperada de Elit API");
    }

    return response.data;
  } catch (err) {
    console.error("Error al consultar Elit API:", err.response?.data || err.message);
    throw new Error("No se pudo obtener datos de Elit");
  }
}
