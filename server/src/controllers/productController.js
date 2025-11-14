// src/controllers/productController.js

import { fetchProductsFromElit } from "../services/elitAPI.js";
import { fetchProductsFromMasnet } from "../services/masnetAPI.js";
import { formatElitProducts, formatMasnetProducts } from "../models/index.js";
import { mergeResults } from "../utils/mergeResults.js";

export async function getAllProducts(req, res) {
  const { q } = req.query;

  try {
    console.log(`🔎 Buscando productos: "${q}" ...`);
    const start = Date.now();

    // Llamadas simultáneas a ambas APIs
    const [elit, masnet] = await Promise.allSettled([
      fetchProductsFromElit(q),
      fetchProductsFromMasnet(q),
    ]);

    // Formateo independiente por proveedor
    const elitData =
      elit.status === "fulfilled" && Array.isArray(elit.value)
        ? formatElitProducts(elit.value)
        : [];

    const masnetData =
      masnet.status === "fulfilled" && Array.isArray(masnet.value)
        ? formatMasnetProducts(masnet.value)
        : [];

    const allProducts = mergeResults(elitData, masnetData);

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.log(
      `✅ Búsqueda completada en ${elapsed}s — Elit: ${elitData.length}, Masnet: ${masnetData.length}, Total: ${allProducts.length}`
    );

    res.json(allProducts);
  } catch (error) {
    console.error("❌ Error general:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

/**
 * 🔹 Busca producto único por SKU (usa Elit por ahora)
 */
export async function getProductBySku(req, res) {
  const { sku } = req.params;
  try {
    const raw = await fetchProductsFromElit(sku);
    if (!raw || raw.length === 0)
      return res.status(404).json({ message: "Producto no encontrado" });

    const formatted = formatElitProducts(raw);
    res.json(formatted[0]);
  } catch (error) {
    console.error("Error en getProductBySku:", error.message);
    res.status(500).json({ error: "Error al obtener producto por SKU" });
  }
}
