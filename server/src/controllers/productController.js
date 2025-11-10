import { fetchProductsFromElit } from "../services/elitAPI.js";
import { formatProductList } from "../models/productModel.js";

// Controlador principal
export async function getProducts(req, res) {
  const { q } = req.query;

  try {
    const elitData = await fetchProductsFromElit(q);
    const formatted = formatProductList(elitData);
    res.json(formatted);
  } catch (error) {
    console.error("Error en getProducts:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

// Controlador para buscar por SKU
export async function getProductBySku(req, res) {
  const { sku } = req.params;

  try {
    const elitData = await fetchProductsFromElit(sku);
    const formatted = formatProductList(elitData);
    res.json(formatted[0] || { message: "Producto no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error al buscar producto por SKU" });
  }
}
