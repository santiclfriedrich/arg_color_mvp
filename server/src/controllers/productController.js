import { fetchProductsFromElit } from "../services/elitAPI.js";
import { formatElitProducts } from "../models/productModel.js";

export async function getProducts(req, res) {
  const { q } = req.query;

  try {
    const rawProducts = await fetchProductsFromElit(q);
    const formatted = formatElitProducts(rawProducts);
    res.json(formatted);
  } catch (error) {
    console.error("Error en getProducts:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

// ✅ Nuevo controlador: búsqueda por SKU
export async function getProductBySku(req, res) {
  const { sku } = req.params;

  try {
    const rawProducts = await fetchProductsFromElit(sku);
    const formatted = formatElitProducts(rawProducts);

    // Filtramos el producto exacto si viene un array
    const product = formatted.find((p) => p.sku === sku);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error en getProductBySku:", error.message);
    res.status(500).json({ error: "Error al obtener producto por SKU" });
  }
}