import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

function BrandSelector({ brands, selectedBrands, onSelectBrands }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleCheckboxChange = (event) => {
    const brand = event.target.value;
    if (event.target.checked) {
      onSelectBrands([...selectedBrands, brand]);
    } else {
      onSelectBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  const getDisplayValue = () => {
    if (selectedBrands.length === 0) {
      return "Select Brands";
    }
    if (selectedBrands.length === brands.length) {
      return "All Brands";
    }
    return selectedBrands.join(", ");
  };

  return (
    <div className="brand-selector" ref={dropdownRef}>
      <button
        className="brand-selector-display"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faTag} className="brand-icon" />
        <span>{getDisplayValue()}</span>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="toggle-icon"
        />
      </button>

      {isOpen && (
        <div className="brand-options-dropdown">
          {brands.map((brand) => (
            <label key={brand} className="brand-option-item">
              <input
                type="checkbox"
                value={brand}
                checked={selectedBrands.includes(brand)}
                onChange={handleCheckboxChange}
              />
              {brand}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrandSelector;
