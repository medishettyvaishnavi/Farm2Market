import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useNetwork } from "../../context/NetworkContext";
import LanguageSelector from "../common/LanguageSelector";
import VoiceButton from "../common/VoiceButton";
import {
  FaLeaf,
  FaPlusCircle,
  FaStore,
  FaHandshake,
  FaHistory,
  FaUserCircle,
  FaCheckCircle,
  FaWifi,
  FaSignOutAlt,
} from "react-icons/fa";

export default function FarmerNavbar() {
  const { t } = useLanguage();
  const { farmer, logout } = useAuth();
  const { isOnline, toggleSimulatedOffline } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: "/farmer/dashboard", label: t("dashboard"), icon: FaLeaf },
    { path: "/farmer/crops", label: t("myCrops"), icon: FaStore },
    { path: "/farmer/markets", label: t("markets"), icon: FaLeaf },
    { path: "/farmer/buyers", label: t("buyers"), icon: FaHandshake },
    { path: "/farmer/offers", label: t("offers"), icon: FaHandshake },
    { path: "/farmer/orders", label: t("orders"), icon: FaHistory },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm sticky-top py-2">
      <div className="container-fluid px-3 px-lg-4">
        {/* Brand */}
        <Link
          to="/farmer/dashboard"
          className="navbar-brand fw-bold d-flex align-items-center gap-2 fs-4 text-white"
        >
          <span className="bg-white text-success rounded-circle p-1 d-inline-flex align-items-center justify-content-center shadow-sm">
            🌾
          </span>
          <span>{t("appName")}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3 gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li className="nav-item" key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link px-3 py-2 rounded-pill fw-semibold d-flex align-items-center gap-2 transition-all ${
                      isActive
                        ? "bg-white text-success shadow-sm active"
                        : "text-white opacity-90 hover-white"
                    }`}
                  >
                    <Icon className="fs-6" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Utility Actions */}
        <div className="d-flex align-items-center gap-2">
          {/* Add Crop Fast Button */}
          <Link
            to="/farmer/add-crop"
            className="btn btn-warning btn-sm d-flex align-items-center gap-1 fw-bold text-dark rounded-pill px-3 py-2 shadow-sm"
          >
            <FaPlusCircle />
            <span className="d-none d-sm-inline">{t("addCrop")}</span>
          </Link>

          {/* Voice Input / Assistant Button */}
          <VoiceButton
            mode="listen"
            onTranscript={(text) => {
              // If user speaks crop name or intent, navigate or search
              navigate(`/farmer/crops?search=${encodeURIComponent(text)}`);
            }}
          />

          {/* Language Selector */}
          <LanguageSelector variant="dropdown" />

          {/* Network Test Toggle Pill */}
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-2 py-1 d-none d-md-flex align-items-center gap-1 ${
              isOnline ? "btn-outline-light" : "btn-warning text-dark"
            }`}
            style={{ fontSize: "0.75rem" }}
            onClick={toggleSimulatedOffline}
            title="Toggle simulated offline mode for demonstration"
          >
            <FaWifi />
            <span>{isOnline ? "Online" : "Offline"}</span>
          </button>

          {/* Farmer Profile Menu */}
          <div className="dropdown">
            <button
              className="btn btn-light btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm fw-bold dropdown-toggle text-dark"
              type="button"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={() => navigate("/farmer/profile")}
            >
              <FaUserCircle className="text-success fs-5" />
              <span className="d-none d-md-inline text-truncate" style={{ maxWidth: "120px" }}>
                {farmer?.name?.split(" ")[0] || "Farmer"}
              </span>
              {farmer?.isVerified && (
                <FaCheckCircle className="text-primary small" title="Verified Farmer" />
              )}
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="profileDropdown">
              <li>
                <Link className="dropdown-item py-2 fw-semibold" to="/farmer/profile">
                  👤 {t("profile")}
                </Link>
              </li>
              <li>
                <Link className="dropdown-item py-2 fw-semibold" to="/farmer/verification">
                  🛡️ {t("verification")}
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item text-danger py-2 fw-semibold d-flex align-items-center gap-2"
                  onClick={() => {
                    logout();
                    navigate("/farmer/login");
                  }}
                >
                  <FaSignOutAlt /> {t("logout")}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
