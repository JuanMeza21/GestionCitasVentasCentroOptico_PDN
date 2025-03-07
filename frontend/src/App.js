import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
<<<<<<< HEAD
import Login from "./components/login"; 
import RegisterAccount from "./components/RegisterAccount";
=======
>>>>>>> juanmeza
import Secretary from "./pages/secretary";
import Optometrist from "./pages/optometrist";

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<RegisterAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/secretary" element={<Secretary />} />
        <Route path="/optometrist" element={<Optometrist />} />
=======
        <Route path="/secretary" element={<Secretary />} />
        <Route path="/" element={<Optometrist />} />
>>>>>>> juanmeza
      </Routes>
    </Router>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> juanmeza
