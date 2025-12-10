// src/models/nucleoModel.js

export function formatNucleoProducts(rawProducts = []) {
  if (!Array.isArray(rawProducts)) return [];

  return rawProducts.map((p) => ({
    sku: p.partNumber || p.codigo || "",
    name: p.item_desc_0 || p.partNumber || "",
    brand: p.marca || "",
    price: Number(p.precioNeto_USD) || 0,
    iva: p.impuestos?.[0]?.imp_porcentaje
      ? `${p.impuestos[0].imp_porcentaje}%`
      : "21%",
    currency: "USD",
    stockLevel: (p.stock_mdp + p.stock_caba) > 0 ? "Disponible" : "Sin stock",
    stockTotal: (p.stock_mdp || 0) + (p.stock_caba || 0),
    link: "", // No lo proveen
    image:
      Array.isArray(p.url_imagenes) && p.url_imagenes.length > 0
        ? p.url_imagenes[0].url
        : null,
    provider: "Nucleo",
  }));
}
