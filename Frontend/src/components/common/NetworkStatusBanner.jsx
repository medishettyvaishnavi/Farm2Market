import { useNetwork } from "../../context/NetworkContext";
import { useLanguage } from "../../context/LanguageContext";
import { FaWifi, FaExclamationTriangle, FaSync } from "react-icons/fa";

export default function NetworkStatusBanner() {
  const { isOnline, syncStatus, toggleSimulatedOffline } = useNetwork();
  const { t } = useLanguage();

  if (isOnline && syncStatus === "idle") {
    return null;
  }

  return (
    <div
      className={`py-2 px-3 text-center small fw-bold d-flex align-items-center justify-content-center gap-2 text-white transition-all ${
        !isOnline
          ? "bg-dark bg-gradient border-bottom border-warning"
          : syncStatus === "syncing"
          ? "bg-warning text-dark"
          : "bg-success"
      }`}
      style={{ zIndex: 1060 }}
    >
      {!isOnline && (
        <>
          <FaExclamationTriangle className="text-warning fs-6" />
          <span>{t("offlineNotice")}</span>
          <button
            type="button"
            className="btn btn-outline-light btn-sm py-0 px-2 ms-2 rounded-pill"
            style={{ fontSize: "0.75rem" }}
            onClick={toggleSimulatedOffline}
          >
            Go Online (Test)
          </button>
        </>
      )}

      {isOnline && syncStatus === "syncing" && (
        <>
          <FaSync className="fa-spin" />
          <span>{t("onlineNotice")}</span>
        </>
      )}

      {isOnline && syncStatus === "synced" && (
        <>
          <FaWifi />
          <span>Data Synced Successfully!</span>
        </>
      )}
    </div>
  );
}
