import { X } from 'lucide-react';

export const ProductModal = ({ product, onClose }) => {
  const getStockColor = (status, stock) => {
    if (status === 'disponible' && stock > 20) return 'bg-green-100 text-green-800';
    if (status === 'disponible' && stock <= 20) return 'bg-yellow-100 text-yellow-800';
    if (status === 'bajo') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button className="px-4 py-1 border border-gray-300 rounded-full text-sm">
            {product.category}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-200 rounded-lg"></div>
            </div>

            {/* Product Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">SKU: {product.sku}</p>

              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">
                  {product.currency} {product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500">+ IVA {product.iva}</p>
              </div>

              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStockColor(product.stockStatus, product.stock)}`}>
                  Stock disponible: {product.stock}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Marca: {product.brand}
              </p>

              {product.fullDescription && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Descripción:</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {product.fullDescription}
                  </p>
                </div>
              )}

              {product.link && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Link:</p>
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {product.link}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
