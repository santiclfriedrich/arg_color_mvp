// Función para formatear una lista completa
export function formatProductList(apiResponse) {
  if (!Array.isArray(apiResponse)) return [];

  return apiResponse.map((p) => ({
    id: p.id,
    name: p.nombre,
    sku: p.codigo_producto,
    category: p.categoria,
    subCategory: p.sub_categoria,
    brand: p.marca,
    price: p.precio,
    currency: p.moneda === 1 ? "ARS" : "USD",
    iva: p.iva ? `${p.iva}%` : "21%",
    stock: p.stock || 0,
    stockStatus: p.stock > 0 ? "disponible" : "sin stock",
    description: p.descripcion || "",
    link: p.link_ficha || "",
    provider: "Elit",
  }));
}
