import { ProductCard } from '../ProductCard/ProductCard';

export const ProductGrid = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
};