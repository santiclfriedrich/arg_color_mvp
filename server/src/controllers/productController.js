import { fetchProductsFromElit, fetchProductBySkuFromElit } from "../services/elitAPI.js";
import { formatElitProducts } from "../models/productModel.js";

export async function getProducts(req, res) {
  const { q } = req.query;
  try {
    const raw = await fetchProductsFromElit(q);
    const formatted = formatElitProducts(raw);
    res.json(formatted);
  } catch (error) {
    console.error("Error en getProducts:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

export async function getProductBySku(req, res) {
  const { sku } = req.params;
  try {
    const raw = await fetchProductBySkuFromElit(sku);
    if (!raw) return res.status(404).json({ message: "Producto no encontrado" });

    const [formatted] = formatElitProducts([raw]);
    if (!formatted) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(formatted);
  } catch (error) {
    console.error("Error en getProductBySku:", error.message);
    res.status(500).json({ error: "Error al obtener producto por SKU" });
  }
}
