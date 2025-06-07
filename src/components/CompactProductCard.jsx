import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faShieldHalved,
  faGripLines,
  faWeightHanging,
  faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";
import {
  CLOUDFLARE_IMAGES_TRANSFORM_BASE_URL,
  MINI_ICON_TRANSFORM,
  DEFAULT_RACKET_IMAGE,
  DEFAULT_RACKET_IMAGE_EXT,
} from "../config/constants";

function GenerateImage({ racket }) {
  const racketIndex = `${racket.year}_${racket.brand}_${racket.subModel}`
    .replace(/\s+/g, "_")
    .toLowerCase();
  const racketImageName = `${CLOUDFLARE_IMAGES_TRANSFORM_BASE_URL}${MINI_ICON_TRANSFORM}${racketIndex}${DEFAULT_RACKET_IMAGE_EXT}`;
  const racketAltTag = `${racket.year} ${racket.brand} ${racket.model} ${racket.subModel} mini icon badminton racket`;

  return (
    <img
      src={racketImageName}
      alt={racketAltTag}
      className="product-mini-icon"
      loading="eager"
      onError={(e) => {
        e.target.onerror = null; // Prevents infinite loop if fallback also fails
        e.target.src = `${DEFAULT_RACKET_IMAGE}`; // Fallback to default image
        console.warn(
          `Image not found for ${racketIndex}, using default image.`
        );
      }}
    />
  );
}

function CompactProductCard({ racket }) {
  const getTypeIcon = (type) => {
    if ((type || "").includes("Offensive") || (type || "").includes("Power"))
      return faFire;
    if ((type || "").includes("Defensive") || (type || "").includes("Speed"))
      return faShieldHalved;
    return faRulerCombined;
  };

  return (
    <div className="compact-product-card">
      <div className="card-header">
        <span className="card-year">{racket.year}</span>
        <h3 className="card-title">{racket.subModel}</h3>
      </div>
      <div>
        {/* TODO: add a class for product icons */}
        <GenerateImage racket={racket} />
      </div>
      <div className="card-specs">
        <div className="spec-item">
          <FontAwesomeIcon icon={getTypeIcon(racket.type)} />
          <span>{racket.type}</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faGripLines} />
          <span>{racket.flex}</span>
        </div>
        <div className="spec-item">
          <FontAwesomeIcon icon={faWeightHanging} />
          <span>{racket.weights}</span>
        </div>
      </div>
      <span className="card-price-tier">{racket.priceTier}</span>
      {/* Future: Add an onClick handler here to open a detailed modal */}
    </div>
  );
}

export default CompactProductCard;
