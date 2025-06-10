import React from "react";
import CompactProductCard from "./CompactProductCard";
import ProductCard from "./ProductCard"; // Import ProductCard if needed for detailed view

function ProductList({ products, categoryTitle, onCardClick }) {
  return (
    <div className="product-list-container">
      <h2>{categoryTitle}</h2>
      <div className="product-grid">
        {products.map((racket, index) => (
          <CompactProductCard key={index} racket={racket} onClick={() => onCardClick && onCardClick(racket)} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
