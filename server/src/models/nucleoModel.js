// src/models/nucleoModel.js
import { buildNucleoProductUrl } from "../utils/nucleoUrl.js";

export function formatNucleoProducts(rawProducts = []) {
  if (!Array.isArray(rawProducts)) return [];

  return rawProducts.map((p) => ({
    sku: p.partNumber || "",
    name: p.item_desc_0 || "",
    brand: p.marca || "",
    price: Number(p.precioNeto_USD) || 0,
    iva: p.impuestos?.[0]?.imp_porcentaje
      ? `${p.impuestos[0].imp_porcentaje}%`
      : "21%",
    currency: "USD",
    stockLevel: (p.stock_mdp + p.stock_caba) > 0 ? "Disponible" : "Sin stock",
    stockTotal: (p.stock_mdp || 0) + (p.stock_caba || 0),
    link: buildNucleoProductUrl(p.item_desc_0), // ✅ SOLO NOMBRE
    image:
      Array.isArray(p.url_imagenes) && p.url_imagenes.length > 0
        ? p.url_imagenes[0].url
        : null,
    provider: "Nucleo",
  }));
}
