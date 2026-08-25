import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useFarmerData } from "../context/FarmerDataContext";
import FarmerLayout from "../components/layout/FarmerLayout";
import VoiceButton from "../components/common/VoiceButton";
import { liveMandiRates } from "../data/mandiPrices";
import {
  FaStore,
  FaHandshake,
  FaRupeeSign,
  FaCheckCircle,
  FaPlusCircle,
  FaCloudSun,
  FaChartLine,
  FaMapMarkerAlt,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
  FaTractor,
} from "react-icons/fa";

export default function FarmerDashboard() {
  const { farmer } = useAuth();
  const { t } = useLanguage();
  const { crops, offers, orders } = useFarmerData();
  const navigate = useNavigate();

  const activeCropsCount = crops.filter((c) => c.status === "active").length;
  const pendingOffersCount = offers.filter((o) => o.status === "pending").length;
  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const voiceSummaryText = `Welcome ${farmer?.name}. You have ${activeCropsCount} active crops listed, ${pendingOffersCount} pending buyer offers, and total earnings of ₹${totalRevenue.toLocaleString()}. Today's Mandi rate for Cotton is ₹7,550 per quintal.`;

  return (
    <FarmerLayout>
      <div className="container py-4">
        {/* Welcome Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 bg-white p-4 rounded-4 shadow-sm border">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center p-3 shadow-sm"
              style={{ width: "65px", height: "65px", fontSize: "30px" }}
            >
              👨‍🌾
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h3 className="fw-bold text-dark mb-0">
                  {t("welcome")}, {farmer?.name?.split(" ")[0]}!
                </h3>
                {farmer?.isVerified && (
                  <span className="badge bg-success-subtle text-success border border-success-subtle small py-1 px-2 rounded-pill">
                    <FaCheckCircle className="me-1" /> {t("verified")}
                  </span>
                )}
              </div>
              <p className="text-muted small mb-0 mt-1 d-flex align-items-center gap-1">
                <FaMapMarkerAlt className="text-danger" /> {farmer?.village} • {farmer?.landSize} {farmer?.landUnit || "Acres"} Farm
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <VoiceButton mode="speak" textToSpeak={voiceSummaryText} label="Listen to Summary" />
            <Link
              to="/farmer/add-crop"
              className="btn btn-success fw-bold rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2"
            >
              <FaPlusCircle /> {t("addCrop")}
            </Link>
          </div>
        </div>

        {/* Live Mandi Rates Ticker */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-bold text-success small d-flex align-items-center gap-1">
              <FaChartLine /> {t("mandiTicker")} (లైవ్ మార్కెట్ ధరలు)
            </span>
            <Link to="/farmer/markets" className="small text-decoration-none text-success fw-bold">
              {t("viewAll")} →
            </Link>
          </div>
          <div className="mandi-ticker-track py-1">
            {liveMandiRates.map((rate, idx) => (
              <div
                key={idx}
                className="card border bg-light p-2 rounded-3 shadow-none flex-shrink-0"
                style={{ width: "230px" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold small text-truncate">{rate.crop}</span>
                  <span
                    className={`badge ${
                      rate.trend === "up"
                        ? "bg-success"
                        : rate.trend === "down"
                        ? "bg-danger"
                        : "bg-secondary"
                    } small`}
                  >
                    {rate.trend === "up" ? <FaArrowUp /> : <FaArrowDown />} {rate.changePercent}
                  </span>
                </div>
                <div className="fw-bold text-success fs-6">
                  ₹{rate.modalPrice.toLocaleString()} <span className="small text-muted fw-normal">/{rate.unit}</span>
                </div>
                <div className="small text-muted text-truncate" style={{ fontSize: "0.75rem" }}>
                  {rate.mandi}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div
              className="card shadow-sm border-0 rounded-4 p-3 bg-white hover-lift cursor-pointer"
              onClick={() => navigate("/farmer/crops")}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="bg-success-subtle text-success p-2 rounded-3">
                  <FaStore className="fs-4" />
                </div>
                <span className="badge bg-success-subtle text-success">Live</span>
              </div>
              <h3 className="fw-bold mb-0">{activeCropsCount}</h3>
              <p className="text-muted small mb-0">{t("activeCrops")}</p>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div
              className="card shadow-sm border-0 rounded-4 p-3 bg-white hover-lift cursor-pointer"
              onClick={() => navigate("/farmer/offers")}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="bg-warning-subtle text-warning p-2 rounded-3">
                  <FaHandshake className="fs-4 text-warning" />
                </div>
                <span className="badge bg-warning text-dark">{pendingOffersCount} New</span>
              </div>
              <h3 className="fw-bold mb-0">{pendingOffersCount}</h3>
              <p className="text-muted small mb-0">{t("pendingOffers")}</p>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div
              className="card shadow-sm border-0 rounded-4 p-3 bg-white hover-lift cursor-pointer"
              onClick={() => navigate("/farmer/orders")}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="bg-primary-subtle text-primary p-2 rounded-3">
                  <FaCheckCircle className="fs-4" />
                </div>
                <span className="badge bg-primary">Orders</span>
              </div>
              <h3 className="fw-bold mb-0">{orders.length}</h3>
              <p className="text-muted small mb-0">{t("completedOrders")}</p>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white hover-lift">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="bg-success text-white p-2 rounded-3">
                  <FaRupeeSign className="fs-4" />
                </div>
                <span className="badge bg-success">Received</span>
              </div>
              <h3 className="fw-bold mb-0 text-success">
                ₹{(totalRevenue / 1000).toFixed(1)}k
              </h3>
              <p className="text-muted small mb-0">{t("totalEarnings")}</p>
            </div>
          </div>
        </div>

        {/* Agri-Weather Advisory */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-gradient text-dark border-start border-4 border-warning bg-warning-subtle">
          <div className="d-flex align-items-center gap-3">
            <FaCloudSun className="text-warning fs-1 flex-shrink-0" />
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1">{t("weatherAlert")} (వాతావరణ సలహా)</h6>
              <p className="small mb-0 text-secondary">
                {t("weatherDesc")}
              </p>
            </div>
            <VoiceButton mode="speak" textToSpeak={t("weatherDesc")} />
          </div>
        </div>

        {/* Two-Column Section: Active Listings & Incoming Offers */}
        <div className="row g-4">
          {/* Active Listings Preview */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <FaStore className="text-success" /> {t("myCrops")}
                </h5>
                <Link to="/farmer/crops" className="btn btn-outline-success btn-sm rounded-pill">
                  {t("viewAll")} ({crops.length})
                </Link>
              </div>

              {crops.slice(0, 3).map((crop) => (
                <div key={crop.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light mb-2 border">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={crop.photos[0]}
                      alt={crop.name}
                      className="rounded-3 shadow-sm"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                    <div>
                      <h6 className="fw-bold mb-0">{crop.name}</h6>
                      <span className="small text-muted">
                        {crop.quantity} {crop.unit} • Expected: ₹{crop.expectedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      crop.status === "active"
                        ? "bg-success"
                        : crop.status === "negotiating"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    } rounded-pill px-3 py-2`}
                  >
                    {crop.status === "active" ? t("statusActive") : crop.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Offers Preview */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <FaHandshake className="text-warning" /> {t("incomingOffers")}
                </h5>
                <Link to="/farmer/offers" className="btn btn-outline-warning text-dark btn-sm rounded-pill fw-bold">
                  {t("viewAll")} ({offers.length})
                </Link>
              </div>

              {offers.slice(0, 2).map((offer) => (
                <div key={offer.id} className="p-3 rounded-3 bg-light mb-2 border">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-0 text-success">{offer.cropName}</h6>
                      <p className="small text-muted mb-0">{offer.buyerName}</p>
                    </div>
                    <span className="badge bg-warning text-dark">
                      Offer: ₹{offer.offeredPricePerUnit.toLocaleString()} / {offer.unit}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small text-muted">Total: ₹{offer.totalAmount.toLocaleString()}</span>
                    <button
                      type="button"
                      className="btn btn-success btn-sm px-3 rounded-pill fw-bold"
                      onClick={() => navigate("/farmer/offers")}
                    >
                      Respond <FaArrowRight className="ms-1 small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
