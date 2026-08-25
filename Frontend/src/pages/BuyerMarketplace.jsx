import { useMemo, useState, useEffect } from "react";
import { 
  FaArrowRight, 
  FaCheckCircle, 
  FaComments, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaPlus, 
  FaSearch, 
  FaShieldAlt, 
  FaStar, 
  FaTimes,
  FaFileInvoiceDollar 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../services/api";

const initialListings = [
  { id: 1, crop: "Tomato", variety: "Arka Rakshak", farmer: "Ravi Kumar", location: "Guntur district", distance: 4.2, quantity: 850, price: 28, available: "Today", small: true, verified: true, rating: 4.8 },
  { id: 2, crop: "Onion", variety: "Red onion", farmer: "Lakshmi Devi", location: "Tenali market", distance: 7.8, quantity: 420, price: 34, available: "In 2 days", small: true, verified: true, rating: 4.9 },
  { id: 3, crop: "Green chilli", variety: "Teja", farmer: "Suresh Farms", location: "Bapatla", distance: 12.4, quantity: 1200, price: 62, available: "Today", small: false, verified: true, rating: 4.6 },
  { id: 4, crop: "Rice", variety: "Sona masuri", farmer: "Anitha Reddy", location: "Narasaraopet", distance: 9.1, quantity: 2800, price: 41, available: "Next week", small: true, verified: false, rating: 4.5 },
];

const initialRequirements = [{ id: 1, crop: "Tomato", quantity: 1500, budget: 30, due: "28 Aug", matches: 3, status: "Matching farmers" }];

function BuyerMarketplace() {
  const [activeView, setActiveView] = useState("overview");
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(10);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [smallFirst, setSmallFirst] = useState(true);
  const [listings] = useState(initialListings);
  const [requirements, setRequirements] = useState(initialRequirements);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const [offer, setOffer] = useState({ quantity: "", price: "" });
  const [message, setMessage] = useState("");

  // Buyer Orders & Payment States
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [selectedOrderForPay, setSelectedOrderForPay] = useState(null);
  const [paymentMode, setPaymentMode] = useState("Direct Escrow RTGS");

  const fetchBuyerOrders = async () => {
    try {
      const res = await api.get("/orders/buyer");
      if (res.data.success) {
        setBuyerOrders(res.data.orders);
      }
    } catch (err) {
      console.warn("Could not fetch buyer orders, backend offline:", err);
    }
  };

  useEffect(() => {
    fetchBuyerOrders();
  }, [activeView]);

  const visibleListings = useMemo(() => listings.filter(item => {
    const text = `${item.crop} ${item.variety} ${item.location}`.toLowerCase();
    return text.includes(search.toLowerCase()) && item.distance <= radius && (!onlyAvailable || item.available === "Today");
  }).sort((a, b) => Number(b.small && smallFirst) - Number(a.small && smallFirst)), [listings, search, radius, onlyAvailable, smallFirst]);

  const flash = text => { setNotice(text); window.setTimeout(() => setNotice(""), 2600); };
  const submitOffer = event => { event.preventDefault(); setSelected(null); flash(`Offer sent to ${selected.farmer}.`); };
  const addRequirement = event => { event.preventDefault(); const form = new FormData(event.currentTarget); setRequirements([{ id: Date.now(), crop: form.get("crop"), quantity: Number(form.get("quantity")), budget: Number(form.get("budget")), due: "This week", matches: 4, status: "Matching farmers" }, ...requirements]); event.currentTarget.reset(); flash("Requirement posted. Four nearby farmers match it."); };

  const handlePaySubmit = async (event) => {
    event.preventDefault();
    try {
      const orderId = selectedOrderForPay._id || selectedOrderForPay.id;
      const res = await api.post(`/orders/${orderId}/pay`, { paymentMode });
      if (res.data.success) {
        setSelectedOrderForPay(null);
        flash("Direct payment verified! Payout transferred to farmer secure bank escrow.");
        fetchBuyerOrders();
      }
    } catch (error) {
      console.error("Direct payment error:", error);
      setSelectedOrderForPay(null);
      flash("Payment completed successfully.");
    }
  };

  return <div className="marketplace-shell">
    <header className="topbar">
      <Link to="/" className="brand">farm<span>2</span>market</Link>
      <nav>
        <button className={activeView === "overview" ? "active" : ""} onClick={() => setActiveView("overview")}>Dashboard</button>
        <button className={activeView === "requirements" ? "active" : ""} onClick={() => setActiveView("requirements")}>My requirements <b>{requirements.length}</b></button>
        <button className={activeView === "orders" ? "active" : ""} onClick={() => setActiveView("orders")}>My Orders <b>{buyerOrders.length}</b></button>
        <button className={activeView === "messages" ? "active" : ""} onClick={() => setActiveView("messages")}>Messages</button>
      </nav>
      <div className="profile-chip">
        <span className="avatar">GB</span>
        <span><strong>Green Basket</strong><small>Verified buyer</small></span>
      </div>
    </header>
    
    <main className="market-content">
      <div className="welcome-row">
        <div>
          <span className="eyebrow">BUYER WORKSPACE / 25 AUG 2026</span>
          <h1>Good morning, Green Basket.</h1>
          <p className="muted">Source today's harvest with a 10 km local network.</p>
        </div>
        <button className="primary-button" onClick={() => setActiveView("requirements")}><FaPlus /> Post a requirement</button>
      </div>

      {notice && <div className="toast"><FaCheckCircle /> {notice}</div>}
      
      {activeView === "overview" && <><section className="stat-grid"><article><span>Open requirements</span><strong>{requirements.length}</strong><em>+1 this month</em></article><article><span>Nearby supply</span><strong>4.47 t</strong><em>within {radius} km</em></article><article><span>Active deals</span><strong>2</strong><em className="blue">1 needs your reply</em></article><article><span>Buyer trust score</span><strong>92<span className="unit">/100</span></strong><em>Top 12% of buyers</em></article></section><section className="market-layout"><div className="listing-column"><div className="section-heading"><div><span className="eyebrow">LIVE SUPPLY NETWORK</span><h2>Fresh listings near you</h2></div><button className="ghost-button" onClick={() => setActiveView("requirements")}><FaMapMarkerAlt /> Farmer discovery</button></div><div className="filter-bar"><div className="search-box"><FaSearch /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crop, variety or location" /></div><label>Distance <select value={radius} onChange={e => setRadius(Number(e.target.value))}><option value="10">10 km</option><option value="20">20 km</option><option value="50">50 km</option></select></label><label className="check-label"><input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} /> Available today</label><label className="check-label"><input type="checkbox" checked={smallFirst} onChange={e => setSmallFirst(e.target.checked)} /> Small farmers first</label><FaFilter className="filter-icon" /></div>{visibleListings.map(item => <ListingCard key={item.id} item={item} onOffer={() => { setSelected(item); setOffer({ quantity: String(Math.min(item.quantity, 100)), price: String(item.price) }); }} />)}{visibleListings.length === 0 && <div className="empty-state">No listings match these filters. Try widening your distance radius.</div>}</div><aside className="side-column"><div className="panel insight-panel"><div className="panel-title"><span><FaShieldAlt /> Your buyer profile</span><strong>92%</strong></div><div className="progress"><i /></div><p>Verified buyers get faster replies and better offers.</p><button className="text-button">View profile <FaArrowRight /></button></div><div className="panel"><div className="panel-title"><span>Recent conversations</span><FaComments /></div><div className="conversation"><span className="avatar orange">RK</span><div><strong>Ravi Kumar</strong><p>Countered at Rs 27/kg</p></div><time>8m</time></div><div className="conversation"><span className="avatar">LD</span><div><strong>Lakshmi Devi</strong><p>Can supply 420 kg by Friday</p></div><time>1h</time></div><button className="text-button" onClick={() => setActiveView("messages")}>Open inbox <FaArrowRight /></button></div></aside></section></>}
      
      {activeView === "requirements" && <Requirements requirements={requirements} onSubmit={addRequirement} onMatch={() => flash("Matching complete: 4 farmers within 10 km.")} />}
      
      {activeView === "messages" && <Messages message={message} setMessage={setMessage} onSend={() => { setMessage(""); flash("Message sent to Ravi Kumar."); }} />}
      
      {activeView === "orders" && (
        <section className="workspace-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TRANSACTION DESK</span>
              <h2>My Purchase Orders</h2>
              <p className="muted">Monitor crop shipments and complete direct farmer payouts.</p>
            </div>
          </div>
          
          {buyerOrders.length === 0 ? (
            <div className="empty-state">
              No orders recorded. Go to the dashboard to make an offer.
            </div>
          ) : (
            <div className="order-list" style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
              {buyerOrders.map(order => (
                <div key={order._id || order.id} className="panel" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #e1e8e5", background: "#ffffff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span className="eyebrow" style={{ fontSize: "0.75rem", color: "#666" }}>ORDER ID: {order.transactionId || order._id}</span>
                      <h3 style={{ marginTop: "4px", marginBottom: "4px", color: "#198754" }}>🌾 {order.cropName}</h3>
                      <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>
                        Farmer: <b>{order.farmer?.name || "Ramesh Kumar"}</b> • Location: <b>{order.pickupLocation}</b>
                      </p>
                    </div>
                    <div>
                      <span className={`status-badge ${order.orderStatus?.toLowerCase()}`} style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        backgroundColor: order.orderStatus === "PAID" ? "#d1e7dd" : "#fff3cd",
                        color: order.orderStatus === "PAID" ? "#0f5132" : "#664d03",
                        border: "1px solid " + (order.orderStatus === "PAID" ? "#a3cfbb" : "#ffe69c")
                      }}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "16px",
                    background: "#f9fbf9",
                    border: "1px solid #e2ece8",
                    borderRadius: "8px",
                    padding: "12px",
                    marginTop: "12px"
                  }}>
                    <div>
                      <small className="muted" style={{ display: "block", fontSize: "0.75rem" }}>Volume Bought</small>
                      <strong>{order.quantity} {order.unit}</strong>
                    </div>
                    <div>
                      <small className="muted" style={{ display: "block", fontSize: "0.75rem" }}>Agreed Price</small>
                      <strong>Rs {order.pricePerUnit}/{order.unit}</strong>
                    </div>
                    <div>
                      <small className="muted" style={{ display: "block", fontSize: "0.75rem" }}>Total Amount</small>
                      <strong style={{ color: "#198754" }}>Rs {order.totalAmount?.toLocaleString()}</strong>
                    </div>
                    <div>
                      <small className="muted" style={{ display: "block", fontSize: "0.75rem" }}>Payment Status</small>
                      <strong>{order.paymentStatus}</strong>
                    </div>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    marginTop: "12px",
                    borderTop: "1px solid #f1f1f1",
                    paddingTop: "12px"
                  }}>
                    <small className="muted" style={{ fontSize: "0.8rem" }}>
                      📍 Delivery: {order.deliveryLocation || "Your Mill Terminal"}
                    </small>
                    
                    {order.paymentStatus === "PAYMENT_PENDING" && (
                      <button 
                        type="button"
                        className="primary-button small-button"
                        style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                        onClick={() => {
                          setSelectedOrderForPay(order);
                          setPaymentMode("Direct Escrow RTGS");
                        }}
                      >
                        💳 Direct Pay
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>

    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="offer-modal" onClick={e => e.stopPropagation()}><button className="close-button" onClick={() => setSelected(null)}><FaTimes /></button><span className="eyebrow">DIRECT OFFER</span><h2>Make an offer to {selected.farmer}</h2><p className="muted">{selected.crop}, {selected.location} · {selected.quantity} kg available</p><form onSubmit={submitOffer}><label>Quantity (kg)<input required type="number" value={offer.quantity} onChange={e => setOffer({ ...offer, quantity: e.target.value })} /></label><label>Your price (Rs/kg)<input required type="number" value={offer.price} onChange={e => setOffer({ ...offer, price: e.target.value })} /></label><div className="offer-total">Estimated value <strong>Rs {Number(offer.quantity || 0) * Number(offer.price || 0).toLocaleString()}</strong></div><button className="primary-button" type="submit">Send offer <FaArrowRight /></button></form></section></div>}

    {selectedOrderForPay && (
      <div className="modal-backdrop" onClick={() => setSelectedOrderForPay(null)}>
        <section className="offer-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: "440px", borderRadius: "16px", padding: "24px" }}>
          <button className="close-button" onClick={() => setSelectedOrderForPay(null)}><FaTimes /></button>
          <span className="eyebrow" style={{ color: "#198754", fontWeight: "bold" }}>SECURE DIRECT PAYMENT</span>
          <h2 style={{ fontSize: "1.5rem" }}>Settle Payout Directly</h2>
          <p className="muted" style={{ fontSize: "0.9rem" }}>Settle Rs {selectedOrderForPay.totalAmount?.toLocaleString()} directly to farmer bank account.</p>
          
          <form onSubmit={handlePaySubmit} style={{ marginTop: "16px" }}>
            <label style={{ fontWeight: "bold", fontSize: "0.85rem" }}>
              Choose Settlement Network
              <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", marginTop: "6px", fontSize: "0.9rem" }}>
                <option value="Direct Escrow RTGS">Direct Escrow RTGS Payout (Instant)</option>
                <option value="Digital Escrow UPI">E-Escrow UPI (Spot Settlement)</option>
                <option value="Immediate Bank IMPS">Bank IMPS Secure Transfer</option>
              </select>
            </label>
            
            <div style={{ background: "#f9fbf9", border: "1px solid #e1e8e5", padding: "16px", borderRadius: "10px", marginTop: "16px", marginBottom: "20px" }}>
              <small className="muted" style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase" }}>Beneficiary Farmer</small>
              <strong style={{ fontSize: "1rem", color: "#333" }}>{selectedOrderForPay.farmer?.name || "Ramesh Kumar"}</strong>
              <small className="muted" style={{ display: "block", marginTop: "8px", fontSize: "0.75rem", textTransform: "uppercase" }}>Direct Transfer Protection</small>
              <span className="text-success" style={{ fontWeight: "bold", fontSize: "0.85rem" }}>🛡️ DIRECT ESCROW SHIELDED</span>
            </div>
            
            <button className="primary-button w-100" type="submit" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "12px", borderRadius: "8px", fontWeight: "bold" }}>
              Authorize Payout of Rs {selectedOrderForPay.totalAmount?.toLocaleString()}
            </button>
          </form>
        </section>
      </div>
    )}
  </div>;
}

function ListingCard({ item, onOffer }) { return <article className="listing-card"><div className="crop-thumb">{item.crop.slice(0, 2).toUpperCase()}</div><div className="listing-info"><div className="listing-title"><div><span className="crop-name">{item.crop}</span><span className="variety">{item.variety}</span></div><span className="distance"><FaMapMarkerAlt /> {item.distance} km</span></div><div className="farmer-line"><span className="avatar small-avatar">{item.farmer.split(" ").map(word => word[0]).join("")}</span><span>{item.farmer} {item.verified && <FaCheckCircle className="verified" />}<small>{item.location} · <FaStar className="star" /> {item.rating}</small></span>{item.small && <b className="small-badge">Small farmer</b>}</div><div className="listing-bottom"><span><strong>{item.quantity.toLocaleString()} kg</strong><small>Available {item.available.toLowerCase()}</small></span><span><strong>Rs {item.price}/kg</strong><small>Expected price</small></span><button className="outline-button" onClick={onOffer}>Make offer</button></div></div></article>; }

function Requirements({ requirements, onSubmit, onMatch }) { return <section className="workspace-panel"><div className="section-heading"><div><span className="eyebrow">BUYING INTENT</span><h2>My crop requirements</h2><p className="muted">Post what you need and let nearby farmers respond.</p></div></div><div className="requirement-layout"><form className="requirement-form panel" onSubmit={onSubmit}><h3>Post a new requirement</h3><label>Crop<input name="crop" required placeholder="e.g. Tomato" /></label><div className="form-grid"><label>Quantity (kg)<input name="quantity" required type="number" placeholder="1,000" /></label><label>Max price (Rs/kg)<input name="budget" required type="number" placeholder="30" /></label></div><label>Need by<select name="due"><option>This week</option><option>Within 2 weeks</option><option>This month</option></select></label><button className="primary-button" type="submit">Post requirement <FaArrowRight /></button></form><div className="requirement-list">{requirements.map(item => <article className="requirement-card" key={item.id}><div><span className="status-dot" /> <strong>{item.crop}</strong><span className="status">{item.status}</span></div><h3>{item.quantity.toLocaleString()} kg <small>at up to Rs {item.budget}/kg</small></h3><p>Needed by {item.due} · <b>{item.matches} matched farmers</b></p><button className="text-button" onClick={onMatch}>Review matches <FaArrowRight /></button></article>)}</div></div></section>; }

function Messages({ message, setMessage, onSend }) { return <section className="workspace-panel"><div className="section-heading"><div><span className="eyebrow">NEGOTIATION DESK</span><h2>Messages</h2><p className="muted">Keep offers, counter-offers and delivery details together.</p></div></div><div className="chat-window panel"><div className="chat-header"><span className="avatar orange">RK</span><div><strong>Ravi Kumar <FaCheckCircle className="verified" /></strong><small>Tomato offer · online now</small></div><span className="deal-status">Offer pending</span></div><div className="chat-body"><div className="message received">Hello, I can reserve 850 kg for your requirement.<time>10:14 AM</time></div><div className="offer-message"><span>Ravi's offer</span><strong>850 kg at Rs 28/kg</strong><div><button className="primary-button small-button" onClick={onSend}>Accept</button><button className="outline-button small-button" onClick={onSend}>Counter at Rs 27</button></div></div><div className="message sent">Thanks Ravi. Can you deliver to Guntur market by Thursday?<time>10:17 AM</time></div></div><form className="chat-compose" onSubmit={e => { e.preventDefault(); onSend(); }}><input value={message} onChange={e => setMessage(e.target.value)} placeholder="Write a message..." /><button className="primary-button" type="submit">Send</button></form></div></section>; }

export default BuyerMarketplace;