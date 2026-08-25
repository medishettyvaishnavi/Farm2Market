import FarmerNavbar from "./FarmerNavbar";
import FarmerBottomNav from "./FarmerBottomNav";
import NetworkStatusBanner from "../common/NetworkStatusBanner";

export default function FarmerLayout({ children }) {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Network Offline / Syncing Banner */}
      <NetworkStatusBanner />

      {/* Top Navbar */}
      <FarmerNavbar />

      {/* Main Page Container */}
      <main className="flex-grow-1 pb-5 mb-4">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <FarmerBottomNav />
    </div>
  );
}
