import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import FarmerLayout from "../components/layout/FarmerLayout";
import VoiceButton from "../components/common/VoiceButton";
import { liveMandiRates, priceHistory7Days } from "../data/mandiPrices";
import {
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaLightbulb,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRobot,
} from "react-icons/fa";

export default function PriceTrends() {
  const { t } = useLanguage();
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);

  const selectedCrop = liveMandiRates[selectedCropIndex];

  return (
    <FarmerLayout>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
              <FaChartLine /> {t("priceIntelligence")} (మార్కెట్ ధరలు)
            </h2>
            <p className="text-muted mb-0">
              Live Mandi market rates, price trends, and AI-powered recommendations on the best time to sell your harvest.
            </p>
          </div>
          <VoiceButton
            mode="speak"
            textToSpeak={`${selectedCrop.crop} in ${selectedCrop.mandi} is currently trading at ₹${selectedCrop.modalPrice} per quintal. ${selectedCrop.advisory}`}
          />
        </div>

        {/* Crop Selection Bar */}
        <div className="d-flex gap-2 overflow-auto pb-2 mb-4">
          {liveMandiRates.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className={`btn btn-sm rounded-pill px-4 py-2 fw-bold text-nowrap d-flex align-items-center gap-2 ${
                selectedCropIndex === idx
                  ? "btn-success shadow-sm"
                  : "btn-light bg-white border"
              }`}
              onClick={() => setSelectedCropIndex(idx)}
            >
              <span>{item.crop}</span>
              <span
                className={`badge ${
                  item.trend === "up"
                    ? "bg-success-subtle text-success"
                    : "bg-danger-subtle text-danger"
                }`}
              >
                {item.changePercent}
              </span>
            </button>
          ))}
        </div>

        {/* Main Price Card & AI Advisory */}
        <div className="row g-4 mb-4">
          {/* Live Price Statistics */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className="badge bg-success-subtle text-success mb-1">
                    <FaMapMarkerAlt /> {selectedCrop.mandi}
                  </span>
                  <h3 className="fw-bold text-dark mb-0">{selectedCrop.crop}</h3>
                </div>
                <div
                  className={`badge ${
                    selectedCrop.trend === "up"
                      ? "bg-success"
                      : selectedCrop.trend === "down"
                      ? "bg-danger"
                      : "bg-secondary"
                  } p-2 rounded-3 fs-6`}
                >
                  {selectedCrop.trend === "up" ? <FaArrowUp /> : <FaArrowDown />}{" "}
                  {selectedCrop.changePercent} this week
                </div>
              </div>

              {/* Price Range High / Modal / Low */}
              <div className="row g-3 my-2 text-center">
                <div className="col-4">
                  <div className="bg-light p-3 rounded-4 border">
                    <div className="small text-muted mb-1">Minimum Rate</div>
                    <div className="fw-bold fs-5 text-secondary">
                      ₹{selectedCrop.minPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="bg-success-subtle p-3 rounded-4 border border-success">
                    <div className="small text-success fw-bold mb-1">
                      Modal / Avg Rate
                    </div>
                    <div className="fw-bold fs-4 text-success">
                      ₹{selectedCrop.modalPrice.toLocaleString()}
                    </div>
                    <div className="small text-muted">/{selectedCrop.unit}</div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="bg-light p-3 rounded-4 border">
                    <div className="small text-muted mb-1">Maximum Rate</div>
                    <div className="fw-bold fs-5 text-dark">
                      ₹{selectedCrop.maxPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* 7-Day History Table */}
              <div className="mt-4">
                <h6 className="fw-bold text-muted small text-uppercase mb-2 d-flex align-items-center gap-1">
                  <FaCalendarAlt /> 7-Day Price Movement Trend
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered text-center align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        {priceHistory7Days.map((d, i) => (
                          <th key={i} className="small py-2">
                            {d.day.split(" ")[0]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {priceHistory7Days.map((d, i) => (
                          <td key={i} className="small fw-semibold py-2">
                            ₹{d.Cotton}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendation Engine Card */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-gradient text-dark h-100 border-start border-4 border-success bg-white">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-success text-white p-2 rounded-3">
                  <FaRobot className="fs-4" />
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-success">{t("aiRecommendation")}</h5>
                  <div className="small text-muted">Smart Agri Intelligence</div>
                </div>
              </div>

              {/* Advisory Box */}
              <div className="bg-success-subtle p-3 rounded-4 border border-success-subtle mb-3">
                <div className="d-flex align-items-center gap-2 fw-bold text-success mb-1">
                  <FaLightbulb /> Best Selling Strategy:
                </div>
                <p className="mb-0 fw-semibold text-dark">
                  "{selectedCrop.recommendation}"
                </p>
              </div>

              {/* Market Insight */}
              <div className="mb-3">
                <h6 className="fw-bold text-dark mb-1">Market Arrival & Demand Insight:</h6>
                <p className="small text-muted mb-2">{selectedCrop.advisory}</p>
                <div className="badge bg-light text-dark border p-2 rounded-3">
                  Daily Market Arrivals: <b>{selectedCrop.arrivalQty}</b>
                </div>
              </div>

              {/* Listen advisory */}
              <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                <VoiceButton
                  mode="speak"
                  textToSpeak={selectedCrop.recommendation + ". " + selectedCrop.advisory}
                  label="Listen Advisory"
                />
                <span className="small text-muted">Updated 10 mins ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* All Mandi Prices Table */}
        <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
          <h5 className="fw-bold text-success mb-3">
            All Crops Mandi Rates Comparison
          </h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Crop Name</th>
                  <th>Mandi Market Yard</th>
                  <th>Min Price</th>
                  <th>Modal Price (Avg)</th>
                  <th>Max Price</th>
                  <th>Trend</th>
                  <th>Advisory</th>
                </tr>
              </thead>
              <tbody>
                {liveMandiRates.map((rate, i) => (
                  <tr key={i} style={{ cursor: "pointer" }} onClick={() => setSelectedCropIndex(i)}>
                    <td className="fw-bold text-success">{rate.crop}</td>
                    <td className="small text-muted">{rate.mandi}</td>
                    <td>₹{rate.minPrice.toLocaleString()}</td>
                    <td className="fw-bold text-dark fs-6">
                      ₹{rate.modalPrice.toLocaleString()}{" "}
                      <span className="small text-muted fw-normal">/{rate.unit}</span>
                    </td>
                    <td>₹{rate.maxPrice.toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          rate.trend === "up"
                            ? "bg-success"
                            : rate.trend === "down"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {rate.changePercent}
                      </span>
                    </td>
                    <td className="small text-muted text-truncate" style={{ maxWidth: "200px" }}>
                      {rate.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
