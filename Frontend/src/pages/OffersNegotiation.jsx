import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useFarmerData } from "../context/FarmerDataContext";
import FarmerLayout from "../components/layout/FarmerLayout";
import VoiceButton from "../components/common/VoiceButton";
import {
  FaHandshake,
  FaCheck,
  FaTimes,
  FaComments,
  FaRupeeSign,
  FaStar,
  FaCalendarAlt,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

export default function OffersNegotiation() {
  const { t } = useLanguage();
  const { offers, acceptOffer, rejectOffer, counterOffer } = useFarmerData();

  const [activeTab, setActiveTab] = useState("pending"); // 'pending' | 'accepted' | 'countered' | 'all'
  const [selectedOfferForCounter, setSelectedOfferForCounter] = useState(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [counterMessage, setCounterMessage] = useState("");
  const [actionNotice, setActionNotice] = useState(null);

  const filteredOffers = offers.filter((o) => {
    if (activeTab === "all") return true;
    return o.status === activeTab;
  });

  const handleAccept = (offer) => {
    acceptOffer(offer.id);
    setActionNotice({
      type: "success",
      message: `Offer from ${offer.buyerName} accepted! New order has been created.`,
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleReject = (offer) => {
    rejectOffer(offer.id);
    setActionNotice({
      type: "warning",
      message: `Offer from ${offer.buyerName} declined.`,
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCounterSubmit = (e) => {
    e.preventDefault();
    if (!counterPrice) return;
    counterOffer(selectedOfferForCounter.id, counterPrice, counterMessage);
    setSelectedOfferForCounter(null);
    setCounterPrice("");
    setCounterMessage("");
    setActionNotice({
      type: "info",
      message: "Counter offer transmitted to buyer successfully.",
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <FarmerLayout>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
              <FaHandshake /> {t("offers")} (ఆఫర్లు & బేరసారాలు)
            </h2>
            <p className="text-muted mb-0">
              Review live purchase bids from millers & traders. Accept deals or negotiate with counter offers.
            </p>
          </div>
          <VoiceButton
            mode="speak"
            textToSpeak={t("incomingOffers")}
          />
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div
            className={`alert alert-${actionNotice.type} alert-dismissible fade show rounded-4 shadow-sm mb-4`}
            role="alert"
          >
            <FaCheckCircle className="me-2" /> {actionNotice.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setActionNotice(null)}
            ></button>
          </div>
        )}

        {/* Status Tabs */}
        <div className="d-flex gap-2 mb-4 overflow-auto pb-1">
          {[
            {
              id: "pending",
              label: "Pending Bids",
              count: offers.filter((o) => o.status === "pending").length,
            },
            {
              id: "countered",
              label: "In Negotiation",
              count: offers.filter((o) => o.status === "countered").length,
            },
            {
              id: "accepted",
              label: "Accepted Deals",
              count: offers.filter((o) => o.status === "accepted").length,
            },
            { id: "all", label: "All Bids", count: offers.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`btn btn-sm rounded-pill px-4 py-2 fw-bold text-nowrap ${
                activeTab === tab.id
                  ? "btn-success shadow-sm"
                  : "btn-light bg-white border"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Offers List */}
        {filteredOffers.length === 0 ? (
          <div className="card shadow-sm border-0 rounded-4 p-5 text-center bg-white my-4">
            <div className="fs-1 text-muted mb-2">🤝</div>
            <h5 className="fw-bold">No offers under this status</h5>
            <p className="text-muted small mb-0">
              When buyers view your listings or respond to your quotes, bids will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredOffers.map((offer) => (
              <div className="col-lg-6" key={offer.id}>
                <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100 hover-lift d-flex flex-column justify-content-between">
                  <div>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-bold mb-1">
                          🌾 {offer.cropName}
                        </span>
                        <h5 className="fw-bold text-dark mb-0 mt-1">{offer.buyerName}</h5>
                      </div>

                      <span
                        className={`badge ${
                          offer.status === "accepted"
                            ? "bg-success"
                            : offer.status === "countered"
                            ? "bg-warning text-dark"
                            : offer.status === "rejected"
                            ? "bg-danger"
                            : "bg-primary"
                        } px-3 py-2 rounded-pill fw-bold`}
                      >
                        {offer.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-warning-subtle text-dark border border-warning px-2 py-1 rounded-pill small fw-bold">
                        <FaStar className="text-warning" /> {offer.buyerRating}
                      </span>
                      <span className="text-muted small">
                        <FaCalendarAlt className="me-1" /> {offer.offerDate}
                      </span>
                    </div>

                    {/* Price & Quantity Breakdown Box */}
                    <div className="bg-light p-3 rounded-4 mb-3 border">
                      <div className="row g-2 text-center">
                        <div className="col-4">
                          <span className="small text-muted d-block">Volume</span>
                          <span className="fw-bold">
                            {offer.requestedQuantity} {offer.unit}
                          </span>
                        </div>

                        <div className="col-4 border-start border-end">
                          <span className="small text-muted d-block">Offered Price</span>
                          <span className="fw-bold text-success fs-6">
                            ₹{offer.offeredPricePerUnit.toLocaleString()}
                          </span>
                          <span className="small text-muted d-block" style={{ fontSize: "0.7rem" }}>
                            /{offer.unit}
                          </span>
                        </div>

                        <div className="col-4">
                          <span className="small text-muted d-block">Total Payout</span>
                          <span className="fw-bold text-dark fs-6">
                            ₹{offer.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {offer.farmerCounterPrice && (
                        <div className="mt-2 pt-2 border-top text-center small text-primary fw-bold">
                          Your Counter Price: ₹{offer.farmerCounterPrice.toLocaleString()} / {offer.unit}
                        </div>
                      )}
                    </div>

                    {/* Buyer Message */}
                    {offer.notes && (
                      <div className="p-3 bg-white rounded-3 border mb-3 small">
                        <span className="text-muted fw-bold d-block mb-1">
                          Buyer Message / Terms:
                        </span>
                        "{offer.notes}"
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {offer.status === "pending" && (
                    <div className="pt-3 border-top d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill fw-bold px-3 d-flex align-items-center gap-1"
                        onClick={() => handleReject(offer)}
                      >
                        <FaTimes /> Decline
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-warning text-dark btn-sm rounded-pill fw-bold px-3 d-flex align-items-center gap-1"
                        onClick={() => {
                          setSelectedOfferForCounter(offer);
                          setCounterPrice(offer.offeredPricePerUnit + 200);
                        }}
                      >
                        <FaComments /> {t("counterOffer")}
                      </button>

                      <button
                        type="button"
                        className="btn btn-success btn-sm rounded-pill fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-1 shadow-sm"
                        onClick={() => handleAccept(offer)}
                      >
                        <FaCheck /> {t("acceptOffer")}
                      </button>
                    </div>
                  )}

                  {offer.status === "accepted" && (
                    <div className="pt-2 text-center text-success fw-bold small">
                      <FaCheckCircle className="me-1" /> Deal Locked • View Order in Orders Tab
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Counter Offer Modal */}
        {selectedOfferForCounter && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow-lg p-3">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold text-success d-flex align-items-center gap-2">
                    <FaComments /> Counter Negotiate with {selectedOfferForCounter.buyerName}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedOfferForCounter(null)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="alert alert-light border small mb-3">
                    Buyer's current offer: <b>₹{selectedOfferForCounter.offeredPricePerUnit}</b> for {selectedOfferForCounter.requestedQuantity} {selectedOfferForCounter.unit}.
                  </div>

                  <form onSubmit={handleCounterSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">
                        Your Proposed Price (₹/{selectedOfferForCounter.unit})
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          value={counterPrice}
                          onChange={(e) => setCounterPrice(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">
                        Message / Note to Buyer
                      </label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={counterMessage}
                        onChange={(e) => setCounterMessage(e.target.value)}
                        placeholder="e.g. Grain quality is Grade A with zero moisture. Can finalize deal at this price."
                      ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-pill px-3"
                        onClick={() => setSelectedOfferForCounter(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success fw-bold rounded-pill px-4"
                      >
                        Send Counter Price →
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
