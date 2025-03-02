import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Secretary from "./pages/secretary";
import Optometrist from "./pages/optometrist";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/secretary" element={<Secretary />} />
        <Route path="/" element={<Optometrist />} />
      </Routes>
    </Router>
  );
}

export default App;
