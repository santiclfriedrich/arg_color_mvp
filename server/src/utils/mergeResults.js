export function mergeResults(...lists) {
  const merged = [];
  const seen = new Set();

  lists.flat().forEach((item) => {
    if (!seen.has(item.sku)) {
      seen.add(item.sku);
      merged.push(item);
    }
  });

  return merged;
}
