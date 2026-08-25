import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useFarmerData } from "../context/FarmerDataContext";
import FarmerLayout from "../components/layout/FarmerLayout";
import VoiceButton from "../components/common/VoiceButton";
import {
  FaStore,
  FaPlusCircle,
  FaSearch,
  FaTrash,
  FaCheckCircle,
  FaHandshake,
  FaTag,
  FaCalendarAlt,
  FaLeaf,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function MyCrops() {
  const { t } = useLanguage();
  const { crops, updateCrop, deleteCrop } = useFarmerData();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'active' | 'negotiating' | 'sold'
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [showAddedBanner, setShowAddedBanner] = useState(
    searchParams.get("added") === "true"
  );

  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const matchesTab = activeTab === "all" || crop.status === activeTab;
      const matchesSearch =
        !searchQuery ||
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.variety?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [crops, activeTab, searchQuery]);

  const handleToggleStatus = (crop) => {
    const nextStatus = crop.status === "active" ? "sold" : "active";
    updateCrop(crop.id, { status: nextStatus });
  };

  return (
    <FarmerLayout>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
              <FaStore /> {t("myCrops")} (నా పంటలు)
            </h2>
            <p className="text-muted mb-0">
              Manage your active harvest listings, update prices, or mark sold lots.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              to="/farmer/add-crop"
              className="btn btn-success fw-bold rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2"
            >
              <FaPlusCircle /> {t("addCrop")}
            </Link>
          </div>
        </div>

        {/* Added Notification */}
        {showAddedBanner && (
          <div className="alert alert-success alert-dismissible fade show rounded-4 shadow-sm mb-4" role="alert">
            <FaCheckCircle className="me-2" /> {t("voiceCropAdded")}
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowAddedBanner(false)}
            ></button>
          </div>
        )}

        {/* Search Bar & Voice Input */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
          <div className="row g-2 align-items-center">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by crop name, variety, or spices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4 d-flex justify-content-md-end gap-2">
              <VoiceButton
                mode="listen"
                label="Voice Search"
                onTranscript={(text) => setSearchQuery(text)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-pill"
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="d-flex gap-2 mb-4 overflow-auto pb-1">
          {[
            { id: "all", label: "All Listings", count: crops.length },
            {
              id: "active",
              label: t("statusActive"),
              count: crops.filter((c) => c.status === "active").length,
            },
            {
              id: "negotiating",
              label: t("statusNegotiating"),
              count: crops.filter((c) => c.status === "negotiating").length,
            },
            {
              id: "sold",
              label: t("statusSold"),
              count: crops.filter((c) => c.status === "sold").length,
            },
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

        {/* Crop Listings Grid */}
        {filteredCrops.length === 0 ? (
          <div className="card shadow-sm border-0 rounded-4 p-5 text-center bg-white my-4">
            <div className="fs-1 text-muted mb-2">🌾</div>
            <h5 className="fw-bold">{t("noCropsYet")}</h5>
            <p className="text-muted small">
              Add your harvest so that verified buyers in your district can send you direct purchase bids.
            </p>
            <div>
              <Link
                to="/farmer/add-crop"
                className="btn btn-success fw-bold rounded-pill px-4 py-2 mt-2"
              >
                <FaPlusCircle className="me-1" /> {t("addCrop")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredCrops.map((crop) => (
              <div className="col-md-6 col-lg-4" key={crop.id}>
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white h-100 hover-lift">
                  {/* Photo & Badge */}
                  <div className="position-relative">
                    <img
                      src={crop.photos[0]}
                      alt={crop.name}
                      style={{ height: "190px", width: "100%", objectFit: "cover" }}
                    />
                    <span
                      className={`position-absolute top-0 end-0 m-3 badge ${
                        crop.status === "active"
                          ? "bg-success"
                          : crop.status === "negotiating"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      } rounded-pill px-3 py-2 fw-bold shadow`}
                    >
                      {crop.status === "active"
                        ? t("statusActive")
                        : crop.status === "negotiating"
                        ? t("statusNegotiating")
                        : t("statusSold")}
                    </span>

                    {crop.isOrganic && (
                      <span className="position-absolute top-0 start-0 m-3 badge bg-success-subtle text-success border border-success px-3 py-1 rounded-pill fw-bold shadow">
                        🌱 {t("isOrganic")}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h5 className="fw-bold mb-0 text-success">{crop.name}</h5>
                        <span className="badge bg-light text-dark border small">
                          {crop.grade}
                        </span>
                      </div>
                      <p className="text-muted small mb-2">
                        {crop.variety || crop.category}
                      </p>

                      <div className="bg-light p-3 rounded-3 mb-3 border">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="small text-muted">{t("quantity")}:</span>
                          <span className="fw-bold">
                            {crop.quantity} {crop.unit}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="small text-muted">{t("expectedPrice")}:</span>
                          <span className="fw-bold text-success fs-6">
                            ₹{crop.expectedPrice.toLocaleString()} <span className="small text-muted fw-normal">/{crop.unit}</span>
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small text-muted">{t("harvestDate")}:</span>
                          <span className="small text-muted">
                            <FaCalendarAlt className="me-1" /> {crop.harvestDate}
                          </span>
                        </div>
                      </div>

                      {crop.description && (
                        <p className="small text-muted mb-3 line-clamp-2">
                          "{crop.description}"
                        </p>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-top d-flex align-items-center justify-content-between gap-2">
                      <Link
                        to={`/farmer/buyers?crop=${encodeURIComponent(crop.name.split(" ")[0])}`}
                        className="btn btn-outline-success btn-sm rounded-pill fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                      >
                        <FaHandshake /> Find Buyers
                      </Link>

                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill fw-bold px-3 ${
                          crop.status === "active"
                            ? "btn-outline-warning text-dark"
                            : "btn-outline-success"
                        }`}
                        onClick={() => handleToggleStatus(crop)}
                        title="Toggle Active / Sold status"
                      >
                        {crop.status === "active" ? "Mark Sold" : "Re-List"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-circle p-2"
                        onClick={() => {
                          if (confirm(`Delete listing for ${crop.name}?`)) {
                            deleteCrop(crop.id);
                          }
                        }}
                        title="Delete listing"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
