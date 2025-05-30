import React from 'react';
import CompactProductCard from './CompactProductCard';

function ProductList({ products, categoryTitle }) {
  return (
    <div className="product-list-container">
      <h2>{categoryTitle}</h2>
      <div className="product-grid">
        {products.map((racket, index) => (
          <CompactProductCard key={index} racket={racket} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;