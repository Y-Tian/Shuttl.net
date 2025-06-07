import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Papa from "papaparse";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { GOOGLE_SHEETS_DB_URL } from "./config/constants";
import { RacketsDisplay } from "./pages/Rackets";

function App() {
  const [allRacketsData, setAllRacketsData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <div className="loading-container">
        <div className="circular-loader"></div>
        <p>Loading Racket Data...</p>
      </div>
    );

  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<RacketsDisplay allRacketsData={allRacketsData} />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
