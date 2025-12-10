// src/controllers/productController.js

import { fetchProductsFromElit, fetchProductBySkuFromElit } from "../services/elitAPI.js";
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


// ===================================================================
// BUSQUEDA GENERAL: nombre + codigo_producto + partNumber
// ===================================================================
export async function getAllProducts(req, res) {
  const { q } = req.query;

  try {
    console.log(`🔎 Buscando productos: "${q}" ...`);
    const start = Date.now();

    // Llamadas simultáneas
    const [elit, masnet, corcisa, nucleo] = await Promise.allSettled([
      fetchProductsFromElit(q),
      fetchProductsFromMasnet(q),
      fetchProductsFromCorcisa(q),
      fetchProductsFromNucleo(q),
    ]);

    // Normalización
    const elitData =
      elit.status === "fulfilled" ? formatElitProducts(elit.value) : [];

    const masnetData =
      masnet.status === "fulfilled" ? formatMasnetProducts(masnet.value) : [];

    const corcisaData =
      corcisa.status === "fulfilled" ? formatCorcisaProducts(corcisa.value) : [];

    const nucleoData =
      nucleo.status === "fulfilled"
        ? formatNucleoProducts(nucleo.value)
        : [];

    // MERGE
    let allProducts = mergeResults(
      elitData,
      masnetData,
      corcisaData,
      nucleoData
    );

    // FILTRO unificado: nombre + SKU + codigo_producto + partNumber
    if (q) {
      const qLower = q.toLowerCase();

      allProducts = allProducts.filter((p) => {
        return (
          p.name?.toLowerCase().includes(qLower) ||
          p.sku?.toLowerCase() === qLower ||
          p.sku?.toLowerCase().includes(qLower)
        );
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
    const [elit, masnet, corcisa, nucleo] = await Promise.allSettled([
      fetchProductBySkuFromElit(sku),
      fetchProductsFromMasnet(sku),
      fetchProductsFromCorcisa(sku),
      fetchProductsFromNucleo(sku),
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

    const finalResults = mergeResults(
      elitData,
      masnetData,
      corcisaData,
      nucleoData
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
