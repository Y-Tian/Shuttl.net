import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faShieldHalved, faGripLines, faWeightHanging, faRulerCombined } from '@fortawesome/free-solid-svg-icons';
import { CLOUDFLARE_IMAGES_TRANSFORM_BASE_URL, MINI_ICON_TRANSFORM } from '../config/constants';

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
        <span className="card-year">{racket.year}</span>
        <h3 className="card-title">{racket.subModel}</h3>
      </div>
      <div>
        {/* TODO: add a class for product icons */}
        <img src={`${CLOUDFLARE_IMAGES_TRANSFORM_BASE_URL}${MINI_ICON_TRANSFORM}${racket.r2ImageSlugFull}`} alt={`${racket.subModel} mini icon`} className="product-mini-icon" loading="lazy" />
      </div>
      <div className="card-specs">
        <div className="spec-item">
          <FontAwesomeIcon icon={getTypeIcon(racket.Type)} />
          <span>{racket.Type}</span> {/* Show primary type */}
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faGripLines} />
          <span>{racket.flex}</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faWeightHanging} />
          <span>Weight: {racket.weights}</span>
        </div>
      </div>
      <span className="card-price-tier">{racket.priceTier}</span>
      {/* Future: Add an onClick handler here to open a detailed modal */}
    </div>
  );
}

export default CompactProductCard;