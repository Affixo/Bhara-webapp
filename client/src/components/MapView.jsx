import { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const LIBRARIES = ["places"];

const containerStyle = { width: "100%", height: "320px" };

export default function MapView({ lat, lng, title, address }) {
  const [infoOpen, setInfoOpen] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    // ✅ Same ID as MapPicker — prevents double-load conflict
    id: "bhara-google-maps",
  });

  // Guard: if no coordinates stored, show a friendly placeholder
  const hasLocation =
    lat !== undefined &&
    lat !== null &&
    lat !== "" &&
    lng !== undefined &&
    lng !== null &&
    lng !== "";

  if (!hasLocation) {
    return (
      <div
        style={{
          height: "180px",
          background: "#f3f4f6",
          borderRadius: "0.75rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          gap: "0.5rem",
          border: "1px solid #e5e7eb",
        }}
      >
        <span style={{ fontSize: "2rem" }}>🗺️</span>
        <span style={{ fontSize: "0.875rem" }}>
          No map location set for this listing
        </span>
      </div>
    );
  }

  const position = { lat: parseFloat(lat), lng: parseFloat(lng) };

  const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

  if (loadError) {
    return (
      <div
        style={{
          height: "180px",
          background: "#fef2f2",
          borderRadius: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#dc2626",
          fontSize: "0.875rem",
          border: "1px solid #fecaca",
        }}
      >
        ⚠️ Maps failed to load — check API key
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        style={{
          height: "320px",
          background: "#f3f4f6",
          borderRadius: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          color: "#6b7280",
          fontSize: "0.875rem",
        }}
      >
        <div className="spinner spinner-sm" />
        Loading map…
      </div>
    );
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={16}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
          clickableIcons: false,
        }}
      >
        {/* ✅ Marker always rendered at the saved lat/lng */}
        <Marker
          position={position}
          title={title || "Property Location"}
          onClick={() => setInfoOpen(true)}
        >
          {/* ✅ InfoWindow open by default showing the property name */}
          {infoOpen && (
            <InfoWindow
              position={position}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div
                style={{
                  maxWidth: "220px",
                  fontFamily: "Inter, sans-serif",
                  padding: "2px",
                }}
              >
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    color: "#065f46",
                    marginBottom: address ? "4px" : "0",
                  }}
                >
                  📍 {title || "Property Location"}
                </p>
                {address && (
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "#6b7280",
                      marginBottom: "6px",
                    }}
                  >
                    {address}
                  </p>
                )}
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.78rem",
                    color: "#059669",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>

      {/* Bottom bar with coordinates + external link */}
      <div
        style={{
          background: "#f9fafb",
          borderTop: "1px solid #e5e7eb",
          padding: "0.5rem 0.85rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
          📌 {parseFloat(lat).toFixed(5)}, {parseFloat(lng).toFixed(5)}
        </span>
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.75rem",
            color: "#059669",
            fontWeight: "600",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  );
}
