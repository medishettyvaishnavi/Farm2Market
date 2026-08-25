import { useState, useRef, useEffect } from "react";
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
  FaShieldAlt,
} from "react-icons/fa";

export default function FarmerNavbar() {
  const { t } = useLanguage();
  const { farmer, logout } = useAuth();
  const { isOnline, toggleSimulatedOffline } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          className="navbar-brand fw-bold d-flex align-items-center gap-2 fs-4 text-white text-decoration-none"
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
          <div className="position-relative" ref={profileMenuRef}>
            <button
              className="btn btn-light btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm fw-bold text-dark"
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Profile Menu"
            >
              <FaUserCircle className="text-success fs-5" />
              <span className="d-none d-md-inline text-truncate" style={{ maxWidth: "120px" }}>
                {farmer?.name?.split(" ")[0] || "Farmer"}
              </span>
              {farmer?.isVerified && (
                <FaCheckCircle className="text-primary small" title="Verified Farmer" />
              )}
            </button>

            {showProfileMenu && (
              <div
                className="position-absolute end-0 mt-2 card shadow-lg p-2 border-0"
                style={{
                  zIndex: 1050,
                  width: "210px",
                  borderRadius: "14px",
                  background: "#ffffff",
                }}
              >
                <div className="px-3 py-2 border-bottom mb-1">
                  <div className="fw-bold text-dark text-truncate">{farmer?.name || "Farmer"}</div>
                  <div className="small text-muted">{farmer?.village || "Telangana"}</div>
                </div>

                <Link
                  className="dropdown-item py-2 px-3 fw-semibold rounded d-flex align-items-center gap-2 text-dark"
                  to="/farmer/profile"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <FaUserCircle className="text-success" /> {t("profile")}
                </Link>

                <Link
                  className="dropdown-item py-2 px-3 fw-semibold rounded d-flex align-items-center gap-2 text-dark"
                  to="/farmer/verification"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <FaShieldAlt className="text-primary" /> {t("verification")}
                </Link>

                <hr className="my-1" />

                <button
                  type="button"
                  className="dropdown-item text-danger py-2 px-3 fw-semibold rounded d-flex align-items-center gap-2 border-0 bg-transparent w-100 text-start"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate("/farmer/login");
                  }}
                >
                  <FaSignOutAlt /> {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
