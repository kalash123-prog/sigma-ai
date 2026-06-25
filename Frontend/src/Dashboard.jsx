import { useNavigate } from "react-router-dom";
import { useAuth } from "./Mycontext";
import "./dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <header className="dash-nav">
        <div className="dash-nav-inner">
          <div className="dash-brand">
            <div className="brand-icon-sm">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>Wanderstay</span>
          </div>

          <div className="dash-nav-right">
            <div className="user-chip">
              <div className="user-avatar">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="user-name">{user?.username}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-welcome">
          <div className="welcome-text">
            <p className="welcome-eyebrow">Welcome back 👋</p>
            <h1>Hello, {user?.username}!</h1>
            <p className="welcome-sub">Logged in as <strong>{user?.email}</strong></p>
          </div>
          <div className="welcome-badge">
            <span>✅ Authenticated via Passport.js</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="dash-cards">
          {[
            { label: "My Listings", value: "0", icon: "🏡", cta: "Add listing" },
            { label: "Active Bookings", value: "0", icon: "📅", cta: "View bookings" },
            { label: "Total Reviews", value: "0", icon: "⭐", cta: "See reviews" },
            { label: "Earnings", value: "₹0", icon: "💰", cta: "View payouts" },
          ].map((card) => (
            <div className="dash-card" key={card.label}>
              <div className="card-top">
                <span className="card-icon">{card.icon}</span>
                <span className="card-value">{card.value}</span>
              </div>
              <span className="card-label">{card.label}</span>
              <button className="card-cta">{card.cta} →</button>
            </div>
          ))}
        </div>

        {/* Session info */}
        <div className="dash-info-panel">
          <h3>Session Info</h3>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-key">User ID</span>
              <code className="info-val">{user?.id}</code>
            </div>
            <div className="info-row">
              <span className="info-key">Username</span>
              <code className="info-val">{user?.username}</code>
            </div>
            <div className="info-row">
              <span className="info-key">Email</span>
              <code className="info-val">{user?.email}</code>
            </div>
            <div className="info-row">
              <span className="info-key">Auth method</span>
              <code className="info-val">Passport.js (local strategy)</code>
            </div>
            <div className="info-row">
              <span className="info-key">Session storage</span>
              <code className="info-val">MongoDB (connect-mongo)</code>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;