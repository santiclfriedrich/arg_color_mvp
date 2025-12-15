export async function searchProducts(query) {
  if (!query || query.trim() === "") return [];

  try {
    const res = await fetch(`http://localhost:3000/api/products?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Error en la API");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ Error llamando backend:", err);
    return [];
  }
}
