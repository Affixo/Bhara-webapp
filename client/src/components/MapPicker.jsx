import { useCallback, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const LIBRARIES = ["places"];

const containerStyle = { width: "100%", height: "360px" };

// Default center — Dhaka, Bangladesh
const DHAKA = { lat: 23.8103, lng: 90.4125 };

export default function MapPicker({
  onLocationSelect,
  initialLat,
  initialLng,
}) {
  const [marker, setMarker] = useState(
    initialLat && initialLng
      ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) }
      : null,
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    // Single consistent ID used everywhere
    id: "bhara-google-maps",
  });

  const handleMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const pinned = { lat, lng };
      setMarker(pinned);
      // Send numbers directly to parent
      onLocationSelect(lat, lng);
    },
    [onLocationSelect],
  );

  if (loadError) {
    return (
      <div className="map-container">
        <div
          style={{
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fef2f2",
            color: "#dc2626",
            borderRadius: "0.75rem",
            flexDirection: "column",
            gap: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
        >
          <span style={{ fontSize: "2rem" }}>⚠️</span>
          <span>Google Maps failed to load.</span>
          <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>
            Check your API key in client/.env
          </span>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-container">
        <div
          style={{
            height: "360px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f3f4f6",
            borderRadius: "0.75rem",
            gap: "0.75rem",
            color: "#6b7280",
            fontSize: "0.875rem",
          }}
        >
          <div className="spinner spinner-sm" />
          Loading map…
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      {/* Instruction bar */}
      <div
        style={{
          background: "#f0fdf4",
          borderBottom: "1px solid #d1fae5",
          padding: "0.5rem 0.85rem",
          fontSize: "0.8rem",
          color: "#047857",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        📍 Click anywhere on the map to pin your property location
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker || DHAKA}
        zoom={marker ? 16 : 12}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
          clickableIcons: false,
        }}
      >
        {marker && (
          <Marker
            position={marker}
            animation={2} /* DROP animation = 2 */
            title="Your property location"
          />
        )}
      </GoogleMap>

      {/* Confirmation bar — shows saved coordinates */}
      {marker ? (
        <div
          style={{
            background: "#059669",
            color: "#ffffff",
            padding: "0.6rem 0.85rem",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <span>
            ✅ Location pinned! Lat: <strong>{marker.lat.toFixed(6)}</strong>{" "}
            &nbsp; Lng: <strong>{marker.lng.toFixed(6)}</strong>
          </span>
          <button
            type="button"
            onClick={() => {
              setMarker(null);
              onLocationSelect(null, null);
            }}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#ffffff",
              borderRadius: "0.4rem",
              padding: "0.2rem 0.5rem",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            Clear
          </button>
        </div>
      ) : (
        <div
          style={{
            background: "#f9fafb",
            borderTop: "1px solid #f1f5f9",
            padding: "0.5rem 0.85rem",
            fontSize: "0.78rem",
            color: "#9ca3af",
          }}
        >
          No location pinned yet — click the map above to set one.
        </div>
      )}
    </div>
  );
}
