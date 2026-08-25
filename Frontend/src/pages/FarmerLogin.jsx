import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaUser,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaLock,
  FaTractor,
  FaStore,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import LanguageSelector from "../components/common/LanguageSelector";
import VoiceButton from "../components/common/VoiceButton";

function FarmerLogin() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState("farmer"); // 'farmer' | 'buyer'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      location: "",
      mobile: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await login({
      mobile: data.mobile,
      password: data.password,
      role: selectedRole.toUpperCase(),
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    if (selectedRole === "farmer") {
      navigate("/farmer/dashboard");
    } else {
      navigate("/farmer/buyers");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light py-4">
      {/* Top Language Bar */}
      <div className="mb-3">
        <LanguageSelector variant="pills" />
      </div>

      <div
        className="card shadow-lg p-4 border-0"
        style={{ width: "100%", maxWidth: "460px", borderRadius: "20px" }}
      >
        {/* Brand Header */}
        <div className="text-center mb-3">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-2 shadow-sm"
            style={{ width: "55px", height: "55px", fontSize: "26px" }}
          >
            🌾
          </div>
          <h2 className="fw-bold text-success mb-0">{t("appName")}</h2>
          <p className="text-muted small mt-1">{t("tagline")}</p>
        </div>

        {/* 1. Role Selection (Purely in preferred language) */}
        <div className="mb-3">
          <label className="form-label fw-bold small text-muted text-uppercase mb-2 d-block">
            {t("selectRole")}:
          </label>
          <div className="row g-2">
            <div className="col-6">
              <button
                type="button"
                className={`btn w-100 p-3 rounded-3 text-start border d-flex align-items-center gap-2 ${
                  selectedRole === "farmer"
                    ? "btn-success shadow-sm"
                    : "btn-light bg-white"
                }`}
                onClick={() => setSelectedRole("farmer")}
              >
                <FaTractor className="fs-3 flex-shrink-0" />
                <div>
                  <div className="fw-bold fs-6">{t("farmer")}</div>
                  <div
                    className={`small ${
                      selectedRole === "farmer" ? "text-light opacity-90" : "text-muted"
                    }`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {t("farmerDesc")}
                  </div>
                </div>
              </button>
            </div>

            <div className="col-6">
              <button
                type="button"
                className={`btn w-100 p-3 rounded-3 text-start border d-flex align-items-center gap-2 ${
                  selectedRole === "buyer"
                    ? "btn-success shadow-sm"
                    : "btn-light bg-white"
                }`}
                onClick={() => setSelectedRole("buyer")}
              >
                <FaStore className="fs-3 flex-shrink-0" />
                <div>
                  <div className="fw-bold fs-6">{t("buyer")}</div>
                  <div
                    className={`small ${
                      selectedRole === "buyer" ? "text-light opacity-90" : "text-muted"
                    }`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {t("buyerDesc")}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Login Form (Password only) */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 1. Name */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label fw-semibold small mb-0">
                {t("fullName")}
              </label>
              <VoiceButton
                mode="listen"
                label={t("speak")}
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
                placeholder={t("fullNamePlaceholder")}
                {...register("name", { required: "Name is required" })}
              />
            </div>
            {errors.name && (
              <small className="text-danger">{errors.name.message}</small>
            )}
          </div>

          {/* 2. Location */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label fw-semibold small mb-0">
                {t("location")}
              </label>
              <VoiceButton
                mode="listen"
                label={t("speak")}
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
                placeholder={t("locationPlaceholder")}
                {...register("location", { required: "Location is required" })}
              />
            </div>
            {errors.location && (
              <small className="text-danger">{errors.location.message}</small>
            )}
          </div>

          {/* 3. Mobile Number */}
          <div className="mb-3">
            <label className="form-label fw-semibold small mb-1">
              {t("mobileNumber")}
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaMobileAlt className="text-success" />
              </span>
              <input
                type="tel"
                className="form-control"
                placeholder={t("mobilePlaceholder")}
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter valid 10-digit mobile number",
                  },
                })}
              />
            </div>
            {errors.mobile && (
              <small className="text-danger">{errors.mobile.message}</small>
            )}
          </div>

          {/* 4. Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold small mb-1">
              {t("password")}
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaLock className="text-success" />
              </span>
              <input
                type="password"
                className="form-control"
                placeholder={t("passwordPlaceholder")}
                {...register("password", { required: "Password is required" })}
              />
            </div>
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm fs-6"
          >
            {t("loginButton")} →
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted mb-2 small">
            {t("dontHaveAccount")}
          </p>
          <Link
            to="/farmer/register"
            className="btn btn-outline-success btn-sm fw-bold px-4 rounded-pill"
          >
            {t("createAccount")}
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

export default FarmerLogin;
