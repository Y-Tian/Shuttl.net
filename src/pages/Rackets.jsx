import React, { useState, useEffect } from "react";
import YearSelector from "../components/YearSelector";
import BrandSelector from "../components/BrandSelector";
import ProductList from "../components/ProductList";
import ProductCard from "../components/ProductCard";

const getUniqueYears = (data) => {
  const years = [...new Set(data.map((racket) => racket.year))].sort(
    (a, b) => b - a
  );
  return ["All Years", ...years];
};
const getUniqueBrands = (data) => {
  const brands = [...new Set(data.map((racket) => racket.brand))].sort();
  return brands;
};

export function RacketsDisplay({ allRacketsData }) {
  const uniqueYears = getUniqueYears(allRacketsData);
  const allAvailableBrands = getUniqueBrands(allRacketsData);

  const [selectedYear, setSelectedYear] = useState(
    uniqueYears[0] || "All Years"
  );
  const [selectedBrands, setSelectedBrands] = useState(allAvailableBrands);
  const [modalRacket, setModalRacket] = useState(null);

  useEffect(() => {
    if (selectedBrands.length === 0 && allAvailableBrands.length > 0) {
      setSelectedBrands(allAvailableBrands);
    }
  }, [allAvailableBrands, selectedBrands.length]);

  const filteredRackets = allRacketsData
    .filter((racket) => {
      const matchesYear =
        selectedYear === "All Years" || racket.year === selectedYear;
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(racket.brand);
      return matchesYear && matchesBrand;
    })
    .sort((a, b) => {
      if (selectedYear === "All Years") {
        return b.year - a.year;
      }
      return 0;
    });

  const handleCardClick = (racket) => {
    setModalRacket(racket);
  };
  const handleCloseModal = () => {
    setModalRacket(null);
  };

  return (
    <div>
      <div className="controls-container">
        <YearSelector
          years={uniqueYears}
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
        />
        <BrandSelector
          brands={allAvailableBrands}
          selectedBrands={selectedBrands}
          onSelectBrands={setSelectedBrands}
        />
      </div>
      <ProductList
        products={filteredRackets}
        categoryTitle={`Badminton Rackets (${selectedYear})`}
        onCardClick={handleCardClick}
      />
      {modalRacket && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              &times;
            </button>
            <ProductCard racket={modalRacket} />
          </div>
        </div>
      )}
    </div>
  );
}
