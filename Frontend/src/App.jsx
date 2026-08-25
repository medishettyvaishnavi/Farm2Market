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

// Buyer-specific pages
import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerCropSearch from "./pages/BuyerCropSearch";
import BuyerProfile from "./pages/BuyerProfile";
import { useAuth } from "./context/AuthContext";

function RoleRoute({ allowedRole, children }) {
  const { farmer: user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/farmer/login" replace />;
  }

  if ((user?.role || "farmer") !== allowedRole) {
    return <Navigate to={`/${user?.role || "farmer"}/dashboard`} replace />;
  }

  return children;
}

import BuyerLogin from "./pages/BuyerLogin";
import BuyerRegister from "./pages/BuyerRegister";
import BuyerMarketplace from "./pages/BuyerMarketplace";

import NgoLogin from "./pages/NgoLogin";
import NgoDashboard from "./pages/NgoDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes (shared) */}
        <Route path="/farmer/login" element={<FarmerLogin />} />
        <Route path="/farmer/register" element={<FarmerRegister />} />

        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/register" element={<BuyerRegister />} />
        <Route path="/buyer/marketplace" element={<BuyerMarketplace />} />

        <Route path="/ngo/login" element={<NgoLogin />} />
        <Route path="/ngo/dashboard" element={<NgoDashboard />} />

        {/* Aliases for convenience */}
        <Route path="/login" element={<Navigate to="/farmer/login" replace />} />
        <Route path="/register" element={<Navigate to="/farmer/register" replace />} />

        {/* ── Farmer Routes ── */}
        <Route path="/farmer/dashboard" element={<RoleRoute allowedRole="farmer"><FarmerDashboard /></RoleRoute>} />
        <Route path="/farmer/profile" element={<RoleRoute allowedRole="farmer"><FarmerProfile /></RoleRoute>} />
        <Route path="/farmer/verification" element={<RoleRoute allowedRole="farmer"><FarmerVerification /></RoleRoute>} />
        <Route path="/farmer/crops" element={<RoleRoute allowedRole="farmer"><MyCrops /></RoleRoute>} />
        <Route path="/farmer/add-crop" element={<RoleRoute allowedRole="farmer"><AddCrop /></RoleRoute>} />
        <Route path="/farmer/markets" element={<RoleRoute allowedRole="farmer"><PriceTrends /></RoleRoute>} />
        <Route path="/farmer/buyers" element={<RoleRoute allowedRole="farmer"><NearbyBuyers /></RoleRoute>} />
        <Route path="/farmer/offers" element={<RoleRoute allowedRole="farmer"><OffersNegotiation /></RoleRoute>} />
        <Route path="/farmer/orders" element={<RoleRoute allowedRole="farmer"><OrderHistory /></RoleRoute>} />

        {/* ── Buyer Routes ── */}
        <Route path="/buyer/dashboard" element={<RoleRoute allowedRole="buyer"><BuyerDashboard /></RoleRoute>} />
        <Route path="/buyer/search" element={<RoleRoute allowedRole="buyer"><BuyerCropSearch /></RoleRoute>} />
        <Route path="/buyer/my-orders" element={<RoleRoute allowedRole="buyer"><OrderHistory /></RoleRoute>} />
        <Route path="/buyer/market-rates" element={<RoleRoute allowedRole="buyer"><PriceTrends /></RoleRoute>} />
        <Route path="/buyer/negotiations" element={<RoleRoute allowedRole="buyer"><OffersNegotiation /></RoleRoute>} />
        <Route path="/buyer/profile" element={<RoleRoute allowedRole="buyer"><BuyerProfile /></RoleRoute>} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;