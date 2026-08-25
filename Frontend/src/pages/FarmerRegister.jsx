import { useForm } from "react-hook-form";
import { FaUser, FaMobileAlt, FaLock, FaMapMarkerAlt, FaTractor } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import LanguageSelector from "../components/common/LanguageSelector";
import VoiceButton from "../components/common/VoiceButton";

function FarmerRegister() {
  const navigate = useNavigate();
  const { t, changeLanguage } = useLanguage();
  const { registerFarmer } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      location: "",
      landSize: "5",
      soilType: "Black Cotton Soil",
      irrigationType: "Borewell",
      language: "te",
    },
  });

  const password = watch("password");

  const onSubmit = (data) => {
    registerFarmer(data);
    navigate("/farmer/dashboard");
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light py-4">
      {/* Top Language Bar */}
      <div className="mb-3">
        <LanguageSelector variant="pills" />
      </div>

      <div
        className="card shadow-lg p-4 border-0 my-3"
        style={{ width: "100%", maxWidth: "520px", borderRadius: "20px" }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-2 shadow-sm"
            style={{ width: "55px", height: "55px", fontSize: "26px" }}
          >
            🌾
          </div>
          <h2 className="fw-bold text-success mb-0">{t("appName")}</h2>
          <p className="text-muted small mt-1">{t("tagline")}</p>
          <div className="badge bg-success text-white px-3 py-2 rounded-pill fw-bold">
            👨‍🌾 {t("register")}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Section: Personal Info */}
          <div className="p-3 bg-light rounded-4 mb-3 border">
            <h6 className="fw-bold text-success d-flex align-items-center gap-2 mb-3">
              <FaUser /> {t("personalDetails")}
            </h6>

            {/* Name */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label fw-semibold small mb-0">
                  {t("farmerName")}
                </label>
                <VoiceButton
                  mode="listen"
                  label="Speak"
                  onTranscript={(text) => setValue("name", text)}
                />
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaUser className="text-success" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Kumar"
                  {...register("name", {
                    required: "Farmer Name is required",
                  })}
                />
              </div>
              {errors.name && (
                <small className="text-danger">{errors.name.message}</small>
              )}
            </div>

            {/* Mobile */}
            <div className="mb-3">
              <label className="form-label fw-semibold small">
                {t("mobileNumber")}
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaMobileAlt className="text-success" />
                </span>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter 10-digit mobile number"
                  {...register("mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit mobile number",
                    },
                  })}
                />
              </div>
              {errors.mobile && (
                <small className="text-danger">{errors.mobile.message}</small>
              )}
            </div>

            {/* Location / Village */}
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label fw-semibold small mb-0">
                  {t("villageLocation")}
                </label>
                <VoiceButton
                  mode="listen"
                  label="Speak"
                  onTranscript={(text) => setValue("location", text)}
                />
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaMapMarkerAlt className="text-success" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Khammam Rural, Telangana"
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
              </div>
              {errors.location && (
                <small className="text-danger">{errors.location.message}</small>
              )}
            </div>
          </div>

          {/* Section: Farm Details */}
          <div className="p-3 bg-light rounded-4 mb-3 border">
            <h6 className="fw-bold text-success d-flex align-items-center gap-2 mb-3">
              <FaTractor /> {t("farmDetails")}
            </h6>

            <div className="row g-2 mb-2">
              <div className="col-6">
                <label className="form-label fw-semibold small">
                  {t("landSize")}
                </label>
                <input
                  type="number"
                  step="0.5"
                  className="form-control"
                  placeholder="e.g. 5"
                  {...register("landSize", { required: true })}
                />
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold small">
                  {t("soilType")}
                </label>
                <select className="form-select" {...register("soilType")}>
                  <option value="Black Cotton Soil">Black Cotton Soil (నల్లరేగడి)</option>
                  <option value="Red Sandy Loam">Red Sandy Loam (ఎర్ర నేల)</option>
                  <option value="Alluvial Soil">Alluvial Soil (ఒండ్రు నేల)</option>
                  <option value="Clayey Soil">Clayey Soil (బంకమట్టి)</option>
                </select>
              </div>
            </div>

            <div className="mb-1">
              <label className="form-label fw-semibold small">
                {t("irrigationType")}
              </label>
              <select className="form-select" {...register("irrigationType")}>
                <option value="Borewell">{t("borewell")}</option>
                <option value="Canal Water">{t("canal")}</option>
                <option value="Drip Irrigation">{t("drip")}</option>
                <option value="Rainfed">{t("rainfed")}</option>
              </select>
            </div>
          </div>

          {/* Section: Security & Language */}
          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">
                Create Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaLock className="text-success" />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="At least 6 chars"
                  {...register("password", {
                    required: "Password required",
                    minLength: {
                      value: 6,
                      message: "Min 6 characters",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <small className="text-danger">{errors.password.message}</small>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small">
                Preferred Language
              </label>
              <select
                className="form-select"
                {...register("language")}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                <option value="te">తెలుగు (Telugu)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm fs-6 mt-2"
          >
            {t("register")} & Enter Dashboard →
          </button>
        </form>

        {/* Footer / Login link */}
        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted mb-1 small">
            Already have a Farmer account?
          </p>
          <Link
            to="/farmer/login"
            className="btn btn-outline-success btn-sm fw-bold px-4 rounded-pill"
          >
            {t("login")}
          </Link>
          <div className="mt-2">
            <Link to="/" className="text-secondary small text-decoration-none">
              ← {t("home")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerRegister;