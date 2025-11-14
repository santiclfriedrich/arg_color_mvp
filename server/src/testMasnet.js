import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MASNET_BASE_URL = "https://masnet.com.ar/api/v1/productos";
const { MASNET_USER_ID, MASNET_TOKEN } = process.env;

async function testMasnet() {
  const body = {
    user_id: MASNET_USER_ID.trim(),
    token: MASNET_TOKEN.trim(),
    limit: 10,
    offset: 0,
    nombre: "monitor"
    // 🔁 si querés probar por código, usá codigo_producto: "ABC123"
  };

  try {
    console.log("🟡 Enviando a Masnet...");
    const res = await axios.post(MASNET_BASE_URL, body, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://masnet.com.ar",
        "Referer": "https://masnet.com.ar/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
      },
      timeout: 10000,
    });

    console.log("✅ Status:", res.status);
    console.log("🔑 Keys:", Object.keys(res.data || {}));
    console.log("🧾 Respuesta completa:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("❌ Error Masnet test:");
    console.dir(err.response?.data || err.message, { depth: 10 });
  }
}

testMasnet();
