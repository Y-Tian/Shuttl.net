import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faShieldHalved, faGripLines, faWeightHanging, faRulerCombined } from '@fortawesome/free-solid-svg-icons';

function CompactProductCard({ racket }) {
  // Helper function to map racket type to an icon
  const getTypeIcon = (type) => {
    if ((type || "").includes("Offensive") || (type || "").includes("Power")) return faFire;
    if ((type || "").includes("Defensive") || (type || "").includes("Speed")) return faShieldHalved;
    return faRulerCombined; // All-around/Control
  };

  return (
    <div className="compact-product-card">
      <div className="card-header">
        <span className="card-year">{racket.Year}</span>
        <h3 className="card-title">{racket["Sub-Model(s)"]}</h3>
      </div>
      <div className="card-specs">
        <div className="spec-item">
          <FontAwesomeIcon icon={getTypeIcon(racket.Type)} />
          <span>{racket.Type}</span> {/* Show primary type */}
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faGripLines} />
          <span>{racket.Flex}</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faWeightHanging} />
          <span>Weight: {racket["Weight (U)"]}</span>
        </div>
      </div>
      <span className="card-price-tier">{racket["General Price Tier"]}</span>
      {/* Future: Add an onClick handler here to open a detailed modal */}
    </div>
  );
}

export default CompactProductCard;