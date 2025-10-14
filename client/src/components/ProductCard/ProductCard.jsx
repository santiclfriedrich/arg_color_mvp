export const ProductCard = ({ product, onClick }) => {
  const getStockColor = (status, stock) => {
    if (status === 'disponible' && stock > 20) return 'bg-green-100 text-green-800';
    if (status === 'disponible' && stock <= 20) return 'bg-yellow-100 text-yellow-800';
    if (status === 'bajo') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Category Badge */}
      <div className="flex justify-center py-2 bg-gray-100">
        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-300">
          {product.category}
        </span>
      </div>

      {/* Product Image Placeholder */}
      <div className="h-40 bg-gray-200 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-200"></div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
        
        <div className="mb-3">
          <p className="text-2xl font-bold text-gray-900">
            {product.currency} {product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500">+IVA {product.iva}</p>
        </div>

        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Stock Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStockColor(product.stockStatus, product.stock)}`}>
            Stock {product.stockStatus}: {product.stock}
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-2">Marca: {product.brand}</p>
      </div>
    </div>
  );
};