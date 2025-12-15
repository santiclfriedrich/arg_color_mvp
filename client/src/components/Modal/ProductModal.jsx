import { X, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

/**
 * 🎨 Colores por proveedor
 */
const PROVIDER_STYLES = {
  Elit: "border-orange-500 text-orange-600",
  Nucleo: "border-red-500 text-red-600",
  "Grupo Nucleo": "border-red-500 text-red-600",
  PCArts: "border-gray-500 text-gray-600",
  Masnet: "border-blue-500 text-blue-600",
  Corcisa: "border-sky-500 text-sky-600",
};

export const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  const [copied, setCopied] = useState(false);

  const providerStyle =
    PROVIDER_STYLES[product.provider] || "border-gray-300 text-gray-600";

  const imageUrl =
    product.image ||
    "https://via.placeholder.com/400x300?text=Sin+Imagen";

  // 📋 Copiar SKU
  const handleCopySku = async () => {
    try {
      await navigator.clipboard.writeText(product.sku);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Error copiando SKU", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <span
            className={`px-4 py-1 rounded-full text-sm font-medium border ${providerStyle}`}
          >
            {product.provider}
          </span>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* IMAGE */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-72 object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/400x300?text=Sin+Imagen";
              }}
            />
          </div>

          {/* INFO */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>

            {/* SKU + COPY */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">SKU:</span>

              <span className="px-3 py-1 rounded-md bg-gray-100 font-mono text-sm">
                {product.sku}
              </span>

              <button
                onClick={handleCopySku}
                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-100 transition"
                title="Copiar SKU"
              >
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-gray-600" />
                )}
              </button>

              {copied && (
                <span className="text-xs text-green-600 ml-1">
                  Copiado
                </span>
              )}
            </div>

            {/* PRICE */}
            <div className="mb-5">
              <p className="text-3xl font-bold text-gray-900">
                {product.currency}{" "}
                {Number(product.price).toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-gray-500">+ IVA {product.iva}</p>
            </div>

            {/* STOCK */}
            {product.stockTotal !== undefined && (
              <p className="text-sm text-gray-700 mb-3">
                Stock disponible:{" "}
                <span className="font-semibold">{product.stockTotal}</span>
              </p>
            )}

            {/* BRAND */}
            {product.brand && (
              <p className="text-sm text-gray-600 mb-4">
                Marca: <span className="font-medium">{product.brand}</span>
              </p>
            )}

            {/* DESCRIPTION */}
            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Descripción
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* CTA */}
            {product.link && (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg border font-medium transition hover:opacity-90 ${providerStyle}`}
              >
                Ver en proveedor
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
