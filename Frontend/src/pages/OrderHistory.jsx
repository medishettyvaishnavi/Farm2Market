import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useFarmerData } from "../context/FarmerDataContext";
import FarmerLayout from "../components/layout/FarmerLayout";
import VoiceButton from "../components/common/VoiceButton";
import { formatNumberForSpeech } from "../services/voiceService";
import {
  FaHistory,
  FaCheckCircle,
  FaTruck,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaDownload,
  FaSearch,
  FaFilter,
  FaInfoCircle,
} from "react-icons/fa";

export default function OrderHistory() {
<<<<<<< HEAD
  const { language, t } = useLanguage();
=======
  const { t, language } = useLanguage();
>>>>>>> 577a2fe4bc2923cba0c555734d7c2a8b7be2d2a0
  const { orders } = useFarmerData();
  
  const [activeSubTab, setActiveSubTab] = useState("track"); // 'track' | 'earnings' | 'history'
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Search and Filter States for History
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Earnings calculations
  const completedOrders = orders.filter((o) => o.status === "paid" || o.status === "completed");
  
  const totalActualEarnings = completedOrders.reduce((acc, curr) => acc + (curr.estimatedNetEarnings || (curr.totalAmount - (curr.transportCost || 0))), 0);
  const totalEstimatedEarnings = orders
    .filter((o) => o.status !== "paid" && o.status !== "completed" && o.status !== "cancelled")
    .reduce((acc, curr) => acc + (curr.estimatedNetEarnings || (curr.totalAmount - (curr.transportCost || 0))), 0);

  const totalQuantitySold = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const grossSales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalTransportCosts = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, curr) => acc + (curr.transportCost || 0), 0);

  const netEarnings = grossSales - totalTransportCosts;

  // Monthly Earnings (Simulated: orders placed in August 2026/2024 or current month)
  const currentMonthStr = new Date().toISOString().substring(0, 7); // YYYY-MM
  const monthlyEarnings = orders
    .filter((o) => o.status !== "cancelled" && o.orderDate.startsWith(currentMonthStr))
    .reduce((acc, curr) => acc + (curr.estimatedNetEarnings || (curr.totalAmount - (curr.transportCost || 0))), 0);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return <span className="badge bg-success px-3 py-2 rounded-pill fw-bold">✓ Payment Received</span>;
      case "delivered":
        return <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold">Delivered</span>;
      case "in_transit":
        return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">🚚 Crop on the Way</span>;
      case "picked_up":
      case "pickup_scheduled":
        return <span className="badge bg-primary px-3 py-2 rounded-pill fw-bold">Truck Scheduled</span>;
      case "cancelled":
        return <span className="badge bg-danger px-3 py-2 rounded-pill fw-bold">Cancelled</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2 rounded-pill fw-bold">Confirmed</span>;
    }
  };

  const getStepProgress = (status) => {
    const s = status?.toLowerCase();
    if (s === "cancelled") return 0;
    if (s === "confirmed" || s === "order_created") return 20;
    if (s === "pickup_scheduled") return 40;
    if (s === "picked_up") return 60;
    if (s === "in_transit") return 80;
    if (s === "delivered" || s === "payment_pending") return 90;
    if (s === "paid" || s === "completed") return 100;
    return 20;
  };

  // Filter transaction list
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.cropName.toLowerCase().includes(search.toLowerCase()) || 
      o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase());
    
    const cropNameClean = o.cropName.split(" (")[0];
    const matchesCrop = cropFilter === "All" || cropNameClean === cropFilter;
    
    const matchesStatus = statusFilter === "All" || o.status === statusFilter.toLowerCase();
    const matchesDate = !dateFilter || o.orderDate === dateFilter;

    return matchesSearch && matchesCrop && matchesStatus && matchesDate;
  });

  // Get distinct crop names for dropdown filter
  const distinctCrops = Array.from(
    new Set(orders.map((o) => o.cropName.split(" (")[0]))
  );

  return (
    <FarmerLayout>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
              <FaHistory /> {t("orders")} (ఆర్డర్లు & బేరసారాలు)
            </h2>
            <p className="text-muted mb-0">
              Track crop dispatches, delivery progress, and check your net market earnings.
            </p>
          </div>
          <VoiceButton
            mode="speak"
<<<<<<< HEAD
            textToSpeak={`${t("orderTracker")}: ${formatNumberForSpeech(orders.length, language)}. ${t("totalEarnings")}: ${formatNumberForSpeech(totalEarnings, language)}.`}
=======
            textToSpeak={
              activeSubTab === "earnings"
                ? `Your total earnings are ₹${totalActualEarnings.toLocaleString()}, and this month you earned ₹${monthlyEarnings.toLocaleString()}.`
                : `You have ${orders.length} orders. Use the tabs to track delivery or view transactions.`
            }
>>>>>>> 577a2fe4bc2923cba0c555734d7c2a8b7be2d2a0
          />
        </div>

        {/* Tab Selector */}
        <div className="d-flex gap-2 mb-4 overflow-auto pb-1">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-4 py-2 fw-bold text-nowrap ${
              activeSubTab === "track" ? "btn-success shadow-sm" : "btn-light bg-white border"
            }`}
            onClick={() => setActiveSubTab("track")}
          >
            🚚 Track Orders ({orders.filter(o => o.status !== "paid" && o.status !== "completed" && o.status !== "cancelled").length})
          </button>
          
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-4 py-2 fw-bold text-nowrap ${
              activeSubTab === "earnings" ? "btn-success shadow-sm" : "btn-light bg-white border"
            }`}
            onClick={() => setActiveSubTab("earnings")}
          >
            💰 My Earnings
          </button>
          
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-4 py-2 fw-bold text-nowrap ${
              activeSubTab === "history" ? "btn-success shadow-sm" : "btn-light bg-white border"
            }`}
            onClick={() => setActiveSubTab("history")}
          >
            📜 Transaction History ({orders.length})
          </button>
        </div>

        {/* TAB 1: TRACK ACTIVE ORDERS */}
        {activeSubTab === "track" && (
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-4">Active Shipments & Logistics</h5>
            
            {orders.filter(o => o.status !== "paid" && o.status !== "completed" && o.status !== "cancelled").length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div className="fs-1">🚚</div>
                <h6>No active shipments. All orders are settled.</h6>
                <p className="small">Accept bids in the Offers tab to start new shipments.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {orders
                  .filter(o => o.status !== "paid" && o.status !== "completed" && o.status !== "cancelled")
                  .map((order) => {
                    const progress = getStepProgress(order.status);
                    return (
                      <div key={order.id} className="border rounded-4 p-3 p-md-4 bg-light shadow-none">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-3">
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <h5 className="fw-bold text-success mb-0">{order.cropName}</h5>
                              <span className="badge bg-dark text-white font-monospace small">{order.id}</span>
                            </div>
                            <p className="text-muted small mb-0 mt-1">
                              Buyer: <b>{order.buyerName}</b> • Expected: <b>{order.expectedDeliveryDate || "Within 3 days"}</b>
                            </p>
                          </div>
                          <div>{getStatusBadge(order.status)}</div>
                        </div>

                        {/* Progress Bar */}
                        <div className="my-4">
                          <div className="progress" style={{ height: "8px", borderRadius: "10px" }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="d-flex justify-content-between small text-muted mt-2 fw-semibold" style={{ fontSize: "0.75rem" }}>
                            <span>Confirmed</span>
                            <span>Picked Up</span>
                            <span>In Transit</span>
                            <span>Delivered</span>
                            <span>Paid</span>
                          </div>
                        </div>

                        {/* Financial calculations */}
                        <div className="row g-2 mb-3 bg-white p-3 rounded-4 border">
                          <div className="col-6 col-md-3">
                            <span className="small text-muted d-block">Quantity</span>
                            <span className="fw-bold text-dark">{order.quantity} {order.unit}</span>
                          </div>
                          <div className="col-6 col-md-3 border-start">
                            <span className="small text-muted d-block">Selling Amount</span>
                            <span className="fw-bold text-success">₹{order.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="col-6 col-md-3 border-start">
                            <span className="small text-muted d-block">Transport Cost</span>
                            <span className="fw-bold text-danger">₹{(order.transportCost || 600).toLocaleString()}</span>
                          </div>
                          <div className="col-6 col-md-3 border-start">
                            <span className="small text-muted d-block">Estimated Net Earnings</span>
                            <span className="fw-bold text-primary fs-6">
                              💰 ₹{(order.estimatedNetEarnings || (order.totalAmount - (order.transportCost || 600))).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Logistics location detail */}
                        <div className="small text-muted">
                          <FaMapMarkerAlt className="text-danger me-1" /> Pickup: <b>{order.pickupAddress || "Farmer Farm Hub"}</b> • Delivery Destination: <b>{order.deliveryAddress || "Buyer Factory Terminal"}</b>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY FARMER EARNINGS */}
        {activeSubTab === "earnings" && (
          <div className="d-flex flex-column gap-4">
            {/* Quick overview grid */}
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
                  <span className="small text-muted fw-bold">TOTAL NET EARNED</span>
                  <h3 className="fw-bold text-success mb-0 mt-2">₹{totalActualEarnings.toLocaleString()}</h3>
                  <span className="badge bg-success-subtle text-success mt-2 rounded-pill align-self-start small">ACTUAL</span>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
                  <span className="small text-muted fw-bold">ESTIMATED PENDING</span>
                  <h3 className="fw-bold text-primary mb-0 mt-2">₹{totalEstimatedEarnings.toLocaleString()}</h3>
                  <span className="badge bg-primary-subtle text-primary mt-2 rounded-pill align-self-start small">ESTIMATED</span>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
                  <span className="small text-muted fw-bold">THIS MONTH</span>
                  <h3 className="fw-bold text-dark mb-0 mt-2">₹{monthlyEarnings.toLocaleString()}</h3>
                  <span className="small text-muted mt-2 d-block">August 2026</span>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
                  <span className="small text-muted fw-bold">QUANTITY SOLD</span>
                  <h3 className="fw-bold text-dark mb-0 mt-2">{totalQuantitySold}</h3>
                  <span className="small text-muted mt-2 d-block">Quintals/Kg</span>
                </div>
              </div>
            </div>

            {/* Financial Ledger details */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">Gross Sales vs Transport Costs Ledger</h5>
              <div className="p-3 bg-light rounded-4 border">
                <div className="d-flex justify-content-between mb-2">
                  <span>Gross Sales (మొత్తం అమ్మకం):</span>
                  <b className="text-dark">₹{grossSales.toLocaleString()}</b>
                </div>
                <div className="d-flex justify-content-between mb-2 text-danger">
                  <span>Total Transport Costs (రవాణా ఖర్చు):</span>
                  <b>- ₹{totalTransportCosts.toLocaleString()}</b>
                </div>
                <hr />
                <div className="d-flex justify-content-between fs-5 text-success">
                  <b>Total Net Realized Earnings:</b>
                  <b>₹{netEarnings.toLocaleString()}</b>
                </div>
                <p className="small text-muted mt-3 mb-0">
                  * Note: Net Realized Earnings is calculated as <b>Gross Sales - Transport Cost</b>. Actual payout is secured directly in the farmer bank account via digital escrow on dispatch verification.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTION HISTORY */}
        {activeSubTab === "history" && (
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Completed & Cancelled Transactions Ledger</h5>
            
            {/* Filter Bar */}
            <div className="row g-2 mb-4">
              <div className="col-md-4">
                <div className="input-group bg-light rounded-pill border px-3 py-1">
                  <span className="input-group-text bg-transparent border-0 pe-2"><FaSearch className="text-muted" /></span>
                  <input
                    type="text"
                    className="form-control bg-transparent border-0 outline-0 p-1 small"
                    placeholder="Search crop, buyer, or transaction ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ outline: "none", boxShadow: "none" }}
                  />
                </div>
              </div>

              <div className="col-6 col-md-3">
                <select
                  className="form-select rounded-pill px-3 border"
                  value={cropFilter}
                  onChange={(e) => setCropFilter(e.target.value)}
                >
                  <option value="All">All Crops</option>
                  {distinctCrops.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="col-6 col-md-3">
                <select
                  className="form-select rounded-pill px-3 border"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Paid">Paid / Completed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="In_Transit">In Transit</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="col-md-2">
                <input
                  type="date"
                  className="form-control rounded-pill px-3 border"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>

            {/* List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div className="fs-1">📂</div>
                <h6>No records match these filters.</h6>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="card border rounded-4 p-3 p-md-4 bg-light shadow-none hover-lift">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-3">
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h5 className="fw-bold text-success mb-0">{order.cropName}</h5>
                          <span className="badge bg-dark text-white font-monospace small">{order.id}</span>
                        </div>
                        <p className="text-muted small mb-0 mt-1">
                          Buyer: <b>{order.buyerName}</b> • <FaCalendarAlt className="me-1" /> {order.orderDate}
                        </p>
                      </div>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>

                    {/* Volume and price row */}
                    <div className="row g-2 mb-3 bg-white p-3 rounded-4 border">
                      <div className="col-4 col-md-3">
                        <span className="small text-muted d-block">Volume</span>
                        <span className="fw-bold">{order.quantity} {order.unit}</span>
                      </div>
                      <div className="col-4 col-md-3 border-start">
                        <span className="small text-muted d-block">Agreed Rate</span>
                        <span className="fw-bold text-success">₹{order.pricePerUnit?.toLocaleString()} /{order.unit}</span>
                      </div>
                      <div className="col-4 col-md-3 border-start">
                        <span className="small text-muted d-block">Transport Cost</span>
                        <span className="fw-bold text-danger">- ₹{(order.transportCost || 0).toLocaleString()}</span>
                      </div>
                      <div className="col-12 col-md-3 border-start pt-2 pt-md-0">
                        <span className="small text-muted d-block">Net Realized Payout</span>
                        <span className="fw-bold text-dark fs-5">
                          ₹{(order.estimatedNetEarnings || (order.totalAmount - (order.transportCost || 0))).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 small text-muted">
                      <div>
                        <FaMapMarkerAlt className="text-danger me-1" /> Pickup: <b>{order.pickupAddress}</b> • TXN ID: <span className="font-monospace text-dark">{order.transactionId}</span>
                      </div>
                      
                      {order.status === "paid" && (
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm rounded-pill fw-bold px-3 d-flex align-items-center gap-1 align-self-start align-self-md-auto"
                          onClick={() => setSelectedReceipt(order)}
                        >
                          <FaDownload /> {t("downloadReceipt")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Receipt Modal */}
        {selectedReceipt && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow-lg p-4">
                <div className="text-center mb-3">
                  <div className="fs-2 text-success">🌾 Farm2Market</div>
                  <div className="small text-muted">Official Transaction Certificate & Invoice</div>
                </div>

                <div className="bg-light p-3 rounded-4 border mb-3 small">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Receipt No:</span>
                    <b className="font-monospace">{selectedReceipt.id}</b>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Date:</span>
                    <b>{selectedReceipt.orderDate}</b>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Crop:</span>
                    <b>{selectedReceipt.cropName}</b>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Buyer:</span>
                    <b>{selectedReceipt.buyerName}</b>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Volume:</span>
                    <b>{selectedReceipt.quantity} {selectedReceipt.unit}</b>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between fs-6 text-success">
                    <b>Total Payout:</b>
                    <b>₹{(selectedReceipt.estimatedNetEarnings || (selectedReceipt.totalAmount - (selectedReceipt.transportCost || 0))).toLocaleString()}</b>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setSelectedReceipt(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success fw-bold rounded-pill px-4"
                    onClick={() => {
                      alert("Receipt downloaded to your device!");
                      setSelectedReceipt(null);
                    }}
                  >
                    Print / Save PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
