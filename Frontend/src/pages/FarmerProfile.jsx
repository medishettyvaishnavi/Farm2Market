import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import FarmerLayout from "../components/layout/FarmerLayout";
import VoiceButton from "../components/common/VoiceButton";
import { formatNumberForSpeech } from "../services/voiceService";
import {
  FaUserCircle,
  FaTractor,
  FaCheckCircle,
  FaShieldAlt,
  FaSave,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaIdCard,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FarmerProfile() {
  const { farmer, updateProfile } = useAuth();
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: farmer?.name || "",
    mobile: farmer?.mobile || "",
    village: farmer?.village || "",
    district: farmer?.district || "Khammam",
    state: farmer?.state || "Telangana",
    landSize: farmer?.landSize || 5,
    soilType: farmer?.soilType || "Black Cotton Soil",
    irrigationType: farmer?.irrigationType || "Borewell & Drip Irrigation",
    primaryCrops: farmer?.primaryCrops?.join(", ") || "Cotton, Red Chilli, Paddy",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      landSize: Number(formData.landSize),
      primaryCrops: formData.primaryCrops.split(",").map((c) => c.trim()),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <FarmerLayout>
      <div className="container py-4">
        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
              <FaUserCircle /> {t("profile")}
            </h2>
            <p className="text-muted mb-0">
              Manage your personal info, farm size, soil type & verification status
            </p>
          </div>
          <VoiceButton
            mode="speak"
            textToSpeak={`${t("profile")}: ${farmer?.name}. ${t("landSize")}: ${formatNumberForSpeech(farmer?.landSize, language)} ${farmer?.landUnit || "Acres"}, ${farmer?.village}. ${t("verificationStatus")}: ${t(farmer?.isVerified ? "verified" : "pending")}.`}
          />
        </div>

        {savedSuccess && (
          <div className="alert alert-success alert-dismissible fade show rounded-4 shadow-sm" role="alert">
            <FaCheckCircle className="me-2" /> Profile & Farm details updated successfully!
          </div>
        )}

        <div className="row g-4">
          {/* Left Column: Quick Profile Card & Verification Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 text-center p-4 mb-4 bg-white">
              <div className="position-relative d-inline-block mx-auto mb-3">
                <div
                  className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                  style={{ width: "90px", height: "90px", fontSize: "40px" }}
                >
                  👨‍🌾
                </div>
                {farmer?.isVerified && (
                  <span
                    className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1"
                    title="Verified Farmer"
                  >
                    <FaCheckCircle />
                  </span>
                )}
              </div>

              <h4 className="fw-bold mb-1">{farmer?.name}</h4>
              <p className="text-muted small mb-2 d-flex align-items-center justify-content-center gap-1">
                <FaMapMarkerAlt className="text-danger" /> {farmer?.village},{" "}
                {farmer?.district}
              </p>

              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
                  🌱 {farmer?.landSize} {farmer?.landUnit || "Acres"}
                </span>
                <span className="badge bg-warning-subtle text-dark border border-warning-subtle px-3 py-2 rounded-pill fw-bold">
                  ⭐ 4.8 Rating
                </span>
              </div>

              <hr />

              {/* Verification Status Banner */}
              <div className="text-start bg-light p-3 rounded-3 mb-3 border">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-bold small text-muted">
                    {t("verificationStatus")}
                  </span>
                  {farmer?.isVerified ? (
                    <span className="badge bg-success d-flex align-items-center gap-1">
                      <FaCheckCircle /> {t("verified")}
                    </span>
                  ) : (
                    <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                      <FaShieldAlt /> {t("pending")}
                    </span>
                  )}
                </div>
                <div className="small text-muted mb-2">
                  Aadhaar: <b>{farmer?.aadhaarNumber || "Uploaded"}</b>
                </div>
                <Link
                  to="/farmer/verification"
                  className="btn btn-outline-success btn-sm w-100 fw-bold rounded-pill"
                >
                  <FaShieldAlt className="me-1" /> View / Update KYC Documents →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Editable Profile & Farm Details Form */}
          <div className="col-lg-8">
            <form onSubmit={handleSave}>
              {/* Personal Details Section */}
              <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
                <h5 className="fw-bold text-success d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
                  <FaIdCard /> {t("personalDetails")}
                </h5>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("farmerName")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control rounded-3"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("mobileNumber")}
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <FaPhoneAlt className="text-muted" />
                      </span>
                      <input
                        type="tel"
                        name="mobile"
                        className="form-control"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("villageLocation")}
                    </label>
                    <input
                      type="text"
                      name="village"
                      className="form-control rounded-3"
                      value={formData.village}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold small">
                      {t("district")}
                    </label>
                    <input
                      type="text"
                      name="district"
                      className="form-control rounded-3"
                      value={formData.district}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold small">
                      {t("state")}
                    </label>
                    <input
                      type="text"
                      name="state"
                      className="form-control rounded-3"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Farm Details Section */}
              <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
                <h5 className="fw-bold text-success d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
                  <FaTractor /> {t("farmDetails")}
                </h5>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("landSize")}
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        step="0.5"
                        name="landSize"
                        className="form-control"
                        value={formData.landSize}
                        onChange={handleChange}
                        required
                      />
                      <span className="input-group-text bg-white">Acres</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("soilType")}
                    </label>
                    <input
                      type="text"
                      name="soilType"
                      className="form-control rounded-3"
                      value={formData.soilType}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      {t("irrigationType")}
                    </label>
                    <input
                      type="text"
                      name="irrigationType"
                      className="form-control rounded-3"
                      value={formData.irrigationType}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      Primary Crops Grown
                    </label>
                    <input
                      type="text"
                      name="primaryCrops"
                      className="form-control rounded-3"
                      value={formData.primaryCrops}
                      onChange={handleChange}
                      placeholder="e.g. Cotton, Chilli, Paddy"
                    />
                  </div>
                </div>
              </div>

              {/* Save Changes Button */}
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-success btn-lg px-5 fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2"
                >
                  <FaSave /> {t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
