import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useNetwork } from "../../context/NetworkContext";
import LanguageSelector from "../common/LanguageSelector";
import {
  FaSearch,
  FaHandshake,
  FaHistory,
  FaUserCircle,
  FaCheckCircle,
  FaWifi,
  FaSignOutAlt,
  FaTimes,
  FaStore,
  FaChartLine,
} from "react-icons/fa";

export default function BuyerNavbar() {
  const { t } = useLanguage();
  const { farmer: user, logout } = useAuth();
  const { isOnline, toggleSimulatedOffline } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest(".buyer-hamburger-btn")
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const navLinks = [
    { path: "/buyer/dashboard", label: "Dashboard", icon: FaStore },
    { path: "/buyer/search", label: "Search Crops", icon: FaSearch },
    { path: "/buyer/my-orders", label: "My Orders", icon: FaHistory },
    { path: "/buyer/market-rates", label: "Market Rates", icon: FaChartLine },
    { path: "/buyer/negotiations", label: "Negotiations", icon: FaHandshake },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* ── Top Bar ── */}
      <nav
        style={{
          background: "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
          position: "sticky",
          top: 0,
          zIndex: 1040,
          padding: "0.55rem 1rem",
        }}
      >
        <div className="d-flex align-items-center justify-content-between">
          {/* Left: Hamburger + Brand */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="buyer-hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "10px",
                padding: "8px 10px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
              <span style={{ display: "block", width: "22px", height: "2.5px", background: "#fff", borderRadius: "2px" }} />
              <span style={{ display: "block", width: "22px", height: "2.5px", background: "#fff", borderRadius: "2px" }} />
              <span style={{ display: "block", width: "22px", height: "2.5px", background: "#fff", borderRadius: "2px" }} />
            </button>

            <Link to="/buyer/dashboard" className="text-decoration-none d-flex align-items-center gap-2" style={{ color: "#fff" }}>
              <span style={{
                background: "#fff",
                borderRadius: "50%",
                width: "34px",
                height: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
              }}>
                🛒
              </span>
              <span style={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "0.3px" }}>
                {t("appName")} <span style={{ fontSize: "0.75rem", fontWeight: 400, opacity: 0.85 }}>Buyer</span>
              </span>
            </Link>
          </div>

          {/* Right: Search shortcut + Utilities */}
          <div className="d-flex align-items-center gap-2">
            <Link
              to="/buyer/search"
              className="d-flex align-items-center gap-1 fw-bold text-dark text-decoration-none"
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "0.82rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                whiteSpace: "nowrap",
                color: "#1565c0",
              }}
            >
              <FaSearch />
              <span className="d-none d-sm-inline">Search Crops</span>
            </Link>

            <LanguageSelector variant="dropdown" />

            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2 py-1 d-none d-md-flex align-items-center gap-1 ${
                isOnline ? "btn-outline-light" : "btn-warning text-dark"
              }`}
              style={{ fontSize: "0.75rem" }}
              onClick={toggleSimulatedOffline}
              title="Toggle simulated offline mode"
            >
              <FaWifi />
              <span>{isOnline ? "Online" : "Offline"}</span>
            </button>

            <div className="position-relative" ref={profileMenuRef}>
              <button
                className="btn btn-light btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm fw-bold text-dark"
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="Profile Menu"
              >
                <FaUserCircle className="text-primary fs-5" />
                <span className="d-none d-md-inline text-truncate" style={{ maxWidth: "110px" }}>
                  {user?.name?.split(" ")[0] || "Buyer"}
                </span>
              </button>

              {showProfileMenu && (
                <div
                  className="position-absolute end-0 mt-2 card shadow-lg p-2 border-0"
                  style={{ zIndex: 1050, width: "210px", borderRadius: "14px", background: "#ffffff" }}
                >
                  <div className="px-3 py-2 border-bottom mb-1">
                    <div className="fw-bold text-dark text-truncate">{user?.name || "Buyer"}</div>
                    <div className="small text-muted">{user?.village || "Buyer Account"}</div>
                  </div>
                  <Link
                    className="dropdown-item py-2 px-3 fw-semibold rounded d-flex align-items-center gap-2 text-dark"
                    to="/buyer/profile"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FaUserCircle className="text-primary" /> Profile
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

      {/* ── Overlay ── */}
      <div
        onClick={closeSidebar}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 1045,
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
          backdropFilter: sidebarOpen ? "blur(2px)" : "none",
        }}
      />

      {/* ── Sidebar ── */}
      <aside
        ref={sidebarRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "280px",
          background: "linear-gradient(180deg, #1565c0 0%, #0d3b80 100%)",
          zIndex: 1050,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: sidebarOpen ? "4px 0 32px rgba(0,0,0,0.35)" : "none",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.2rem 1.2rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}>
          <div className="d-flex align-items-center gap-2">
            <span style={{
              background: "#fff",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}>🛒</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", lineHeight: 1.2 }}>Buyer Portal</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem" }}>{user?.name || "Buyer"}</div>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            aria-label="Close menu"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            <FaTimes />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "0.8rem 0.8rem" }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "11px 14px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "0.92rem",
                      background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.78)",
                      borderLeft: isActive ? "3px solid #64b5f6" : "3px solid transparent",
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <Icon style={{ fontSize: "1.05rem", flexShrink: 0 }} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.12)",
          padding: "1rem 0.8rem",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}>
          <Link
            to="/buyer/profile"
            onClick={closeSidebar}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "12px",
              textDecoration: "none",
              color: "rgba(255,255,255,0.85)",
              fontWeight: 600,
              fontSize: "0.88rem",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <FaUserCircle style={{ fontSize: "1.1rem" }} />
            <span>Profile</span>
            {user?.isVerified && (
              <FaCheckCircle style={{ fontSize: "0.75rem", color: "#90caf9", marginLeft: "auto" }} />
            )}
          </Link>

          <button
            type="button"
            onClick={() => {
              closeSidebar();
              logout();
              navigate("/farmer/login");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "12px",
              background: "transparent",
              border: "none",
              color: "#ff8a80",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,100,80,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <FaSignOutAlt style={{ fontSize: "1rem" }} />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
