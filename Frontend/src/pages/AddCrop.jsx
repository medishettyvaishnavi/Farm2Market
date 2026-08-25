import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useFarmerData } from "../context/FarmerDataContext";
import FarmerLayout from "../components/layout/FarmerLayout";
import VoiceButton from "../components/common/VoiceButton";
import {
  FaPlusCircle,
  FaCamera,
  FaRupeeSign,
  FaSeedling,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

const popularCrops = [
  { name: "Cotton (పత్తి)", category: "Cash Crop", avgPrice: 7550 },
  { name: "Red Chilli (ఎర్ర మిర్చి)", category: "Spices", avgPrice: 19200 },
  { name: "Paddy / Rice (వరి)", category: "Cereals & Grains", avgPrice: 2380 },
  { name: "Turmeric (పసుపు)", category: "Spices", avgPrice: 14600 },
  { name: "Maize (మొక్కజొన్న)", category: "Cereals & Grains", avgPrice: 2280 },
  { name: "Tomato (టమాటా)", category: "Vegetables", avgPrice: 1800 },
];

export default function AddCrop() {
  const { t } = useLanguage();
  const { addCrop } = useFarmerData();
  const navigate = useNavigate();

  const [photoPreview, setPhotoPreview] = useState(
    "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500&auto=format&fit=crop&q=60"
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      variety: "",
      category: "Cash Crop",
      quantity: 50,
      unit: "Quintals",
      expectedPrice: 7500,
      harvestDate: new Date().toISOString().split("T")[0],
      grade: "Grade A (Premium)",
      isOrganic: false,
      description: "",
    },
  });

  const selectedCropName = watch("name");

  const handleSelectQuickCrop = (item) => {
    setValue("name", item.name);
    setValue("category", item.category);
    setValue("expectedPrice", item.avgPrice);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data) => {
    addCrop({
      ...data,
      quantity: Number(data.quantity),
      expectedPrice: Number(data.expectedPrice),
      photos: [photoPreview],
    });
    navigate("/farmer/crops?added=true");
  };

  return (
    <FarmerLayout>
      <div className="container py-4" style={{ maxWidth: "850px" }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
              <FaPlusCircle /> {t("addNewCropTitle")}
            </h2>
            <p className="text-muted mb-0">{t("addNewCropSubtitle")}</p>
          </div>
          <VoiceButton
            mode="speak"
            textToSpeak={t("addNewCropSubtitle")}
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
          <div className="small fw-bold text-muted mb-2">
            ⚡ Quick Select Popular Crops (త్వరిత ఎంపిక):
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {popularCrops.map((c, i) => (
              <button
                key={i}
                type="button"
                className={`btn btn-sm rounded-pill fw-semibold px-3 py-1 ${
                  selectedCropName === c.name
                    ? "btn-success"
                    : "btn-outline-success bg-white"
                }`}
                onClick={() => handleSelectQuickCrop(c)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Add Crop Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
            <h5 className="fw-bold text-success d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
              <FaSeedling /> 1. Crop Information & Category
            </h5>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold small mb-0">
                    {t("cropName")}
                  </label>
                  <VoiceButton
                    mode="listen"
                    label="Speak Crop"
                    onTranscript={(text) => setValue("name", text)}
                  />
                </div>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Cotton (పత్తి) / Red Chilli"
                  {...register("name", { required: "Crop Name is required" })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small">
                  Variety / Seed Type
                </label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Bt-Cotton Super / Teja Chilli"
                  {...register("variety")}
                />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold small">
                  {t("category")}
                </label>
                <select className="form-select rounded-3" {...register("category")}>
                  <option value="Cash Crop">Cash Crop (వాణిజ్య పంట)</option>
                  <option value="Spices">Spices (మసాలా దినుసులు)</option>
                  <option value="Cereals & Grains">Cereals & Grains (ధాన్యాలు)</option>
                  <option value="Vegetables">Vegetables (కూరగాయలు)</option>
                  <option value="Pulses">Pulses (పప్పు ధాన్యాలు)</option>
                  <option value="Oilseeds">Oilseeds (నూనెగింజలు)</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold small">
                  {t("cropGrade")}
                </label>
                <select className="form-select rounded-3" {...register("grade")}>
                  <option value="Grade A (Premium)">{t("gradeA")}</option>
                  <option value="Grade B (Standard)">{t("gradeB")}</option>
                  <option value="Grade C (Fair)">{t("gradeC")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing and Quantity */}
          <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
            <h5 className="fw-bold text-success d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
              <FaRupeeSign /> 2. Quantity & Expected Price
            </h5>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold small">
                  {t("quantity")}
                </label>
                <input
                  type="number"
                  step="1"
                  className="form-control rounded-3"
                  placeholder="e.g. 50"
                  {...register("quantity", { required: "Quantity required" })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold small">
                  {t("unit")}
                </label>
                <select className="form-select rounded-3" {...register("unit")}>
                  <option value="Quintals">{t("quintal")}</option>
                  <option value="Kg">{t("kg")}</option>
                  <option value="Tons">{t("ton")}</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold small">
                  {t("expectedPrice")} (Per Unit)
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white">₹</span>
                  <input
                    type="number"
                    step="50"
                    className="form-control"
                    placeholder="e.g. 7500"
                    {...register("expectedPrice", { required: "Price required" })}
                  />
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold small">
                  {t("harvestDate")}
                </label>
                <input
                  type="date"
                  className="form-control rounded-3"
                  {...register("harvestDate")}
                />
              </div>

              <div className="col-md-6 d-flex align-items-center pt-md-4">
                <div className="form-check form-switch fs-6">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="organicSwitch"
                    {...register("isOrganic")}
                  />
                  <label className="form-check-label fw-bold ms-2" htmlFor="organicSwitch">
                    🌱 {t("isOrganic")} (సేంద్రీయ పంట)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Photos & Quality Preview */}
          <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
            <h5 className="fw-bold text-success d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
              <FaCamera /> 3. Crop Photos & Quality Proof
            </h5>

            <div className="row g-3 align-items-center">
              <div className="col-md-7">
                <div
                  className="border border-2 border-dashed rounded-4 p-4 text-center bg-light"
                  style={{ cursor: "pointer" }}
                  onClick={() => document.getElementById("cropPhotoInput").click()}
                >
                  <input
                    type="file"
                    id="cropPhotoInput"
                    className="d-none"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                  <FaCamera className="text-success fs-1 mb-2" />
                  <h6 className="fw-bold mb-1">Click to Upload Crop Photo</h6>
                  <p className="text-muted small mb-0">
                    Buyers offer 15% higher prices for clear crop sample photos.
                  </p>
                </div>
              </div>

              <div className="col-md-5 text-center">
                <div className="small fw-bold text-muted mb-2">Photo Preview:</div>
                <img
                  src={photoPreview}
                  alt="Crop Preview"
                  className="img-fluid rounded-4 shadow-sm border"
                  style={{ height: "140px", width: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="form-label fw-semibold small">
                Additional Notes for Buyers (Optional)
              </label>
              <textarea
                className="form-control rounded-3"
                rows="2"
                placeholder="e.g. Moisture content is below 8%, ready for immediate dispatch from farm."
                {...register("description")}
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-outline-secondary px-4 rounded-pill"
              onClick={() => navigate("/farmer/crops")}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="btn btn-success btn-lg px-5 fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2"
            >
              <FaCheckCircle /> List Crop for Sale →
            </button>
          </div>
        </form>
      </div>
    </FarmerLayout>
  );
}
