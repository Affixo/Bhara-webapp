import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ListingCard from "../components/ListingCard";
import { FiSearch, FiArrowRight, FiHome, FiTrendingUp } from "react-icons/fi";

const TYPES = [
  { label: "Family", value: "family", emoji: "👨‍👩‍👧‍👦" },
  { label: "Bachelor", value: "bachelor", emoji: "🧑" },
  { label: "Sub-let", value: "sublet", emoji: "🔑" },
  { label: "Office", value: "office", emoji: "🏢" },
  { label: "Seat", value: "seat", emoji: "🛏️" },
];

const POPULAR_CITIES = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Comilla",
];

const STATS = [
  { value: "500+", label: "Active Listings" },
  { value: "1,200+", label: "Happy Tenants" },
  { value: "6", label: "Major Cities" },
  { value: "100%", label: "Verified Posts" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const navigate = useNavigate();

  // Fetch 8 latest available listings for the preview section
  useEffect(() => {
    api
      .get("/listings", {
        params: { limit: 8, sort: "-createdAt", status: "available" },
      })
      .then(({ data }) => setListings(data.listings || []))
      .catch(() => setListings([]))
      .finally(() => setLoadingListings(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="hero">
        <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
          <h1 className="hero-title animate-fade-in">
            Find Your Perfect <br />
            <span style={{ color: "#6ee7b7" }}>To-Let</span> in Bangladesh
          </h1>
          <p className="hero-subtitle animate-fade-in">
            Thousands of verified rental listings — Family, Bachelor, Sub-let,
            Office &amp; more
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hero-search animate-fade-in">
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <FiSearch
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by area, title, keyword…"
                style={{
                  paddingLeft: "2.5rem",
                  width: "100%",
                  border: "none",
                  outline: "none",
                  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                  fontSize: "0.9rem",
                  borderRadius: "0.6rem",
                  fontFamily: "Inter, sans-serif",
                  color: "#374151",
                  background: "transparent",
                }}
              />
            </div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                padding: "0.75rem 1rem",
                color: "#374151",
                borderRadius: "0.6rem",
                outline: "none",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                fontSize: "0.875rem",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <option value="">All Cities</option>
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button type="submit">
              <FiSearch /> Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <section style={{ background: "#065f46", padding: "1.25rem 1rem" }}>
        <div
          style={{
            maxWidth: "56rem",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "900",
                  color: "#6ee7b7",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.7)",
                  marginTop: "0.1rem",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse by Type ──────────────────────────────────── */}
      <section
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "4rem 1rem 2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "800",
              color: "#1f2937",
              marginBottom: "0.4rem",
            }}
          >
            Browse by Type
          </h2>
          <p style={{ color: "#6b7280" }}>
            Choose the rental type that fits your lifestyle
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "1rem",
          }}
        >
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => navigate(`/listings?type=${t.value}`)}
              className="type-card"
            >
              <span className="type-emoji">{t.emoji}</span>
              <span className="type-label">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured / Latest Listings ──────────────────────── */}
      <section
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "2rem 1rem 4rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.3rem",
              }}
            >
              <FiTrendingUp style={{ color: "#059669", fontSize: "1.25rem" }} />
              <h2
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "800",
                  color: "#1f2937",
                }}
              >
                Latest Listings
              </h2>
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Fresh rentals just posted — grab them before they're gone
            </p>
          </div>

          {/* ✅ See More button → goes to Listings page */}
          <button
            onClick={() => navigate("/listings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "transparent",
              border: "2px solid #059669",
              color: "#059669",
              fontWeight: "700",
              fontSize: "0.9rem",
              padding: "0.6rem 1.4rem",
              borderRadius: "0.75rem",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "Inter, sans-serif",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#059669";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#059669";
            }}
          >
            See All Listings <FiArrowRight />
          </button>
        </div>

        {/* Listings grid */}
        {loadingListings ? (
          <div className="listings-grid">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  style={{ borderRadius: "1rem", overflow: "hidden" }}
                >
                  <div
                    className="skeleton"
                    style={{ height: "12rem", borderRadius: "1rem 1rem 0 0" }}
                  />
                  <div
                    style={{
                      padding: "1rem",
                      background: "#fff",
                      borderRadius: "0 0 1rem 1rem",
                      border: "1px solid #f1f5f9",
                      borderTop: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      className="skeleton"
                      style={{ height: "1rem", width: "80%" }}
                    />
                    <div
                      className="skeleton"
                      style={{ height: "0.8rem", width: "55%" }}
                    />
                    <div
                      className="skeleton"
                      style={{
                        height: "1.2rem",
                        width: "40%",
                        marginTop: "0.5rem",
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        ) : listings.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1rem",
              background: "#f9fafb",
              borderRadius: "1rem",
              border: "1.5px dashed #e5e7eb",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🏠</div>
            <h3
              style={{
                fontWeight: "600",
                color: "#4b5563",
                marginBottom: "0.4rem",
              }}
            >
              No listings yet
            </h3>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.875rem",
                marginBottom: "1.25rem",
              }}
            >
              Be the first to post a rental property!
            </p>
            <button
              onClick={() => navigate("/create")}
              style={{
                background: "#059669",
                color: "#fff",
                border: "none",
                borderRadius: "0.75rem",
                padding: "0.75rem 1.5rem",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Post a Listing
            </button>
          </div>
        ) : (
          <>
            <div className="listings-grid">
              {listings.map((l) => (
                <ListingCard key={l._id} listing={l} />
              ))}
            </div>

            {/* ✅ Bottom "See More" banner */}
            <div
              style={{
                marginTop: "2.5rem",
                background: "linear-gradient(135deg, #ecfdf5, #f0fdfa)",
                border: "1.5px solid #a7f3d0",
                borderRadius: "1rem",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <FiHome
                style={{
                  fontSize: "2rem",
                  color: "#059669",
                  marginBottom: "0.5rem",
                  display: "block",
                  margin: "0 auto 0.5rem",
                }}
              />
              <h3
                style={{
                  fontWeight: "700",
                  color: "#065f46",
                  fontSize: "1.1rem",
                  marginBottom: "0.3rem",
                }}
              >
                Want to see more?
              </h3>
              <p
                style={{
                  color: "#4b5563",
                  fontSize: "0.875rem",
                  marginBottom: "1.25rem",
                }}
              >
                Browse all available rentals with powerful filters — by area,
                price, rooms and more.
              </p>
              <button
                onClick={() => navigate("/listings")}
                style={{
                  background: "#059669",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.75rem",
                  padding: "0.8rem 2rem",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "Inter, sans-serif",
                  transition: "background 0.2s",
                  boxShadow: "0 4px 12px rgba(5,150,105,0.3)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#047857")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#059669")
                }
              >
                Browse All Listings <FiArrowRight />
              </button>
            </div>
          </>
        )}
      </section>

      {/* ── Popular Cities ──────────────────────────────────── */}
      <section style={{ background: "#f3f4f6", padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: "800",
                color: "#1f2937",
                marginBottom: "0.4rem",
              }}
            >
              Popular Cities
            </h2>
            <p style={{ color: "#6b7280" }}>
              Find rentals in cities across Bangladesh
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "0.75rem",
            }}
          >
            {POPULAR_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => navigate(`/listings?city=${c}`)}
                className="city-card"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Post CTA ────────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 1rem",
          textAlign: "center",
          background: "#fff",
        }}
      >
        <div style={{ maxWidth: "36rem", margin: "0 auto" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏠</div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: "#1f2937",
              marginBottom: "0.75rem",
            }}
          >
            Have a Property to Rent?
          </h2>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "2rem",
              lineHeight: "1.6",
            }}
          >
            List your property for free and reach thousands of potential tenants
            across Bangladesh.
          </p>
          <button
            onClick={() => navigate("/create")}
            style={{
              background: "#059669",
              color: "#fff",
              border: "none",
              borderRadius: "0.75rem",
              padding: "1rem 2.5rem",
              fontWeight: "700",
              fontSize: "1.1rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "Inter, sans-serif",
              transition: "background 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 16px rgba(5,150,105,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#047857";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(5,150,105,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#059669";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(5,150,105,0.3)";
            }}
          >
            Post Your Rental <FiArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
}
