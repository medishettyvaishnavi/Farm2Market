import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useFarmerData } from "../context/FarmerDataContext";
import BuyerLayout from "../components/layout/BuyerLayout";
import { liveMandiRates } from "../data/mandiPrices";
import {
  FaSearch,
  FaHandshake,
  FaRupeeSign,
  FaCheckCircle,
  FaChartLine,
  FaHistory,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
  FaTruck,
  FaLeaf,
  FaStore,
  FaStar,
} from "react-icons/fa";

export default function BuyerDashboard() {
  const { farmer: user } = useAuth();
  const { t } = useLanguage();
  const { crops } = useFarmerData();
  const navigate = useNavigate();

  const availableCrops = crops.filter((c) => c.status === "active");
  const organicCrops = crops.filter((c) => c.isOrganic && c.status === "active");

  // Quick stats for buyer
  const stats = [
    {
      label: "Crops Available",
      value: availableCrops.length,
      icon: FaLeaf,
      color: "#2e7d32",
      bg: "#e8f5e9",
      badge: "Browse",
      path: "/buyer/search",
    },
    {
      label: "Organic Listings",
      value: organicCrops.length,
      icon: FaStar,
      color: "#f57c00",
      bg: "#fff3e0",
      badge: "Premium",
      path: "/buyer/search?organic=true",
    },
    {
      label: "Active Negotiations",
      value: 2,
      icon: FaHandshake,
      color: "#1565c0",
      bg: "#e3f2fd",
      badge: "In Progress",
      path: "/buyer/negotiations",
    },
    {
      label: "Orders Placed",
      value: 3,
      icon: FaTruck,
      color: "#6a1b9a",
      bg: "#f3e5f5",
      badge: "Track",
      path: "/buyer/my-orders",
    },
  ];

  return (
    <BuyerLayout>
      <div className="container py-4">

        {/* Welcome Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 bg-white p-4 rounded-4 shadow-sm border">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: "65px", height: "65px", fontSize: "30px", background: "#e3f2fd" }}
            >
              🛒
            </div>
            <div>
              <h3 className="fw-bold text-dark mb-0">
                Welcome, {user?.name?.split(" ")[0] || "Buyer"}!
              </h3>
              <p className="text-muted small mb-0 mt-1">
                🏢 {user?.village || "Verified Buyer"} • Buyer Account
              </p>
            </div>
          </div>
          <Link
            to="/buyer/search"
            className="btn fw-bold rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2 text-white"
            style={{ background: "linear-gradient(135deg,#1565c0,#1e88e5)" }}
          >
            <FaSearch /> Search Available Crops
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div className="col-6 col-lg-3" key={stat.label}>
                <div
                  className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(stat.path)}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="p-2 rounded-3" style={{ background: stat.bg }}>
                      <Icon style={{ color: stat.color, fontSize: "1.3rem" }} />
                    </div>
                    <span className="badge rounded-pill small" style={{ background: stat.bg, color: stat.color }}>
                      {stat.badge}
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0">{stat.value}</h3>
                  <p className="text-muted small mb-0">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Mandi Rates Ticker */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-bold small d-flex align-items-center gap-1" style={{ color: "#1565c0" }}>
              <FaChartLine /> Live Mandi Rates — Buy at the right price
            </span>
            <span className="badge rounded-pill" style={{ background: "#e3f2fd", color: "#1565c0", fontSize: "0.7rem" }}>
              Live
            </span>
          </div>
          <div className="d-flex gap-3 overflow-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {liveMandiRates.slice(0, 6).map((item) => (
              <div
                key={item.crop}
                className="flex-shrink-0 rounded-3 px-3 py-2 text-center"
                style={{ background: "#f8faff", minWidth: "120px", border: "1px solid #e3f2fd" }}
              >
                <div className="fw-bold small text-dark">{item.crop}</div>
                <div className="fw-bold" style={{ color: "#1565c0" }}>
                  {Number.isFinite(Number(item.modalPrice))
                    ? `₹${Number(item.modalPrice).toLocaleString()}`
                    : "Price unavailable"}
                </div>
                <div className={`small d-flex align-items-center justify-content-center gap-1 ${item.trend === "up" ? "text-danger" : "text-success"}`}>
                  {item.trend === "up" ? <FaArrowUp style={{ fontSize: "0.65rem" }} /> : <FaArrowDown style={{ fontSize: "0.65rem" }} />}
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Available Crops */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <FaLeaf className="text-success" /> Available Crops from Farmers
            </h5>
            <Link to="/buyer/search" className="btn btn-sm btn-outline-primary rounded-pill px-3">
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="row g-3">
            {availableCrops.slice(0, 4).map((crop) => (
              <div className="col-md-6 col-lg-3" key={crop.id}>
                <div
                  className="rounded-3 border h-100"
                  style={{ overflow: "hidden", cursor: "pointer" }}
                  onClick={() => navigate("/buyer/search")}
                >
                  {crop.photos?.[0] && (
                    <img
                      src={crop.photos[0]}
                      alt={crop.name}
                      style={{ width: "100%", height: "110px", objectFit: "cover" }}
                    />
                  )}
                  <div className="p-2">
                    <div className="fw-bold small text-dark text-truncate">{crop.name}</div>
                    <div className="small text-muted mb-1">{crop.quantity} {crop.unit}</div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-bold small text-success">
                        {Number.isFinite(Number(crop.expectedPrice))
                          ? `₹${Number(crop.expectedPrice).toLocaleString()}/${crop.unit === "Quintals" ? "Qt" : "Kg"}`
                          : "Price unavailable"}
                      </span>
                      {crop.isOrganic && (
                        <span className="badge bg-success-subtle text-success" style={{ fontSize: "0.65rem" }}>Organic</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row g-3">
          {[
            { icon: "🔍", label: "Search Crops", desc: "Find crops by name, category or location", path: "/buyer/search", color: "#1565c0" },
            { icon: "📊", label: "Market Rates", desc: "Check live mandi prices before buying", path: "/buyer/market-rates", color: "#2e7d32" },
            { icon: "🤝", label: "My Negotiations", desc: "Track ongoing price negotiations", path: "/buyer/negotiations", color: "#f57c00" },
            { icon: "📦", label: "My Orders", desc: "Track delivery and payment status", path: "/buyer/my-orders", color: "#6a1b9a" },
          ].map((action) => (
            <div className="col-md-6 col-lg-3" key={action.label}>
              <div
                className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100 d-flex flex-row align-items-center gap-3"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(action.path)}
              >
                <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "48px", height: "48px", background: action.color + "18", fontSize: "1.4rem" }}>
                  {action.icon}
                </div>
                <div>
                  <div className="fw-bold small text-dark">{action.label}</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>{action.desc}</div>
                </div>
                <FaArrowRight className="ms-auto text-muted flex-shrink-0" style={{ fontSize: "0.8rem" }} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </BuyerLayout>
  );
}
