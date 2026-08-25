import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/common/LanguageSelector";
import VoiceButton from "../components/common/VoiceButton";
import {
  FaTractor,
  FaStore,
  FaArrowRight,
  FaShieldAlt,
  FaMicrophone,
  FaMobileAlt,
  FaHandshake,
  FaChartLine,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Top Header Bar */}
      <header className="navbar navbar-light bg-white border-bottom shadow-sm py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-3">🌾</span>
            <span className="fw-bold fs-4 text-success">{t("appName")}</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <LanguageSelector variant="dropdown" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container my-auto py-5 text-center">
        <div className="mx-auto" style={{ maxWidth: "750px" }}>
          <div className="badge bg-success-subtle text-success px-4 py-2 rounded-pill fw-bold mb-3 border border-success-subtle shadow-sm">
            🌱 {t("tagline")}
          </div>

          <h1 className="display-4 fw-bold text-dark mb-3">
            {t("heroHeading")} <span className="text-success">{t("heroHeadingHighlight")}</span>
          </h1>

          <p className="lead text-muted mb-4">
            {t("heroSubtitle")}
          </p>

          {/* Voice Summary Audio */}
          <div className="d-flex justify-content-center mb-4">
            <VoiceButton
              mode="speak"
              textToSpeak={t("voiceIntro")}
              label={t("audioGuideLabel")}
            />
          </div>

          {/* Role Entry Cards */}
          <div className="row g-4 justify-content-center mt-2 mb-5">
            {/* Farmer Card */}
            <div className="col-md-6">
              <div
                className="card shadow-sm border-0 rounded-4 p-4 text-start h-100 bg-white hover-lift cursor-pointer border-top border-4 border-success"
                onClick={() => navigate("/farmer/login")}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    className="bg-success text-white rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: "60px", height: "60px", fontSize: "24px" }}
                  >
                    <FaTractor />
                  </div>
                  <span className="badge bg-success">{t("forFarmers")}</span>
                </div>
                <h4 className="fw-bold text-success mb-1">{t("farmerCardTitle")}</h4>
                <p className="text-muted small mb-3">
                  {t("farmerCardDesc")}
                </p>
                <button
                  type="button"
                  className="btn btn-success fw-bold rounded-pill w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                >
                  {t("enterFarmerPortal")} <FaArrowRight />
                </button>
              </div>
            </div>

            {/* Buyer Card */}
            <div className="col-md-6">
              <div
                className="card shadow-sm border-0 rounded-4 p-4 text-start h-100 bg-white hover-lift cursor-pointer border-top border-4 border-primary"
                onClick={() => navigate("/buyer/login")}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: "60px", height: "60px", fontSize: "24px" }}
                  >
                    <FaStore />
                  </div>
                  <span className="badge bg-primary">{t("forBuyers")}</span>
                </div>
                <h4 className="fw-bold text-primary mb-1">{t("buyerCardTitle")}</h4>
                <p className="text-muted small mb-3">
                  {t("buyerCardDesc")}
                </p>
                <button
                  type="button"
                  className="btn btn-primary fw-bold rounded-pill w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                >
                  {t("enterBuyerPortal")} <FaArrowRight />
                </button>
              </div>
            </div>
          </div>

          {/* Key Features Highlights */}
          <div className="row g-3 text-center">
            <div className="col-md-4">
              <div className="p-3 bg-white rounded-4 shadow-sm h-100">
                <FaMicrophone className="text-success fs-2 mb-2" />
                <h6 className="fw-bold mb-1">{t("featureVoiceTitle")}</h6>
                <p className="text-muted small mb-0">
                  {t("featureVoiceDesc")}
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 bg-white rounded-4 shadow-sm h-100">
                <FaChartLine className="text-success fs-2 mb-2" />
                <h6 className="fw-bold mb-1">{t("featureMandiTitle")}</h6>
                <p className="text-muted small mb-0">
                  {t("featureMandiDesc")}
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 bg-white rounded-4 shadow-sm h-100">
                <FaMobileAlt className="text-success fs-2 mb-2" />
                <h6 className="fw-bold mb-1">{t("featureOfflineTitle")}</h6>
                <p className="text-muted small mb-0">
                  {t("featureOfflineDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-3 text-center text-muted small">
        <div className="container">
<<<<<<< HEAD
          🌾 {t("footerText")}
=======
          🌾 Farm2Market © 2026 • Direct Farmer-to-Buyer Marketplace • Multilingual & Voice Enabled • <Link to="/ngo/login" className="text-decoration-none text-success fw-bold">NGO Partner Portal</Link>
>>>>>>> 577a2fe4bc2923cba0c555734d7c2a8b7be2d2a0
        </div>
      </footer>
    </div>
  );
}

export default Home;