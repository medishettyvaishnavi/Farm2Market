import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FaUserShield,
  FaTractor,
  FaStore,
  FaHandshake,
  FaGlobe,
  FaChartBar,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaFilter,
  FaSearch,
} from "react-icons/fa";

const mockNgoStats = {
  summary: {
    farmers: { total: 124, verified: 110, active: 85, villages: 6 },
    buyers: { total: 18, verified: 15, active: 12 },
    transactions: { total: 42, completed: 32, pending: 8, cancelled: 2, value: 1245000 },
    impact: { farmersBenefited: 74, directTransactions: 42, totalFarmerRevenue: 1184000, villagesCovered: 6, cropsSold: 4 }
  },
  villageStats: [
    { village: "Khammam Rural", farmers: 45, transactions: 15, topCrop: "Cotton", revenue: 412000 },
    { village: "Tenali Mandi", farmers: 28, transactions: 11, topCrop: "Tomato", revenue: 298000 },
    { village: "Guntur Outskirts", farmers: 22, transactions: 8, topCrop: "Chilli", revenue: 245000 },
    { village: "Wyra Gate", farmers: 19, transactions: 5, topCrop: "Paddy", revenue: 165000 },
    { village: "Warangal Bypass", farmers: 10, transactions: 3, topCrop: "Turmeric", revenue: 64000 }
  ],
  cropSales: [
    { crop: "Cotton", revenue: 480000, quantity: 64 },
    { crop: "Red Chilli", revenue: 382000, quantity: 20 },
    { crop: "Paddy / Rice", revenue: 222000, quantity: 95 },
    { crop: "Turmeric", revenue: 161000, quantity: 15 }
  ],
  trends: [
    { month: "Apr 2026", transactions: 8, revenue: 210000 },
    { month: "May 2026", transactions: 10, revenue: 280000 },
    { month: "Jun 2026", transactions: 12, revenue: 340000 },
    { month: "Jul 2026", transactions: 12, revenue: 354000 }
  ]
};

function NgoDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [villageFilter, setVillageFilter] = useState("All");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/ngo/dashboard");
        if (res.data.success) {
          setStats(res.data.data);
        } else {
          setStats(mockNgoStats);
        }
      } catch (err) {
        console.warn("Failed to fetch NGO stats, using fallback mock stats:", err);
        setStats(mockNgoStats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const { summary, villageStats, cropSales, trends } = stats || mockNgoStats;

  // Filter village table
  const filteredVillages = villageStats.filter(v => {
    const matchesSearch = v.village.toLowerCase().includes(search.toLowerCase()) || v.topCrop.toLowerCase().includes(search.toLowerCase());
    const matchesSelect = villageFilter === "All" || v.village === villageFilter;
    return matchesSearch && matchesSelect;
  });

  const handleLogoutClick = () => {
    logout();
    navigate("/ngo/login");
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Top Navbar */}
      <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top py-2 px-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="navbar-brand fw-bold d-flex align-items-center gap-2 text-white">
            <span className="bg-success text-white rounded-circle p-1 d-inline-flex align-items-center justify-content-center shadow-sm">
              🌾
            </span>
            <span>Farm2Market <span className="badge bg-success ms-1 small">NGO Portal</span></span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-white-50 small d-none d-sm-inline">
              <FaUserShield className="me-1 text-success" /> Authorized Monitor
            </div>
            <button 
              type="button" 
              className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1 border-0"
              onClick={handleLogoutClick}
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container-fluid py-4 px-3 px-md-4">
        {/* Welcome row */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-white p-4 rounded-4 shadow-sm border">
              <h1 className="fw-bold text-dark mb-1">Ecosystem Impact Analytics</h1>
              <p className="text-muted mb-0">
                Independent NGO monitoring desk tracking direct peer-to-peer transaction volumes, village coverage, and micro-earnings distribution.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="row g-3 mb-4">
          {/* Farmers card */}
          <div className="col-6 col-lg-3">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small text-muted fw-bold">FARMERS</span>
                <span className="bg-success-subtle text-success p-1 rounded-3 small">
                  <FaTractor />
                </span>
              </div>
              <h3 className="fw-bold text-dark mb-0">{summary.farmers.total}</h3>
              <p className="small text-muted mb-0 mt-2">
                <b>{summary.farmers.verified}</b> Verified • <b>{summary.farmers.active}</b> Active
              </p>
            </div>
          </div>

          {/* Buyers card */}
          <div className="col-6 col-lg-3">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small text-muted fw-bold">BUYERS</span>
                <span className="bg-primary-subtle text-primary p-1 rounded-3 small">
                  <FaStore />
                </span>
              </div>
              <h3 className="fw-bold text-dark mb-0">{summary.buyers.total}</h3>
              <p className="small text-muted mb-0 mt-2">
                <b>{summary.buyers.verified}</b> Verified • <b>{summary.buyers.active}</b> Active
              </p>
            </div>
          </div>

          {/* Transactions card */}
          <div className="col-6 col-lg-3">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small text-muted fw-bold">TRANSACTIONS</span>
                <span className="bg-warning-subtle text-warning p-1 rounded-3 small">
                  <FaHandshake />
                </span>
              </div>
              <h3 className="fw-bold text-dark mb-0">{summary.transactions.total}</h3>
              <p className="small text-muted mb-0 mt-2">
                Value: <b>₹{summary.transactions.value.toLocaleString()}</b>
              </p>
            </div>
          </div>

          {/* Village Covered card */}
          <div className="col-6 col-lg-3">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small text-muted fw-bold">VILLAGES COVERED</span>
                <span className="bg-info-subtle text-info p-1 rounded-3 small">
                  <FaGlobe />
                </span>
              </div>
              <h3 className="fw-bold text-dark mb-0">{summary.farmers.villages}</h3>
              <p className="small text-muted mb-0 mt-2">
                Benefited: <b>{summary.impact.farmersBenefited}</b> Farmers
              </p>
            </div>
          </div>
        </div>

        {/* Impact summary panel */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-success text-white">
              <span className="badge bg-white text-success fw-bold px-3 py-1 rounded-pill mb-2 d-inline-block">Ecosystem Impact Indicator</span>
              <div className="row g-4 text-center text-md-start">
                <div className="col-md-3">
                  <span className="small opacity-75 d-block">Farmers Benefited</span>
                  <h4 className="fw-bold mb-0">{summary.impact.farmersBenefited} Farmers</h4>
                </div>
                <div className="col-md-3 border-start border-white-subtle">
                  <span className="small opacity-75 d-block">Direct P2P Transactions</span>
                  <h4 className="fw-bold mb-0">{summary.impact.directTransactions} completed</h4>
                </div>
                <div className="col-md-3 border-start border-white-subtle">
                  <span className="small opacity-75 d-block">Total Farmer Net Revenue</span>
                  <h4 className="fw-bold mb-0">₹{summary.impact.totalFarmerRevenue.toLocaleString()}</h4>
                </div>
                <div className="col-md-3 border-start border-white-subtle">
                  <span className="small opacity-75 d-block">Crops Persistent</span>
                  <h4 className="fw-bold mb-0">{summary.impact.cropsSold} distinct varieties</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Visualization Section */}
        <div className="row g-4 mb-4">
          {/* Revenue Over Time Chart */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <FaChartBar className="text-success" /> Farmer Net Earnings (Monthly)
              </h5>
              <div className="d-flex flex-column gap-3 justify-content-center align-items-stretch" style={{ minHeight: "220px" }}>
                {trends.map((t, idx) => {
                  const maxRevenue = Math.max(...trends.map(x => x.revenue)) || 1;
                  const widthPercent = (t.revenue / maxRevenue) * 80 + 15;
                  return (
                    <div key={idx} className="d-flex align-items-center gap-2">
                      <div className="small text-muted text-nowrap" style={{ width: "80px" }}>{t.month}</div>
                      <div className="flex-grow-1 bg-light rounded-pill" style={{ height: "24px" }}>
                        <div 
                          className="bg-success text-white small px-2 rounded-pill d-flex align-items-center justify-content-end fw-bold" 
                          style={{ width: `${widthPercent}%`, height: "100%", fontSize: "0.75rem", transition: "width 0.5s ease" }}
                        >
                          ₹{t.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Crop sales share */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <FaChartBar className="text-primary" /> Crop-wise Sales Value Distribution
              </h5>
              <div className="d-flex flex-column gap-3 justify-content-center align-items-stretch" style={{ minHeight: "220px" }}>
                {cropSales.map((c, idx) => {
                  const maxSale = Math.max(...cropSales.map(x => x.revenue)) || 1;
                  const widthPercent = (c.revenue / maxSale) * 80 + 15;
                  const colors = ["bg-primary", "bg-success", "bg-warning text-dark", "bg-info text-dark"];
                  return (
                    <div key={idx} className="d-flex align-items-center gap-2">
                      <div className="small text-muted text-nowrap" style={{ width: "90px" }}>{c.crop}</div>
                      <div className="flex-grow-1 bg-light rounded-pill" style={{ height: "24px" }}>
                        <div 
                          className={`${colors[idx % colors.length]} small px-2 rounded-pill d-flex align-items-center justify-content-end fw-bold`} 
                          style={{ width: `${widthPercent}%`, height: "100%", fontSize: "0.75rem", transition: "width 0.5s ease" }}
                        >
                          ₹{c.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Village wise analytics table */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                  <h5 className="fw-bold text-dark mb-1">Village Impact Statistics</h5>
                  <p className="text-muted small mb-0">Micro-level analytics across farmer settlements and rural hubs.</p>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="search-box bg-light border p-2 rounded-pill d-flex align-items-center gap-2 px-3" style={{ width: "230px" }}>
                    <FaSearch className="text-muted" />
                    <input 
                      type="text" 
                      value={search} 
                      onChange={e => setSearch(e.target.value)} 
                      placeholder="Search village or crop..." 
                      className="bg-transparent border-0 outline-0 small flex-grow-1" 
                      style={{ fontSize: "0.85rem", outline: "none" }}
                    />
                  </div>

                  <select 
                    value={villageFilter} 
                    onChange={e => setVillageFilter(e.target.value)} 
                    className="form-select form-select-sm rounded-pill px-3 py-2 border-secondary-subtle" 
                    style={{ width: "160px" }}
                  >
                    <option value="All">All Villages</option>
                    {villageStats.map((v, idx) => (
                      <option key={idx} value={v.village}>{v.village}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="fw-bold text-muted small py-3">VILLAGE HUB</th>
                      <th scope="col" className="fw-bold text-muted small py-3 text-center">FARMERS BENEFITED</th>
                      <th scope="col" className="fw-bold text-muted small py-3 text-center">COMPLETED SALES</th>
                      <th scope="col" className="fw-bold text-muted small py-3">TOP PRODUCING CROP</th>
                      <th scope="col" className="fw-bold text-muted small py-3 text-end">TOTAL REVENUE GENERATED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVillages.map((v, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold py-3"><FaMapMarkerAlt className="text-danger me-2" />{v.village}</td>
                        <td className="text-center py-3">{v.farmers}</td>
                        <td className="text-center py-3">{v.transactions}</td>
                        <td className="py-3"><span className="badge bg-success-subtle text-success border px-3 py-1 rounded-pill fw-bold">🌾 {v.topCrop}</span></td>
                        <td className="text-end fw-bold text-success py-3">₹{v.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                    {filteredVillages.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-5">
                          No village statistics match these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NgoDashboard;
