import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useFarmerData } from "../context/FarmerDataContext";
import FarmerLayout from "../components/layout/FarmerLayout";
import VoiceButton from "../components/common/VoiceButton";
import {
  FaHandshake,
  FaSearch,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPhoneAlt,
  FaTruck,
  FaStar,
  FaMoneyBillWave,
  FaPaperPlane,
} from "react-icons/fa";

export default function NearbyBuyers() {
  const { t } = useLanguage();
  const { buyers } = useFarmerData();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("crop") || "");
  const [maxDistance, setMaxDistance] = useState("all"); // '10' | '25' | '50' | 'all'
  const [selectedBuyerForQuote, setSelectedBuyerForQuote] = useState(null);
  const [quoteSent, setQuoteSent] = useState(false);

  const filteredBuyers = useMemo(() => {
    return buyers.filter((buyer) => {
      const matchesSearch =
        !searchQuery ||
        buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.demandingCrops.some((c) =>
          c.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        buyer.buyerType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDistance =
        maxDistance === "all" || buyer.distanceKm <= Number(maxDistance);

      return matchesSearch && matchesDistance;
    });
  }, [buyers, searchQuery, maxDistance]);

  const handleSendQuote = (e) => {
    e.preventDefault();
    setQuoteSent(true);
    setTimeout(() => {
      setQuoteSent(false);
      setSelectedBuyerForQuote(null);
    }, 2500);
  };

  return (
    <FarmerLayout>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
              <FaHandshake /> {t("buyerDiscovery")} (సమీప కొనుగోలుదారులు)
            </h2>
            <p className="text-muted mb-0">
              Directly discover verified grain millers, ginning mills, and exporters near your village.
            </p>
          </div>
          <VoiceButton
            mode="speak"
            textToSpeak="Explore verified buyers near you. Filter by distance, compare offered prices, and send direct selling quotes."
          />
        </div>

        {/* Search & Distance Filter Bar */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder={t("searchBuyersPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Distance Filter Chips */}
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-1 flex-wrap">
                <span className="small text-muted fw-bold me-1">
                  <FaMapMarkerAlt className="text-danger" /> Distance:
                </span>
                {[
                  { id: "all", label: "All" },
                  { id: "10", label: "< 10 km" },
                  { id: "25", label: "< 25 km" },
                  { id: "50", label: "< 50 km" },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 ${
                      maxDistance === d.id
                        ? "btn-success fw-bold"
                        : "btn-outline-secondary bg-white"
                    }`}
                    onClick={() => setMaxDistance(d.id)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Search Button */}
            <div className="col-md-2 text-md-end">
              <VoiceButton
                mode="listen"
                label="Voice Search"
                onTranscript={(text) => setSearchQuery(text)}
              />
            </div>
          </div>
        </div>

        {/* Buyers Grid */}
        <div className="row g-4">
          {filteredBuyers.map((buyer) => (
            <div className="col-lg-6" key={buyer.id}>
              <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100 hover-lift d-flex flex-column justify-content-between">
                <div>
                  {/* Top Row: Name, Verified Badge, Rating */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h5 className="fw-bold text-dark mb-0">{buyer.name}</h5>
                        {buyer.verified && (
                          <FaCheckCircle className="text-primary small" title="Verified Buyer" />
                        )}
                      </div>
                      <span className="badge bg-light text-muted border mt-1">
                        {buyer.buyerType}
                      </span>
                    </div>

                    <span className="badge bg-warning-subtle text-dark border border-warning px-2 py-1 rounded-pill fw-bold d-flex align-items-center gap-1">
                      <FaStar className="text-warning" /> {buyer.rating}
                    </span>
                  </div>

                  {/* Distance & Location */}
                  <p className="text-muted small mb-3 d-flex align-items-center gap-1">
                    <FaMapMarkerAlt className="text-danger" /> {buyer.location} •{" "}
                    <b className="text-dark">{buyer.distanceKm} km away</b>
                  </p>

                  {/* Demanding Crops Badges */}
                  <div className="mb-3">
                    <div className="small fw-bold text-muted mb-1">
                      Demanded Harvest (అవసరమైన పంటలు):
                    </div>
                    <div className="d-flex gap-1 flex-wrap">
                      {buyer.demandingCrops.map((c, i) => (
                        <span key={i} className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold">
                          🌾 {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Offering Rate & Payment Terms */}
                  <div className="bg-light p-3 rounded-4 mb-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small text-muted">Indicative Offer Rate:</span>
                      <span className="fw-bold text-success fs-6">
                        {buyer.offeringRate}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small text-muted">Required Volume:</span>
                      <span className="fw-bold small">{buyer.requiredQuantity}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small text-muted">Payment Terms:</span>
                      <span className="badge bg-success small text-truncate" style={{ maxWidth: "220px" }}>
                        <FaMoneyBillWave className="me-1" /> {buyer.paymentTerms}
                      </span>
                    </div>
                  </div>

                  {/* Transport Tag */}
                  {buyer.transportProvided && (
                    <div className="small text-success fw-bold d-flex align-items-center gap-1 mb-3">
                      <FaTruck /> Free Truck Transport from your Farm Provided
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-top d-flex gap-2">
                  <a
                    href={`tel:${buyer.phone}`}
                    className="btn btn-outline-success btn-sm rounded-pill fw-bold px-3 d-flex align-items-center gap-1"
                  >
                    <FaPhoneAlt /> Call
                  </a>

                  <button
                    type="button"
                    className="btn btn-success btn-sm rounded-pill fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-1 shadow-sm"
                    onClick={() => setSelectedBuyerForQuote(buyer)}
                  >
                    <FaPaperPlane /> Send Direct Crop Offer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Send Direct Quote Modal */}
        {selectedBuyerForQuote && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow-lg p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold text-success d-flex align-items-center gap-2">
                    <FaPaperPlane /> Send Offer to {selectedBuyerForQuote.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedBuyerForQuote(null)}
                  ></button>
                </div>

                <div className="modal-body">
                  {quoteSent ? (
                    <div className="alert alert-success text-center py-4 rounded-4">
                      <FaCheckCircle className="fs-1 text-success mb-2 d-block mx-auto" />
                      <h5 className="fw-bold">Offer Sent Successfully!</h5>
                      <p className="small mb-0">
                        {selectedBuyerForQuote.name} will review your crop offer and respond within 2 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendQuote}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold small">
                          Select Crop Lot
                        </label>
                        <select className="form-select rounded-3" required>
                          <option value="cotton">Cotton (45 Quintals available)</option>
                          <option value="chilli">Red Chilli (20 Quintals available)</option>
                          <option value="paddy">Paddy / Rice (120 Quintals available)</option>
                        </select>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <label className="form-label fw-semibold small">
                            Quantity (Quintals)
                          </label>
                          <input
                            type="number"
                            className="form-control rounded-3"
                            defaultValue="20"
                            required
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label fw-semibold small">
                            Your Quote Price (₹/Quintal)
                          </label>
                          <input
                            type="number"
                            className="form-control rounded-3"
                            defaultValue="7600"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold small">
                          Notes / Pickup Availability
                        </label>
                        <textarea
                          className="form-control rounded-3"
                          rows="2"
                          placeholder="e.g. Ready for loading at farm gate from tomorrow morning."
                        ></textarea>
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary rounded-pill px-3"
                          onClick={() => setSelectedBuyerForQuote(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-success fw-bold rounded-pill px-4"
                        >
                          Submit Direct Offer →
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
