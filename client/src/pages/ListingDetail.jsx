import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MapView from "../components/MapView";
import toast from "react-hot-toast";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiEdit,
  FiTrash2,
  FiSend,
} from "react-icons/fi";

const TYPE_COLORS = {
  family: "badge-family",
  bachelor: "badge-bachelor",
  sublet: "badge-sublet",
  office: "badge-office",
  seat: "badge-seat",
};

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMsg, setRequestMsg] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data } = await api.get(`/listings/${id}`);
      setListing(data);
    } catch {
      toast.error("Listing not found");
      navigate("/listings");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await api.delete(`/listings/${id}`);
      toast.success("Listing deleted");
      navigate("/profile");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/requests", {
        listingId: id,
        message: requestMsg,
        moveInDate: moveIn,
      });
      toast.success("Request sent successfully!");
      setShowRequestModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="spinner-page">
        <div className="spinner" />
      </div>
    );
  }

  if (!listing) return null;

  const isOwner = user && listing.owner._id === user._id;
  const imgs =
    listing.images?.length > 0
      ? listing.images.map((i) => `http://localhost:5000${i}`)
      : ["https://placehold.co/800x500/e2e8f0/64748b?text=No+Image"];

  // ✅ Pull lat/lng directly from listing.location
  const mapLat = listing.location?.lat;
  const mapLng = listing.location?.lng;
  const hasMap =
    mapLat !== null &&
    mapLat !== undefined &&
    mapLng !== null &&
    mapLng !== undefined;

  return (
    <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2rem 1rem" }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main Content ──────────────────────────────────── */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="gallery-main mb-3">
            <img src={imgs[activeImg]} alt={listing.title} />
          </div>

          {imgs.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                overflowX: "auto",
                paddingBottom: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {imgs.map((img, i) => (
                <div
                  key={i}
                  className={`gallery-thumb ${activeImg === i ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          )}

          {/* Title & Actions */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}
          >
            <div>
              <span
                className={`badge ${TYPE_COLORS[listing.type] || ""}`}
                style={{ marginBottom: "0.4rem", display: "inline-block" }}
              >
                {listing.type}
              </span>
              <h1
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "800",
                  color: "#1f2937",
                }}
              >
                {listing.title}
              </h1>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  color: "#6b7280",
                  marginTop: "0.25rem",
                  fontSize: "0.9rem",
                }}
              >
                <FiMapPin style={{ color: "#059669", flexShrink: 0 }} />
                {listing.location?.address}
                {listing.location?.area ? `, ${listing.location.area}` : ""}
                {`, ${listing.location?.city}`}
              </p>
            </div>

            {isOwner && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => navigate(`/listings/${id}/edit`)}
                  className="btn btn-secondary"
                  style={{ fontSize: "0.85rem" }}
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                  style={{ fontSize: "0.85rem" }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            {[
              { label: "Bedrooms", value: listing.bedrooms, icon: "🛏️" },
              { label: "Bathrooms", value: listing.bathrooms, icon: "🚿" },
              {
                label: "Area",
                value: listing.area ? `${listing.area} sqft` : "N/A",
                icon: "📐",
              },
              { label: "Floor", value: listing.floor || "N/A", icon: "🏢" },
              { label: "Furnished", value: listing.furnished, icon: "🛋️" },
              {
                label: "Available",
                value: listing.availableFrom
                  ? new Date(listing.availableFrom).toLocaleDateString()
                  : "Now",
                icon: "📅",
              },
              { label: "Status", value: listing.status, icon: "✅" },
              { label: "Views", value: listing.views, icon: "👁️" },
            ].map((d) => (
              <div
                key={d.label}
                style={{
                  background: "#f9fafb",
                  borderRadius: "0.75rem",
                  padding: "0.75rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                  {d.icon}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                  {d.label}
                </div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "0.875rem",
                    textTransform: "capitalize",
                  }}
                >
                  {d.value}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontWeight: "700",
                fontSize: "1.1rem",
                color: "#1f2937",
                marginBottom: "0.5rem",
              }}
            >
              Description
            </h2>
            <p
              style={{
                color: "#4b5563",
                lineHeight: "1.7",
                whiteSpace: "pre-line",
              }}
            >
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          {listing.amenities?.length > 0 && (
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  color: "#1f2937",
                  marginBottom: "0.75rem",
                }}
              >
                Amenities
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {listing.amenities.map((a) => (
                  <span key={a} className="amenity-tag">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Map Section */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontWeight: "700",
                fontSize: "1.1rem",
                color: "#1f2937",
                marginBottom: "0.75rem",
              }}
            >
              📍 Property Location
            </h2>

            {hasMap ? (
              <MapView
                lat={mapLat}
                lng={mapLng}
                title={listing.title}
                address={`${listing.location?.address}, ${listing.location?.city}`}
              />
            ) : (
              <div
                style={{
                  height: "140px",
                  background: "#f9fafb",
                  border: "1.5px dashed #e5e7eb",
                  borderRadius: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                  gap: "0.4rem",
                  fontSize: "0.875rem",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🗺️</span>
                <span>No map location was set for this listing</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Price */}
          <div className="price-box">
            <div className="amount">৳{listing.rent.toLocaleString()}</div>
            <div className="period">
              per month{listing.negotiable ? " · Negotiable" : ""}
            </div>
          </div>

          {/* Owner Card */}
          <div className="card">
            <h3
              style={{
                fontWeight: "700",
                color: "#374151",
                marginBottom: "1rem",
              }}
            >
              Listed by
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <div className="avatar avatar-lg">
                {listing.owner.avatar ? (
                  <img
                    src={`http://localhost:5000${listing.owner.avatar}`}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "9999px",
                    }}
                  />
                ) : (
                  listing.owner.name?.[0]?.toUpperCase()
                )}
              </div>
              <div>
                <p style={{ fontWeight: "600", color: "#1f2937" }}>
                  {listing.owner.name}
                </p>
                <p style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                  Property Owner
                </p>
              </div>
            </div>
            <a
              href={`tel:${listing.owner.phone}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#374151",
                fontSize: "0.875rem",
                textDecoration: "none",
                marginBottom: "0.5rem",
              }}
            >
              <FiPhone style={{ color: "#059669" }} /> {listing.owner.phone}
            </a>
            {listing.owner.email && (
              <a
                href={`mailto:${listing.owner.email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#374151",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                <FiMail style={{ color: "#059669" }} /> {listing.owner.email}
              </a>
            )}
          </div>

          {/* Rent Request Button */}
          {!isOwner && user && listing.status === "available" && (
            <button
              onClick={() => setShowRequestModal(true)}
              className="btn btn-primary"
              style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
            >
              <FiSend /> Send Rent Request
            </button>
          )}

          {!user && (
            <div
              style={{
                background: "#f9fafb",
                borderRadius: "0.75rem",
                padding: "1rem",
                textAlign: "center",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              <a href="/login" style={{ color: "#059669", fontWeight: "600" }}>
                Login
              </a>{" "}
              to send a rent request
            </div>
          )}

          {listing.status === "rented" && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                textAlign: "center",
                borderRadius: "0.75rem",
                padding: "1rem",
                fontWeight: "600",
              }}
            >
              This property is already rented
            </div>
          )}
        </div>
      </div>

      {/* ── Request Modal ──────────────────────────────────── */}
      {showRequestModal && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setShowRequestModal(false)
          }
        >
          <div className="modal-box">
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "1.25rem",
              }}
            >
              Send Rent Request
            </h2>
            <form
              onSubmit={handleRequest}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label className="form-label">Message to Owner</label>
                <textarea
                  value={requestMsg}
                  onChange={(e) => setRequestMsg(e.target.value)}
                  rows={4}
                  className="form-textarea"
                  placeholder="Introduce yourself and mention your requirements..."
                />
              </div>
              <div>
                <label className="form-label">Expected Move-in Date</label>
                <input
                  type="date"
                  value={moveIn}
                  onChange={(e) => setMoveIn(e.target.value)}
                  className="form-input"
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {sending ? "Sending…" : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
