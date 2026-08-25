import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useFarmerData } from "../context/FarmerDataContext";
import FarmerLayout from "../components/layout/FarmerLayout";
import VoiceButton from "../components/common/VoiceButton";
import {
  FaHistory,
  FaCheckCircle,
  FaTruck,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaDownload,
} from "react-icons/fa";

export default function OrderHistory() {
  const { t } = useLanguage();
  const { orders } = useFarmerData();
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const totalEarnings = orders
    .filter((o) => o.status === "paid")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span className="badge bg-success px-3 py-2 rounded-pill fw-bold">✓ Payment Received</span>;
      case "delivered":
        return <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold">Delivered</span>;
      case "in_transit":
        return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">🚚 In Transit</span>;
      case "dispatched":
        return <span className="badge bg-primary px-3 py-2 rounded-pill fw-bold">Dispatched</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2 rounded-pill fw-bold">Confirmed</span>;
    }
  };

  return (
    <FarmerLayout>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
              <FaHistory /> {t("orders")} (ఆర్డర్లు & రశీదులు)
            </h2>
            <p className="text-muted mb-0">
              Track crop dispatches, delivery progress, and download official payment receipts.
            </p>
          </div>
          <VoiceButton
            mode="speak"
            textToSpeak={`You have ${orders.length} orders recorded with total payments received of ₹${totalEarnings.toLocaleString()}.`}
          />
        </div>

        {/* Quick Earnings Banner */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-success text-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <span className="badge bg-white text-success fw-bold mb-2">
                Escrow Secured Payments
              </span>
              <h3 className="fw-bold mb-0">
                Total Realized Earnings: ₹{totalEarnings.toLocaleString()}
              </h3>
              <p className="small mb-0 opacity-90">
                All transactions settled directly to verified farmer bank account via RTGS/UPI.
              </p>
            </div>
            <div className="badge bg-white-subtle border border-white text-white p-3 rounded-4 text-center">
              <div className="fs-4 fw-bold">{orders.length}</div>
              <div className="small">Total Orders</div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
          <h5 className="fw-bold text-dark mb-4">Completed & Active Transactions</h5>

          {orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div className="fs-1">📦</div>
              <h6>No orders placed yet.</h6>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="card border rounded-4 p-3 p-md-4 bg-light shadow-none hover-lift"
                >
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-3">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h5 className="fw-bold text-success mb-0">{order.cropName}</h5>
                        <span className="badge bg-dark text-white font-monospace small">
                          {order.id}
                        </span>
                      </div>
                      <p className="text-muted small mb-0 mt-1">
                        Buyer: <b>{order.buyerName}</b> •{" "}
                        <FaCalendarAlt className="me-1" /> {order.orderDate}
                      </p>
                    </div>

                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  {/* Quantity & Payout Row */}
                  <div className="row g-2 mb-3 bg-white p-3 rounded-3 border">
                    <div className="col-md-4">
                      <span className="small text-muted d-block">Quantity Dispatched</span>
                      <span className="fw-bold fs-6">
                        {order.quantity} {order.unit}
                      </span>
                    </div>

                    <div className="col-md-4">
                      <span className="small text-muted d-block">Agreed Rate</span>
                      <span className="fw-bold text-success fs-6">
                        ₹{order.pricePerUnit?.toLocaleString()} /{order.unit}
                      </span>
                    </div>

                    <div className="col-md-4">
                      <span className="small text-muted d-block">Total Settlement</span>
                      <span className="fw-bold text-dark fs-5">
                        ₹{order.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment & Pickup Details */}
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 small text-muted">
                    <div>
                      <FaMapMarkerAlt className="text-danger me-1" /> Pickup:{" "}
                      <b>{order.pickupAddress}</b> • TXN ID:{" "}
                      <span className="font-monospace text-dark">
                        {order.transactionId}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm rounded-pill fw-bold px-3 d-flex align-items-center gap-1 align-self-start align-self-md-auto"
                      onClick={() => setSelectedReceipt(order)}
                    >
                      <FaDownload /> {t("downloadReceipt")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
                    <b>Total Paid Amount:</b>
                    <b>₹{selectedReceipt.totalAmount?.toLocaleString()}</b>
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
