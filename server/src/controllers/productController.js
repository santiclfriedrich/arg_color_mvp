// src/controllers/productController.js

import { fetchProductsFromElit, fetchProductBySkuFromElit } from "../services/elitAPI.js";
import { fetchProductsFromMasnet } from "../services/masnetAPI.js";
import { fetchProductsFromCorcisa } from "../services/corcisaAPI.js";
import { fetchProductsFromNucleo } from "../services/nucleoAPI.js";
import { fetchProductsFromPcarts } from "../services/pcartsAPI.js";
import { fetchProductBySkuFromPcarts } from "../services/pcartsAPI.js";
import { formatPcartsSingle } from "../models/index.js";

import {
  formatElitProducts,
  formatMasnetProducts,
  formatCorcisaProducts,
  formatNucleoProducts,
  formatPcartsProducts,
} from "../models/index.js";

import { mergeResults } from "../utils/mergeResults.js";

// ===================================================================
// BUSQUEDA GENERAL: nombre + codigo_producto + partNumber
// ===================================================================
export async function getAllProducts(req, res) {
  const { q } = req.query;

  try {
    console.log(`🔎 Buscando productos: "${q}" ...`);
    const start = Date.now();

    // Llamadas simultáneas
    const [elit, masnet, corcisa, nucleo, pcarts] = await Promise.allSettled([
      fetchProductsFromElit(q),
      fetchProductsFromMasnet(q),
      fetchProductsFromCorcisa(q),
      fetchProductsFromNucleo(q),
      fetchProductsFromPcarts(q),
    ]);

    console.log("🟣 Corcisa status:", corcisa.status);

if (corcisa.status === "fulfilled") {
  console.log("🟣 Corcisa RAW length:", corcisa.value?.length);
  console.log("🟣 Corcisa RAW sample:", corcisa.value?.[0]);
} else {
  console.log("🟣 Corcisa ERROR:", corcisa.reason);
}


    // Normalización
    const elitData =
      elit.status === "fulfilled" ? formatElitProducts(elit.value) : [];

    const masnetData =
      masnet.status === "fulfilled" ? formatMasnetProducts(masnet.value) : [];

    const corcisaData =
      corcisa.status === "fulfilled" ? formatCorcisaProducts(corcisa.value) : [];

    console.log("🟣 Corcisa formatted length:", corcisaData.length);
    console.log("🟣 Corcisa formatted sample:", corcisaData[0]);


    const nucleoData =
      nucleo.status === "fulfilled"
        ? formatNucleoProducts(nucleo.value)
        : [];

    const pcartsData =
      pcarts.status === "fulfilled"
        ? formatPcartsProducts(pcarts.value)
        : [];

    // MERGE
    let allProducts = mergeResults(
      elitData,
      masnetData,
      corcisaData,
      nucleoData,
      pcartsData
    );

    // FILTRO unificado: nombre + SKU + codigo_producto + partNumber
// FILTRO flexible por palabras (NO estricto)
  if (q) {
    const terms = q
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    allProducts = allProducts.filter((p) => {
      const haystack = `
        ${p.name || ""}
        ${p.brand || ""}
        ${p.sku || ""}
      `.toLowerCase();

      // 🔹 si es SKU exacto → match directo
      if (terms.length === 1 && p.sku?.toLowerCase() === terms[0]) {
        return true;
      }

      // 🔹 al menos UNA palabra debe coincidir
      return terms.some((term) => haystack.includes(term));
    });
  }


    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`✅ Búsqueda completada en ${elapsed}s — Total: ${allProducts.length}`);

    res.json(allProducts);

  } catch (error) {
    console.error("❌ Error general:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}


// ===================================================================
// BUSQUEDA EXACTA POR SKU: /api/products/:sku
// ===================================================================
export async function getProductBySku(req, res) {
  const { sku } = req.params;

  try {
    const [elit, masnet, corcisa, nucleo, pcarts] = await Promise.allSettled([
      fetchProductBySkuFromElit(sku),
      fetchProductsFromMasnet(sku),
      fetchProductsFromCorcisa(sku),
      fetchProductsFromNucleo(sku),
      fetchProductBySkuFromPcarts(sku),
    ]);

    const elitData =
      elit.status === "fulfilled" && elit.value
        ? formatElitProducts([elit.value])
        : [];

    const masnetData =
      masnet.status === "fulfilled"
        ? formatMasnetProducts(masnet.value).filter(p => p.sku == sku)
        : [];

    const corcisaData =
      corcisa.status === "fulfilled"
        ? formatCorcisaProducts(corcisa.value).filter(p => p.sku == sku)
        : [];

    const nucleoData =
      nucleo.status === "fulfilled"
        ? formatNucleoProducts(nucleo.value).filter(p => p.sku == sku)
        : [];

    const pcartsData =
      pcarts.status === "fulfilled" && pcarts.value
        ? [formatPcartsSingle(pcarts.value)]
        : [];

    const finalResults = mergeResults(
      elitData,
      masnetData,
      corcisaData,
      nucleoData,
      pcartsData
    );

    if (finalResults.length === 0) {
      return res.status(404).json({ message: `SKU ${sku} no encontrado en ningún proveedor` });
    }

    res.json(finalResults);

  } catch (error) {
    console.error("❌ Error en getProductBySku:", error.message);
    res.status(500).json({ error: "Error al obtener producto por SKU" });
  }
}
