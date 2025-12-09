// src/controllers/productController.js

import { fetchProductsFromElit } from "../services/elitAPI.js";
import { fetchProductsFromMasnet } from "../services/masnetAPI.js";
import { fetchProductsFromCorcisa } from "../services/corcisaAPI.js";
import { fetchProductsFromNucleo } from "../services/nucleoAPI.js";

import {
  formatElitProducts,
  formatMasnetProducts,
  formatCorcisaProducts,
  formatNucleoProducts
} from "../models/index.js";

import { mergeResults } from "../utils/mergeResults.js";

console.log("DEBUG → fetchProductsFromNucleo:", typeof fetchProductsFromNucleo);


export async function getAllProducts(req, res) {
  const { q } = req.query;

  try {
    console.log(`🔎 Buscando productos: "${q}" ...`);
    const start = Date.now();

    console.log("DEBUG → Promise.all listo para llamar a Núcleo");

    // Llamadas simultáneas
    const [elit, masnet, corcisa, nucleo] = await Promise.allSettled([
      fetchProductsFromElit(q),
      fetchProductsFromMasnet(q),
      fetchProductsFromCorcisa(q),
      fetchProductsFromNucleo(q),
    ]);
    console.log("DEBUG → Luego de Promise.allSettled. Estado Núcleo:", nucleo.status);


    // NORMALIZACIÓN POR PROVEEDOR
    const elitData =
      elit.status === "fulfilled" ? formatElitProducts(elit.value) : [];

    const masnetData =
      masnet.status === "fulfilled" ? formatMasnetProducts(masnet.value) : [];

    const corcisaData =
      corcisa.status === "fulfilled" ? formatCorcisaProducts(corcisa.value) : [];

    const nucleoRaw = nucleo.status === "fulfilled" ? nucleo.value : [];
    const nucleoData = Array.isArray(nucleoRaw)
      ? formatNucleoProducts(nucleoRaw)
      : [];

    // MERGE FINAL
    const allProducts = mergeResults(
      elitData,
      masnetData,
      corcisaData,
      nucleoData
    );

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);

    console.log(
      `✅ Búsqueda completada en ${elapsed}s — ` +
        `Elit: ${elitData.length}, ` +
        `Masnet: ${masnetData.length}, ` +
        `Corcisa: ${corcisaData.length}, ` +
        `Nucleo: ${nucleoData.length}, ` +
        `TOTAL: ${allProducts.length}`
    );

    res.json(allProducts);

  } catch (error) {
    console.error("❌ Error general:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

// -------------------------------------------
// Búsqueda por SKU (solo Elit por ahora)
// -------------------------------------------
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
