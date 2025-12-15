// src/utils/mergeResults.js

export function mergeResults(...lists) {
  const map = {};

  for (const list of lists) {
    if (!Array.isArray(list)) continue;

    for (const p of list) {
      if (!p || !p.sku) continue;

      const sku = String(p.sku).trim().toUpperCase();
      const provider = p.provider || "DESCONOCIDO";

      if (!map[sku]) {
        map[sku] = [];
      }

      // ¿Ya tengo este SKU de este proveedor?
      const alreadyExists = map[sku].some(
        (item) => (item.provider || "DESCONOCIDO") === provider
      );

      if (!alreadyExists) {
        map[sku].push({
          ...p,
          sku, // guardamos el SKU ya normalizado
        });
      }
    }
  }

  // Flatten: de { SKU: [p1, p2] } → [p1, p2, ...]
  return Object.values(map).flat();
}
