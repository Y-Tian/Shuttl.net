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

  // Map brand to official site
  const getOfficialSite = (brand) => {
    if (!brand) return null;
    const b = brand.toLowerCase();
    if (b.includes("yonex")) return "https://www.yonex.com";
    if (b.includes("victor")) return "https://www.victorsport.com";
    if (b.includes("li-ning") || b.includes("lining")) return "https://www.lining.com";
    return null;
  };
  const officialSite = getOfficialSite(racket.brand);

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
      {officialSite && (
        <a
          href={officialSite}
          target="_blank"
          style={{ display: "block", marginTop: "1rem", color: "#00bcd4", fontWeight: 600 }}
        >
          Visit Official Site
        </a>
      )}
    </div>
  );
}

export default ProductCard;
