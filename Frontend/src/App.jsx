import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import FarmerLogin from "./pages/FarmerLogin";
import FarmerRegister from "./pages/FarmerRegister";
import FarmerDashboard from "./pages/FarmerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Farmer Auth Routes */}
        <Route path="/farmer/login" element={<FarmerLogin />} />
        <Route path="/farmer/register" element={<FarmerRegister />} />
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />

        {/* Aliases for convenience */}
        <Route path="/login" element={<Navigate to="/farmer/login" replace />} />
        <Route path="/register" element={<Navigate to="/farmer/register" replace />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;