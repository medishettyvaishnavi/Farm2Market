import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import FarmerLogin from "./pages/FarmerLogin";
import FarmerRegister from "./pages/FarmerRegister";
import FarmerProfile from "./pages/FarmerProfile";
import FarmerVerification from "./pages/FarmerVerification";
import FarmerDashboard from "./pages/FarmerDashboard";
import AddCrop from "./pages/AddCrop";
import MyCrops from "./pages/MyCrops";
import PriceTrends from "./pages/PriceTrends";
import NearbyBuyers from "./pages/NearbyBuyers";
import OffersNegotiation from "./pages/OffersNegotiation";
import OrderHistory from "./pages/OrderHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/farmer/login" element={<FarmerLogin />} />
        <Route path="/farmer/register" element={<FarmerRegister />} />

        {/* Aliases for convenience */}
        <Route
          path="/login"
          element={<Navigate to="/farmer/login" replace />}
        />
        <Route
          path="/register"
          element={<Navigate to="/farmer/register" replace />}
        />

        {/* Farmer Main Application Routes */}
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/profile" element={<FarmerProfile />} />
        <Route path="/farmer/verification" element={<FarmerVerification />} />
        <Route path="/farmer/crops" element={<MyCrops />} />
        <Route path="/farmer/add-crop" element={<AddCrop />} />
        <Route path="/farmer/markets" element={<PriceTrends />} />
        <Route path="/farmer/buyers" element={<NearbyBuyers />} />
        <Route path="/farmer/offers" element={<OffersNegotiation />} />
        <Route path="/farmer/orders" element={<OrderHistory />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;