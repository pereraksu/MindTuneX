import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import MoodAnalysis from "../pages/MoodAnalysis";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyze" element={<MoodAnalysis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;