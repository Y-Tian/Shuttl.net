// src/components/ProductCard.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faShieldHalved,
  faWeightHanging,
  faGripLines,
  faRulerCombined,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

function ProductCard({ racket }) {
  // Helper function to map racket type to an icon
  const getTypeIcon = (type) => {
    if ((type || "").includes("Offensive") || (type || "").includes("Power"))
      return faFire;
    if ((type || "").includes("Defensive") || (type || "").includes("Speed"))
      return faShieldHalved;
    return faRulerCombined; // All-around/Control
  };

  return (
    <div className="product-card">
      <h3>{racket.subModel}</h3>
      <p>
        <strong>Series:</strong> {racket.model}
      </p>
      <p>
        <strong>Year:</strong> {racket.year}
      </p>

      <div className="specs-grid">
        <div className="spec-item">
          <FontAwesomeIcon icon={getTypeIcon(racket.Type)} />
          <span>{racket.Type}</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faGripLines} />
          <span>Flex: {racket.flex}</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faWeightHanging} />
          <span>Weight: {racket.weights}</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faRulerCombined} />
          <span>Tension: {racket.recommendedTension} lbs Max</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faLocationDot} />
          <span>Made in {racket.manufacturingCountry}</span>
        </div>
      </div>

      <p className="price-tier">Price Tier: {racket.priceTier}</p>

      {racket.primaryColour !== "N/A" && (
        <p>
          <strong>Colors:</strong> {racket.primaryColour}
        </p>
      )}
      {racket.signaturePlayers !== "N/A" && (
        <p>
          <strong>Signature Player:</strong> {racket.signaturePlayers}
        </p>
      )}
      <p className="notes">{racket.notes}</p>
    </div>
  );
}

export default ProductCard;
