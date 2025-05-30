// src/components/ProductCard.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faShieldHalved, faWeightHanging, faGripLines, faRulerCombined, faLocationDot } from '@fortawesome/free-solid-svg-icons';

function ProductCard({ racket }) {
  // Helper function to map racket type to an icon
  const getTypeIcon = (type) => {
    if (type.includes("Offensive") || type.includes("Power")) return faFire;
    if (type.includes("Defensive") || type.includes("Speed")) return faShieldHalved;
    return faRulerCombined; // All-around/Control
  };

  return (
    <div className="product-card">
      <h3>{racket["Sub-Model(s)"]}</h3>
      <p><strong>Series:</strong> {racket["Model Series"]}</p>
      <p><strong>Year:</strong> {racket.Year}</p>

      <div className="specs-grid">
        <div className="spec-item">
          <FontAwesomeIcon icon={getTypeIcon(racket.Type)} />
          <span>{racket.Type}</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faGripLines} />
          <span>Flex: {racket.Flex}</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faWeightHanging} />
          <span>Weight: {racket["Weight (U)"]}</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faRulerCombined} />
          <span>Tension: {racket["Recommended Tension (Max Lbs)"]} lbs Max</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faLocationDot} />
          <span>Made in {racket["Manufacturing Country"]}</span>
        </div>
      </div>
      
      <p className="price-tier">Price Tier: {racket["General Price Tier"]}</p>

      {racket["Primary Paint Color Variation(s)"] !== "N/A" && (
        <p><strong>Colors:</strong> {racket["Primary Paint Color Variation(s)"]}</p>
      )}
      {racket["Signature Player"] !== "N/A" && (
        <p><strong>Signature Player:</strong> {racket["Signature Player"]}</p>
      )}
      <p className="notes">{racket["Notes/Key Technologies"]}</p>
    </div>
  );
}

export default ProductCard;