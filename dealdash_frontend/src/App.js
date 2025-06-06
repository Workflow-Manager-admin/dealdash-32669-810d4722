import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  /** Main Container for DealDash web app. 
   * Features: authentication, notifications, deal aggregation, location-based alerts, map/list view, filters, ads, navigation.
   * Dark theme per requirements.
   */
  // ======= APP STATE =======

  // Authentication state (simulated; wire up to Firebase for production)
  const [user, setUser] = useState(null);

  // App location state (simulated geolocation)
  const [location, setLocation] = useState(null);

  // Map/List view toggle (default to list)
  const [viewMode, setViewMode] = useState("list"); // or "map"

  // Simulated deal data
  const [deals, setDeals] = useState([]);

  // Filter state (category)
  const [filter, setFilter] = useState("all");

  // Notification banner state
  const [notification, setNotification] = useState(null);

  // ==== SIMULATED AUTH ====
  const login = useCallback(() => {
    // Simulated user object
    setUser({ name: "Sam Shopper", email: "sam@demo.com" });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // ==== SIMULATED GEOFETCH ====
  useEffect(() => {
    if (!location) {
      // Simulate a permission request and set fake location
      setTimeout(() => {
        setLocation({ lat: 40.7128, lng: -74.006, city: "New York" });
      }, 1000);
    }
  }, [location]);

  // ==== SIMULATED DEAL AGGREGATION ====
  useEffect(() => {
    // Simulate loading deals (aggregate from APIs + user)
    setTimeout(() => {
      setDeals([
        {
          id: "1",
          business: "Joe's Bagels",
          category: "food",
          details: "Buy 1 get 1 free before 11am!",
          expiresAt: Date.now() + 900000, // 15 mins
          lat: 40.7132,
          lng: -74.007,
          affiliateUrl: "#",
          distance: 0.3,
        },
        {
          id: "2",
          business: "Style Shoes",
          category: "retail",
          details: "40% off clearance, today only.",
          expiresAt: Date.now() + 3600000, // 1 hour
          lat: 40.7142,
          lng: -74.003,
          affiliateUrl: "#",
          distance: 0.9,
        },
        {
          id: "3",
          business: "Urban Cafe",
          category: "food",
          details: "Free coffee with lunch order!",
          expiresAt: Date.now() + 5400000, // 90 min
          lat: 40.7118,
          lng: -74.008,
          affiliateUrl: "#",
          distance: 0.6,
        },
        {
          id: "4",
          business: "ElectroMart",
          category: "electronics",
          details: "Extra 10% off with code DEALDASH",
          expiresAt: Date.now() + 4000000,
          lat: 40.7111,
          lng: -74.002,
          affiliateUrl: "#",
          distance: 1.1,
        },
      ]);
    }, 1500);
  }, []);

  // ==== FILTERED DEALS ====
  const filteredDeals =
    filter === "all"
      ? deals
      : deals.filter((d) => d.category === filter);

  // ==== FAKE NOTIFICATION BANNER on Mount ====
  useEffect(() => {
    setTimeout(() => {
      setNotification("🔥 New flash deal near you: Joe's Bagels! Tap to claim.");
    }, 2500);
  }, []);

  // ==== CLEAR NOTIFICATION ====
  const clearNotification = () => setNotification(null);

  // ==== Handle Location-based Alerts ====
  // In production: subscribe to backend or Firebase for location-based pushes

  // ================= RENDER UI =================

  return (
    <div className="app dealdash-dark">
      {/* NAVBAR with logo and filter bar */}
      <nav className="navbar">
        <div className="dealdash-logo">
          <span className="logo-dot" />
          <span className="logo-main">DealDash</span>
        </div>
        <div className="filter-bar">
          <CategoryFilter filter={filter} setFilter={setFilter} />
        </div>
        <div className="user-auth">
          {user ? (
            <button className="btn" onClick={logout}>
              Logout ({user.name})
            </button>
          ) : (
            <button className="btn" onClick={login}>
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Notification Banner */}
      {notification && (
        <div className="notification-banner" onClick={clearNotification}>
          {notification}
          <button className="notif-close">x</button>
        </div>
      )}

      {/* MAIN App Content */}
      <main className="main-content">
        {/* App header, location info, map/list toggle */}
        <AppHeader
          city={location?.city}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === "map" ? (
          <MapView deals={filteredDeals} location={location} />
        ) : (
          <DealList deals={filteredDeals} />
        )}

        {/* Ad Banner Placeholder */}
        <div className="ad-section">
          <AdBanner />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

// PUBLIC_INTERFACE
function CategoryFilter({ filter, setFilter }) {
  // Filter bar for deal categories
  // In production: derive categories dynamically
  const categories = [
    { key: "all", label: "All" },
    { key: "food", label: "Food" },
    { key: "retail", label: "Retail" },
    { key: "electronics", label: "Electronics" },
  ];
  return (
    <div className="category-filter">
      {categories.map((cat) => (
        <button
          key={cat.key}
          className={`filter-btn${filter === cat.key ? " active" : ""}`}
          onClick={() => setFilter(cat.key)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function AppHeader({ city, viewMode, setViewMode }) {
  // App header with city/location, and map/list toggle
  return (
    <div className="app-header">
      <div>
        <span className="current-city">
          📍 {city ? city : "Locating..."}
        </span>
      </div>
      <div className="toggle-buttons">
        <button
          className={`toggle-btn${viewMode === "list" ? " active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          List
        </button>
        <button
          className={`toggle-btn${viewMode === "map" ? " active" : ""}`}
          onClick={() => setViewMode("map")}
        >
          Map
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function DealList({ deals }) {
  // List view of deals as DealCard
  return (
    <div className="deal-list">
      {deals.length === 0 ? (
        <div className="loading">Loading deals...</div>
      ) : (
        deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function DealCard({ deal }) {
  // Deal card with timer, business info, affiliate CTA, distance badge
  const [secondsLeft, setSecondsLeft] = useState(
    Math.round((deal.expiresAt - Date.now()) / 1000)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(Math.round((deal.expiresAt - Date.now()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [deal.expiresAt]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="deal-card">
      <div className="deal-card-main">
        <div className="deal-card-top">
          <span className="deal-business">{deal.business}</span>
          <span className="deal-distance">
            {deal.distance !== undefined && <>{deal.distance} mi</>}
          </span>
        </div>
        <div className="deal-description">{deal.details}</div>
        <div className="deal-card-bottom">
          <span className="deal-timer">
            ⏰ {minutes}:{seconds < 10 ? "0" : ""}
            {seconds} mins left
          </span>
          <a
            className="cta-btn"
            href={deal.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Claim Deal
          </a>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function MapView({ deals, location }) {
  // Placeholder for Map view
  // In production: replace with Leaflet, Google Maps, etc.
  return (
    <div className="map-view">
      <div className="map-placeholder">
        <span role="img" aria-label="map">
          🗺️
        </span>
        <div>
          <span>Map View coming soon</span>
        </div>
        <ul>
          {deals.map((deal) => (
            <li key={deal.id}>
              {deal.business}: {deal.details.slice(0, 36)}...
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function AdBanner() {
  // Ad/affiliate monetization banner (placeholder)
  // In production: replace with Google AdSense/AdMob, real affiliate blocks
  return (
    <div className="ad-banner">
      <span>Ad: Support us by clicking deals & ads!</span>
    </div>
  );
}

// PUBLIC_INTERFACE
function BottomNav() {
  // Bottom navigation per requirements
  // Home, My Deals, Submit Deal, Profile
  const navItems = [
    { key: "home", label: "Home", icon: "🏠" },
    { key: "mydeals", label: "My Deals", icon: "⭐" },
    { key: "submit", label: "Submit", icon: "➕" },
    { key: "profile", label: "Profile", icon: "👤" },
  ];
  // In production, implement actual navigation/routing
  const [selected, setSelected] = useState("home");
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`nav-btn${selected === item.key ? " active" : ""}`}
          onClick={() => setSelected(item.key)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default App;
