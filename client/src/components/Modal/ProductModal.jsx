import {
  X,
  Copy,
  Check,
  ExternalLink,
  Trophy,
  TrendingDown,
} from "lucide-react";
import { useState, useMemo } from "react";

/**
 * 🎨 Colores por proveedor
 */
const PROVIDER_STYLES = {
  Elit: {
    badge: "bg-orange-100 text-orange-800",
    border: "border-orange-400",
  },
  Nucleo: {
    badge: "bg-red-100 text-red-800",
    border: "border-red-400",
  },
  PCArts: {
    badge: "bg-violet-100 text-violet-800",
    border: "border-violet-400",
  },
  Masnet: {
    badge: "bg-blue-100 text-blue-800",
    border: "border-blue-400",
  },
  Corcisa: {
    badge: "bg-sky-100 text-sky-800",
    border: "border-sky-400",
  },
};

export const ProductModal = ({ product, onClose }) => {
  const [copied, setCopied] = useState(false);

  // 🔒 Hooks SIEMPRE antes de cualquier return
  const providers = useMemo(() => {
    if (!product) return [];
    return product.providers && product.providers.length > 0
      ? product.providers
      : [product];
  }, [product]);

  const { best, ahorro } = useMemo(() => {
    if (providers.length < 2) {
      return { best: providers[0], ahorro: 0 };
    }

    const sorted = [...providers].sort((a, b) => a.price - b.price);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];

    return {
      best,
      ahorro: worst.price - best.price,
    };
  }, [providers]);

  if (!product) return null;

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
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex gap-2">
            {best && (
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 flex items-center gap-1">
                <Trophy size={14} />
                Mejor precio
              </span>
            )}
          </div>

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
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6">
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-80 object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/400x300?text=Sin+Imagen";
              }}
            />
          </div>

          {/* INFO */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>

            {/* SKU */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-sm text-gray-600">SKU</span>
              <span className="px-3 py-1 bg-gray-100 rounded-md font-mono text-sm">
                {product.sku}
              </span>
              <button
                onClick={handleCopySku}
                className="p-1.5 rounded-md hover:bg-gray-100"
              >
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-gray-600" />
                )}
              </button>
            </div>

            {/* MEJOR PRECIO */}
            {best && (
              <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="text-sm text-green-700 flex items-center gap-1">
                  <Trophy size={14} />
                  Mejor precio disponible
                </p>
                <p className="text-3xl font-bold">
                  USD{" "}
                  {best.price.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-gray-600">+ IVA {best.iva}</p>
              </div>
            )}

            {/* AHORRO */}
            {ahorro > 0 && (
              <p className="text-green-700 text-sm flex items-center gap-1 mb-6">
                <TrendingDown size={14} />
                Ahorro vs proveedor más caro: USD{" "}
                {ahorro.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            )}

            {/* COMPARATIVA */}
            {providers.length > 1 && (
              <>
                <h3 className="font-semibold mb-2">
                  Comparativa de proveedores ({providers.length})
                </h3>

                <div className="space-y-2">
                  {providers.map((p) => {
                    const style = PROVIDER_STYLES[p.provider] || {};
                    const isBest = best?.provider === p.provider;

                    return (
                      <div
                        key={p.provider}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isBest
                            ? "border-green-400 bg-green-50"
                            : style.border
                        }`}
                      >
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${style.badge}`}
                        >
                          {p.provider}
                        </span>

                        <span className="font-semibold">
                          USD{" "}
                          {p.price.toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>

                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* CTA */}
            {best?.link && (
              <a
                href={best.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Ir al mejor precio
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
