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
  const [searchTerm, setSearchTerm] = useState("");

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
      // Search by subModel, model, or brand (case-insensitive)
      const search = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !search ||
        (racket.subModel && racket.subModel.toLowerCase().includes(search)) ||
        (racket.model && racket.model.toLowerCase().includes(search)) ||
        (racket.brand && racket.brand.toLowerCase().includes(search));
      return matchesYear && matchesBrand && matchesSearch;
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
      <div
        className="controls-container"
        style={{ flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          placeholder="Search rackets by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "1rem",
            width: "100%",
            maxWidth: "400px",
          }}
        />
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
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
