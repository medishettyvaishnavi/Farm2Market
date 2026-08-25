import BuyerNavbar from "./BuyerNavbar";
import NetworkStatusBanner from "../common/NetworkStatusBanner";

export default function BuyerLayout({ children }) {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <NetworkStatusBanner />
      <BuyerNavbar />
      <main className="flex-grow-1 pb-5 mb-4">
        {children}
      </main>
    </div>
  );
}
