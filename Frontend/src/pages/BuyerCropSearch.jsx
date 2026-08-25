import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useFarmerData } from "../context/FarmerDataContext";
import BuyerLayout from "../components/layout/BuyerLayout";
import VoiceButton from "../components/common/VoiceButton";
import {
  FaSearch,
  FaLeaf,
  FaStar,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaShoppingCart,
  FaHandshake,
  FaTimes,
  FaFilter,
} from "react-icons/fa";

const CATEGORIES = ["All", "Cash Crop", "Spices", "Cereals & Grains", "Vegetables", "Fruits", "Pulses"];
const GRADES = ["All", "Grade A (Premium)", "Grade B (Standard)", "Grade C (Fair)"];

export default function BuyerCropSearch() {
  const { t } = useLanguage();
  const { crops } = useFarmerData();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("All");
  const [grade, setGrade] = useState("All");
  const [organicOnly, setOrganicOnly] = useState(searchParams.get("organic") === "true");
  const [sortBy, setSortBy] = useState("price_asc"); // price_asc | price_desc | newest
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerQty, setOfferQty] = useState("");
  const [offerSent, setOfferSent] = useState(false);

  const filteredCrops = useMemo(() => {
    let list = crops.filter((c) => c.status === "active");

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q) ||
          c.variety?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q)
      );
    }
    if (category !== "All") list = list.filter((c) => c.category === category);
    if (grade !== "All") list = list.filter((c) => c.grade === grade);
    if (organicOnly) list = list.filter((c) => c.isOrganic);

    list = [...list].sort((a, b) => {
      const priceA = Number(a.expectedPrice);
      const priceB = Number(b.expectedPrice);
      const normalizedPriceA = Number.isFinite(priceA) ? priceA : Number.POSITIVE_INFINITY;
      const normalizedPriceB = Number.isFinite(priceB) ? priceB : Number.POSITIVE_INFINITY;

      if (sortBy === "price_asc") return normalizedPriceA - normalizedPriceB;
      if (sortBy === "price_desc") return normalizedPriceB - normalizedPriceA;
      return new Date(b.createdDate) - new Date(a.createdDate);
    });

    return list;
  }, [crops, query, category, grade, organicOnly, sortBy]);

  const handleSendOffer = (e) => {
    e.preventDefault();
    setOfferSent(true);
    setTimeout(() => {
      setOfferSent(false);
      setSelectedCrop(null);
      setOfferPrice("");
      setOfferQty("");
    }, 2500);
  };

  return (
    <BuyerLayout>
      <div className="container py-4">

        {/* Page Header */}
        <div className="mb-4">
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <FaSearch style={{ color: "#1565c0" }} /> Search Crops to Buy
          </h4>
          <p className="text-muted small mb-0">
            Browse fresh crops listed directly by verified farmers. Make an offer or contact to negotiate.
          </p>
        </div>

        {/* Search Bar */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <div className="input-group flex-grow-1" style={{ minWidth: "200px" }}>
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by crop name, category, variety, location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button className="btn btn-light border" onClick={() => setQuery("")}>
                  <FaTimes />
                </button>
              )}
            </div>
            <VoiceButton
              mode="listen"
              onTranscript={(text) => setQuery(text)}
              label="Voice Search"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
          <FaFilter className="text-muted" />

          {/* Category */}
          <select
            className="form-select form-select-sm rounded-pill border"
            style={{ maxWidth: "160px" }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Grade */}
          <select
            className="form-select form-select-sm rounded-pill border"
            style={{ maxWidth: "180px" }}
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            {GRADES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="form-select form-select-sm rounded-pill border"
            style={{ maxWidth: "165px" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>

          {/* Organic Toggle */}
          <div
            className={`d-flex align-items-center gap-2 px-3 py-1 rounded-pill border small fw-semibold cursor-pointer`}
            style={{
              background: organicOnly ? "#e8f5e9" : "#fff",
              color: organicOnly ? "#2e7d32" : "#555",
              borderColor: organicOnly ? "#2e7d32" : "#dee2e6",
              cursor: "pointer",
            }}
            onClick={() => setOrganicOnly((v) => !v)}
          >
            <FaLeaf />
            Organic Only
            {organicOnly && <FaCheckCircle style={{ fontSize: "0.75rem" }} />}
          </div>

          <span className="text-muted small ms-auto">
            {filteredCrops.length} crop{filteredCrops.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Results Grid */}
        {filteredCrops.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "3rem" }}>🌾</div>
            <h5 className="fw-bold mt-3 text-muted">No crops found</h5>
            <p className="text-muted small">Try changing your filters or search query.</p>
          </div>
        ) : (
          <div className="row g-3">
            {filteredCrops.map((crop) => (
              <div className="col-md-6 col-lg-4" key={crop.id}>
                <div className="card shadow-sm border-0 rounded-4 h-100 overflow-hidden">
                  {/* Crop Image */}
                  {crop.photos?.[0] ? (
                    <img
                      src={crop.photos[0]}
                      alt={crop.name}
                      style={{ width: "100%", height: "150px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: "150px", fontSize: "3rem" }}>
                      🌾
                    </div>
                  )}

                  <div className="p-3">
                    {/* Name + Badges */}
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                      <h6 className="fw-bold mb-0 text-dark">{crop.name}</h6>
                      <div className="d-flex gap-1 flex-wrap">
                        {crop.isOrganic && (
                          <span className="badge bg-success-subtle text-success" style={{ fontSize: "0.65rem" }}>🌿 Organic</span>
                        )}
                        <span className="badge bg-primary-subtle text-primary" style={{ fontSize: "0.65rem" }}>{crop.grade?.split(" ")[0]} {crop.grade?.split(" ")[1]}</span>
                      </div>
                    </div>

                    <div className="text-muted small mb-1">{crop.variety}</div>

                    {/* Price */}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div>
                        <span className="fw-bold fs-6 text-success">
                          {Number.isFinite(Number(crop.expectedPrice))
                            ? `₹${Number(crop.expectedPrice).toLocaleString()}`
                            : "Price unavailable"}
                        </span>
                        <span className="text-muted small"> / {crop.unit === "Quintals" ? "Qt" : crop.unit}</span>
                      </div>
                      <span className="text-muted small">
                        {crop.quantity} {crop.unit} available
                      </span>
                    </div>

                    {/* Mandi comparison */}
                    {Number.isFinite(Number(crop.mandiPrice)) && (
                      <div className="small mb-2 px-2 py-1 rounded-2" style={{ background: "#f8f9fa" }}>
                        <span className="text-muted">Mandi rate: </span>
                        <span className="fw-semibold">₹{Number(crop.mandiPrice).toLocaleString()}</span>
                        {Number(crop.expectedPrice) <= Number(crop.mandiPrice) ? (
                          <span className="text-success ms-1 fw-semibold">✓ Good deal</span>
                        ) : (
                          <span className="text-warning ms-1">↑ Above mandi</span>
                        )}
                      </div>
                    )}

                    {/* Location */}
                    {crop.location && (
                      <div className="small text-muted d-flex align-items-center gap-1 mb-3">
                        <FaMapMarkerAlt className="text-danger" style={{ fontSize: "0.7rem" }} />
                        {crop.location}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm fw-bold rounded-pill flex-grow-1 text-white"
                        style={{ background: "linear-gradient(135deg,#1565c0,#1e88e5)" }}
                        onClick={() => {
                          setSelectedCrop(crop);
                          setOfferPrice(Number.isFinite(Number(crop.expectedPrice)) ? crop.expectedPrice : "");
                          setOfferQty(crop.quantity > 10 ? 10 : crop.quantity);
                        }}
                      >
                        <FaHandshake className="me-1" /> Make Offer
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success rounded-pill"
                        title="Add to cart"
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Make Offer Modal */}
        {selectedCrop && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedCrop(null); }}
          >
            <div
              className="card border-0 rounded-4 shadow-lg p-4"
              style={{ width: "100%", maxWidth: "420px" }}
            >
              {offerSent ? (
                <div className="text-center py-4">
                  <div style={{ fontSize: "3rem" }}>✅</div>
                  <h5 className="fw-bold mt-2 text-success">Offer Sent!</h5>
                  <p className="text-muted small">The farmer will review your offer and respond shortly.</p>
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-bold mb-0">Make an Offer</h5>
                    <button className="btn btn-sm btn-light rounded-circle" onClick={() => setSelectedCrop(null)}>
                      <FaTimes />
                    </button>
                  </div>

                  <div className="rounded-3 p-3 mb-3" style={{ background: "#f8f9fa" }}>
                    <div className="fw-bold text-dark">{selectedCrop.name}</div>
                    <div className="small text-muted">{selectedCrop.variety}</div>
                    <div className="small mt-1">
                      Listed price: <span className="fw-bold text-success">₹{selectedCrop.expectedPrice?.toLocaleString()} / {selectedCrop.unit === "Quintals" ? "Qt" : selectedCrop.unit}</span>
                    </div>
                  </div>

                  <form onSubmit={handleSendOffer}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Your Offer Price (₹ per {selectedCrop.unit === "Quintals" ? "quintal" : "unit"})</label>
                      <input
                        type="number"
                        className="form-control"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        placeholder="Enter your price"
                        required
                        min={1}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Quantity Required ({selectedCrop.unit})</label>
                      <input
                        type="number"
                        className="form-control"
                        value={offerQty}
                        onChange={(e) => setOfferQty(e.target.value)}
                        placeholder={`Max ${selectedCrop.quantity} ${selectedCrop.unit}`}
                        required
                        min={1}
                        max={selectedCrop.quantity}
                      />
                    </div>

                    {offerPrice && offerQty && (
                      <div className="rounded-3 p-3 mb-3" style={{ background: "#e8f5e9" }}>
                        <div className="small fw-semibold text-success">
                          Estimated Total: ₹{(Number(offerPrice) * Number(offerQty)).toLocaleString()}
                        </div>
                      </div>
                    )}

                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-light rounded-pill flex-grow-1" onClick={() => setSelectedCrop(null)}>
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn rounded-pill flex-grow-1 text-white fw-bold"
                        style={{ background: "linear-gradient(135deg,#1565c0,#1e88e5)" }}
                      >
                        <FaHandshake className="me-1" /> Send Offer
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </BuyerLayout>
  );
}
