import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import FarmerLayout from "../components/layout/FarmerLayout";
import VoiceButton from "../components/common/VoiceButton";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaFileUpload,
  FaIdCard,
  FaFileAlt,
  FaCamera,
  FaInfoCircle,
} from "react-icons/fa";

export default function FarmerVerification() {
  const { farmer, submitVerification } = useAuth();
  const { t } = useLanguage();

  const [aadhaar, setAadhaar] = useState(farmer?.aadhaarNumber || "9876-5432-4892");
  const [passbookNo, setPassbookNo] = useState(farmer?.pattadarPassbookNo || "TS/KHM/2023/8849");
  const [docFile, setDocFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=60"
  );

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitVerification({
      aadhaarNumber: aadhaar,
      pattadarPassbookNo: passbookNo,
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <FarmerLayout>
      <div className="container py-4" style={{ maxWidth: "900px" }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
              <FaShieldAlt /> {t("verification")} (రైతు ధృవీకరణ)
            </h2>
            <p className="text-muted mb-0">
              Upload your government ID & land passbook to earn the Verified Farmer badge & direct buyer trust.
            </p>
          </div>
          <VoiceButton
            mode="speak"
            textToSpeak={t("idVerification")}
          />
        </div>

        {submitted && (
          <div className="alert alert-success alert-dismissible fade show rounded-4 shadow-sm" role="alert">
            <FaCheckCircle className="me-2" /> Documents submitted successfully! Your verification is currently under review by our agri-officer team.
          </div>
        )}

        {/* Verification Status Stepper Banner */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className={`rounded-circle p-3 d-flex align-items-center justify-content-center text-white ${
                  farmer?.isVerified ? "bg-success" : "bg-warning"
                }`}
                style={{ width: "60px", height: "60px", fontSize: "24px" }}
              >
                {farmer?.isVerified ? <FaCheckCircle /> : <FaShieldAlt />}
              </div>
              <div>
                <h5 className="fw-bold mb-1">
                  {farmer?.isVerified ? t("verified") : t("pending")}
                </h5>
                <p className="text-muted small mb-0">
                  {farmer?.isVerified
                    ? "Your Pattadar Passbook & Aadhaar are verified. You can sell unlimited crops."
                    : "Documents uploaded. Verification takes less than 2 hours."}
                </p>
              </div>
            </div>

            <div className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
              ID: {farmer?.id}
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit}>
          <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
            <h5 className="fw-bold text-success d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
              <FaIdCard /> 1. Government Identity Verification
            </h5>

            <div className="mb-3">
              <label className="form-label fw-semibold small">
                {t("aadhaarNumber")} / Voter ID
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaIdCard className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  placeholder="Enter 12-digit Aadhaar / Farmer ID"
                  required
                />
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
            <h5 className="fw-bold text-success d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
              <FaFileAlt /> 2. Land Ownership Proof (Pattadar Passbook / 1-B Record)
            </h5>

            <div className="mb-3">
              <label className="form-label fw-semibold small">
                Pattadar Passbook / Khata Number
              </label>
              <input
                type="text"
                className="form-control mb-3"
                value={passbookNo}
                onChange={(e) => setPassbookNo(e.target.value)}
                placeholder="e.g. TS/KHM/2023/8849"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">
                {t("passbookUpload")} (Photo or PDF)
              </label>
              <div
                className="border border-2 border-dashed rounded-4 p-4 text-center bg-light"
                style={{ cursor: "pointer" }}
                onClick={() => document.getElementById("docInput").click()}
              >
                <input
                  type="file"
                  id="docInput"
                  className="d-none"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                />
                <FaFileUpload className="text-success fs-1 mb-2" />
                <h6 className="fw-bold mb-1">
                  Click to Upload or Snap Photo of Document
                </h6>
                <p className="text-muted small mb-0">
                  Supported formats: JPG, PNG, PDF (Max size: 10MB)
                </p>
                {docFile && (
                  <div className="badge bg-success mt-2 py-2 px-3">
                    Selected: {docFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* Document Preview */}
            {previewUrl && (
              <div className="mt-3 p-3 bg-light rounded-3 border">
                <div className="small fw-bold text-muted mb-2 d-flex align-items-center gap-1">
                  <FaCamera /> Document Preview:
                </div>
                <img
                  src={previewUrl}
                  alt="Document Preview"
                  className="img-fluid rounded-3 shadow-sm border"
                  style={{ maxHeight: "180px", objectFit: "cover" }}
                />
              </div>
            )}
          </div>

          <div className="alert alert-info d-flex align-items-center gap-2 rounded-3 small">
            <FaInfoCircle className="fs-5 flex-shrink-0" />
            <span>
              Your personal data is encrypted and used solely for farmer-buyer verification compliance according to agricultural trade norms.
            </span>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-success btn-lg px-5 fw-bold rounded-pill shadow-sm"
            >
              {t("submit")} Documents For Verification →
            </button>
          </div>
        </form>
      </div>
    </FarmerLayout>
  );
}
