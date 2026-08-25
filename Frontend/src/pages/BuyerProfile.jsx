import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import BuyerLayout from "../components/layout/BuyerLayout";
import { FaMapMarkerAlt, FaMobileAlt, FaSave, FaUserCircle } from "react-icons/fa";

export default function BuyerProfile() {
  const { farmer: user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    village: user?.village || "",
  });
  const [saved, setSaved] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile(form);
    setSaved(true);
  };

  return (
    <BuyerLayout>
      <div className="container py-4" style={{ maxWidth: "720px" }}>
        <div className="mb-4">
          <h2 className="fw-bold text-primary mb-1 d-flex align-items-center gap-2">
            <FaUserCircle /> Buyer Profile
          </h2>
          <p className="text-muted mb-0">Manage your buyer contact details.</p>
        </div>

        <form onSubmit={handleSubmit} className="card shadow-sm border-0 rounded-4 p-4 bg-white">
          {saved && <div className="alert alert-success">Profile updated successfully.</div>}

          <label className="form-label fw-semibold" htmlFor="buyer-name">Full name</label>
          <input
            id="buyer-name"
            className="form-control mb-3"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />

          <label className="form-label fw-semibold" htmlFor="buyer-mobile">
            <FaMobileAlt className="me-2 text-primary" />Mobile number
          </label>
          <input
            id="buyer-mobile"
            className="form-control mb-3"
            value={form.mobile}
            onChange={(event) => updateField("mobile", event.target.value)}
            required
          />

          <label className="form-label fw-semibold" htmlFor="buyer-location">
            <FaMapMarkerAlt className="me-2 text-primary" />Location
          </label>
          <input
            id="buyer-location"
            className="form-control mb-4"
            value={form.village}
            onChange={(event) => updateField("village", event.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary rounded-pill px-4 align-self-start">
            <FaSave className="me-2" />Save Profile
          </button>
        </form>
      </div>
    </BuyerLayout>
  );
}