import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import {
  FaHome,
  FaStore,
  FaPlusCircle,
  FaHandshake,
  FaUserAlt,
} from "react-icons/fa";

export default function FarmerBottomNav() {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: "/farmer/dashboard", label: t("dashboard"), icon: FaHome },
    { path: "/farmer/crops", label: t("myCrops"), icon: FaStore },
    { path: "/farmer/add-crop", label: t("addCrop"), icon: FaPlusCircle, highlight: true },
    { path: "/farmer/buyers", label: t("buyers"), icon: FaHandshake },
    { path: "/farmer/profile", label: t("profile"), icon: FaUserAlt },
  ];

  return (
    <div
      className="d-lg-none fixed-bottom bg-white border-top shadow-lg py-1 px-2 d-flex justify-content-around align-items-center"
      style={{ zIndex: 1040, height: "65px" }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        if (item.highlight) {
          return (
            <Link
              key={item.path}
              to={item.path}
              className="text-decoration-none d-flex flex-column align-items-center position-relative"
              style={{ top: "-14px" }}
            >
              <div
                className="bg-warning text-dark rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                style={{ width: "52px", height: "52px", border: "4px solid #ffffff" }}
              >
                <Icon className="fs-4" />
              </div>
              <span className="small fw-bold text-dark mt-1" style={{ fontSize: "0.72rem" }}>
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`text-decoration-none d-flex flex-column align-items-center py-1 px-2 rounded ${
              isActive ? "text-success fw-bold" : "text-muted"
            }`}
          >
            <Icon className={`fs-5 ${isActive ? "text-success" : "text-muted"}`} />
            <span style={{ fontSize: "0.72rem" }} className="mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
