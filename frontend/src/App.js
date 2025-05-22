import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login"; 
import RegisterAccount from "./components/RegisterAccount";
import Secretary from "./pages/secretary";
import Optometrist from "./pages/optometrist";
import Admin from "./pages/admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<RegisterAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/secretary" element={<Secretary />} />
        <Route path="/optometrist" element={<Optometrist />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;