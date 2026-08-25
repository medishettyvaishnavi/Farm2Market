import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import FarmerLayout from "../components/layout/FarmerLayout";
import VoiceButton from "../components/common/VoiceButton";

import {
  marketPrices,
  priceHistory7Days,
} from "../data/mandiPrices";

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

  // Currently selected crop
  const selectedCrop = marketPrices[selectedCropIndex];

  // Find price history for selected crop
  const selectedHistory = priceHistory7Days.find((item) => {
    if (selectedCrop.crop.startsWith("Cotton")) {
      return item.crop === "Cotton";
    }

    if (selectedCrop.crop.startsWith("Red Chilli")) {
      return item.crop === "Red Chilli";
    }

    if (selectedCrop.crop.startsWith("Paddy")) {
      return item.crop === "Paddy";
    }

    if (selectedCrop.crop.startsWith("Turmeric")) {
      return item.crop === "Turmeric";
    }

    if (selectedCrop.crop.startsWith("Maize")) {
      return item.crop === "Maize";
    }

    return false;
  });

  return (
    <FarmerLayout>
      <div className="container py-4">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

          <div>
            <h2 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
              <FaChartLine />

              {t("priceIntelligence")} (మార్కెట్ ధరలు)
            </h2>

            <p className="text-muted mb-0">
              Current market prices, price trends, and smart
              recommendations to help you get the best value
              for your harvest.
            </p>
          </div>

          <VoiceButton
            mode="speak"
            textToSpeak={t("voicePriceAdvisory")}
          />
        </div>

        {/* =====================================================
            CROP SELECTION
        ====================================================== */}

        <div className="d-flex gap-2 overflow-auto pb-2 mb-4">

          {marketPrices.map((item, idx) => (
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
                    : item.trend === "down"
                    ? "bg-danger-subtle text-danger"
                    : "bg-secondary-subtle text-secondary"
                }`}
              >
                {item.changePercent}
              </span>
            </button>
          ))}
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="row g-4 mb-4">

          {/* =================================================
              MARKET PRICE CARD
          ================================================== */}

          <div className="col-lg-7">

            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">

              {/* Market + Crop */}

              <div className="d-flex justify-content-between align-items-start mb-3">

                <div>

                  <span className="badge bg-success-subtle text-success mb-1">
                    <FaMapMarkerAlt /> {selectedCrop.market}
                  </span>

                  <h3 className="fw-bold text-dark mb-0">
                    {selectedCrop.crop}
                  </h3>

                </div>

                {/* Weekly Change */}

                <div
                  className={`badge ${
                    selectedCrop.trend === "up"
                      ? "bg-success"
                      : selectedCrop.trend === "down"
                      ? "bg-danger"
                      : "bg-secondary"
                  } p-2 rounded-3 fs-6`}
                >

                  {selectedCrop.trend === "up" ? (
                    <FaArrowUp />
                  ) : selectedCrop.trend === "down" ? (
                    <FaArrowDown />
                  ) : null}

                  {" "}

                  {selectedCrop.changePercent} this week
                </div>

              </div>

              {/* =================================================
                  PRICE RANGE
              ================================================== */}

              <div className="row g-3 my-2 text-center">

                {/* Minimum */}

                <div className="col-4">

                  <div className="bg-light p-3 rounded-4 border">

                    <div className="small text-muted mb-1">
                      Minimum Price
                    </div>

                    <div className="fw-bold fs-5 text-secondary">
                      ₹{selectedCrop.minPrice.toLocaleString()}
                    </div>

                    <div className="small text-muted">
                      /{selectedCrop.unit}
                    </div>

                  </div>

                </div>

                {/* Average */}

                <div className="col-4">

                  <div className="bg-success-subtle p-3 rounded-4 border border-success">

                    <div className="small text-success fw-bold mb-1">
                      Current Avg Price
                    </div>

                    <div className="fw-bold fs-4 text-success">
                      ₹{selectedCrop.modalPrice.toLocaleString()}
                    </div>

                    <div className="small text-muted">
                      /{selectedCrop.unit}
                    </div>

                  </div>

                </div>

                {/* Maximum */}

                <div className="col-4">

                  <div className="bg-light p-3 rounded-4 border">

                    <div className="small text-muted mb-1">
                      Maximum Price
                    </div>

                    <div className="fw-bold fs-5 text-dark">
                      ₹{selectedCrop.maxPrice.toLocaleString()}
                    </div>

                    <div className="small text-muted">
                      /{selectedCrop.unit}
                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  7 DAY PRICE HISTORY
              ================================================== */}

              <div className="mt-4">

                <h6 className="fw-bold text-muted small text-uppercase mb-2 d-flex align-items-center gap-1">

                  <FaCalendarAlt />

                  7-Day Market Price Trend

                </h6>

                <div className="table-responsive">

                  <table className="table table-sm table-bordered text-center align-middle mb-0">

                    <thead className="table-light">

                      <tr>

                        {selectedHistory?.prices.map((item, index) => (
                          <th
                            key={index}
                            className="small py-2"
                          >
                            {item.day}
                          </th>
                        ))}

                      </tr>

                    </thead>

                    <tbody>

                      <tr>

                        {selectedHistory?.prices.map((item, index) => (
                          <td
                            key={index}
                            className="small fw-semibold py-2"
                          >
                            ₹{item.price.toLocaleString()}
                          </td>
                        ))}

                      </tr>

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              RECOMMENDATION CARD
          ================================================== */}

          <div className="col-lg-5">

            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100 border-start border-4 border-success">

              {/* Title */}

              <div className="d-flex align-items-center gap-2 mb-3">

                <div className="bg-success text-white p-2 rounded-3">

                  <FaRobot className="fs-4" />

                </div>

                <div>

                  <h5 className="fw-bold mb-0 text-success">
                    {t("aiRecommendation")}
                  </h5>

                  <div className="small text-muted">
                    Smart Market Recommendation
                  </div>

                </div>

              </div>

              {/* =================================================
                  SELLING STRATEGY
              ================================================== */}

              <div className="bg-success-subtle p-3 rounded-4 border border-success-subtle mb-3">

                <div className="d-flex align-items-center gap-2 fw-bold text-success mb-1">

                  <FaLightbulb />

                  Best Selling Strategy:

                </div>

                <p className="mb-0 fw-semibold text-dark">
                  "{selectedCrop.recommendation}"
                </p>

              </div>

              {/* =================================================
                  MARKET INSIGHT
              ================================================== */}

              <div className="mb-3">

                <h6 className="fw-bold text-dark mb-1">
                  Market Demand Insight:
                </h6>

                <p className="small text-muted mb-2">
                  {selectedCrop.advisory}
                </p>

                <div className="badge bg-light text-dark border p-2 rounded-3">

                  Current Market Arrivals:{" "}

                  <b>
                    {selectedCrop.arrivalQty}
                  </b>

                </div>

              </div>

              {/* =================================================
                  LISTEN
              ================================================== */}

              <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">

                <VoiceButton
                  mode="speak"
                  textToSpeak={t("voicePriceAdvisory")}
                  label="Listen Recommendation"
                />

                <span className="small text-muted">
                  Demo data
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            ALL MARKET PRICES
        ====================================================== */}

        <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">

          <h5 className="fw-bold text-success mb-3">
            Current Market Prices
          </h5>

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">

                <tr>

                  <th>Crop</th>

                  <th>Market</th>

                  <th>Min Price</th>

                  <th>Average Price</th>

                  <th>Max Price</th>

                  <th>Trend</th>

                  <th>Recommendation</th>

                </tr>

              </thead>

              <tbody>

                {marketPrices.map((rate, i) => (

                  <tr
                    key={i}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedCropIndex(i)}
                  >

                    <td className="fw-bold text-success">
                      {rate.crop}
                    </td>

                    <td className="small text-muted">
                      {rate.market}
                    </td>

                    <td>
                      ₹{rate.minPrice.toLocaleString()}
                    </td>

                    <td className="fw-bold text-dark fs-6">

                      ₹{rate.modalPrice.toLocaleString()}

                      <span className="small text-muted fw-normal">
                        /{rate.unit}
                      </span>

                    </td>

                    <td>
                      ₹{rate.maxPrice.toLocaleString()}
                    </td>

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

                        {rate.trend === "up" && <FaArrowUp />}
                        {rate.trend === "down" && <FaArrowDown />}

                        {" "}

                        {rate.changePercent}

                      </span>

                    </td>

                    <td
                      className="small text-muted"
                      style={{ maxWidth: "250px" }}
                    >
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