import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Header from './components/Header';
import YearSelector from './components/YearSelector';
import BrandSelector from './components/BrandSelector';
import ProductList from './components/ProductList';
import { GOOGLE_SHEETS_DB_URL } from './config/constants';

// Helper functions (unchanged)
const getUniqueYears = (data) => {
  const years = [...new Set(data.map(racket => racket.year))].sort((a, b) => b - a);
  return ["All Years", ...years];
};
const getUniqueBrands = (data) => {
  const brands = [...new Set(data.map(racket => racket.brand))].sort();
  return brands;
};

function App() {
  const [allRacketsData, setAllRacketsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch and parse CSV from Google Sheets
  useEffect(() => {
    setLoading(true);
    Papa.parse(GOOGLE_SHEETS_DB_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      newline: "",
      complete: (results) => {
        setAllRacketsData(results.data);
        setLoading(false);
      },
      error: () => setLoading(false),
    });
  }, []);

  const uniqueYears = getUniqueYears(allRacketsData);
  const allAvailableBrands = getUniqueBrands(allRacketsData);

  const [selectedYear, setSelectedYear] = useState(uniqueYears[0] || "All Years");
  const [selectedBrands, setSelectedBrands] = useState(allAvailableBrands);

  useEffect(() => {
    if (selectedBrands.length === 0 && allAvailableBrands.length > 0) {
      setSelectedBrands(allAvailableBrands);
      console.log(setSelectedBrands);
    }
  }, [allAvailableBrands]);

  const filteredRackets = allRacketsData.filter(racket => {
    const matchesYear = selectedYear === "All Years" || racket.year === selectedYear;
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(racket.brand);
    return matchesYear && matchesBrand;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <main className="main-content">
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
        <ProductList products={filteredRackets} categoryTitle={`Badminton Rackets (${selectedYear})`} />
      </main>
    </>
  );
}

export default App;