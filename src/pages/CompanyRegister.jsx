import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CompanyRegister() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Minimal Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    lat: "",
    lng: ""
  });

  /* ---------------- GEOLOCATION & MAP LOGIC ---------------- */

  useEffect(() => {
    console.log("🚀 CompanyRegister Component Mounted");

    // Check if Leaflet is available (loaded in index.html)
    if (!window.L) {
      console.warn("❌ Leaflet library not found.");
      return;
    }

    const mapElement = document.getElementById("map-container");
    if (!mapElement) {
      console.error("❌ Map container element not found");
      return;
    }

    if (mapRef.current) return;

    // Initialize map (Default center: Doha)
    const defaultCenter = [25.2854, 51.5310];
    const map = window.L.map(mapElement).setView(defaultCenter, 12);
    mapRef.current = map;

    // Load OpenStreetMap tiles
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // Initial Marker
    const marker = window.L.marker(defaultCenter, { draggable: true }).addTo(map);
    markerRef.current = marker;

    // 1. Initial Geolocation on Page Entry
    const handleGeoSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      const msg = "✅ [PAGE ENTRY] User Current Location: Lat " + latitude + ", Lon " + longitude;
      console.error(msg); // Error level is rarely filtered
      console.log(msg);
      window.__USER_CURRENT_LOC__ = { latitude, longitude };
      window.alert(msg);

      const pos = [latitude, longitude];
      map.setView(pos, 15);
      marker.setLatLng(pos);
      setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
    };

    const handleGeoError = (err) => {
      console.error("❌ Geolocation Error:", err.message);
      if (err.code === 1) {
        alert("Location permission is requested to show your current position. Please enable it in your browser settings.");
      } else if (err.code === 2) {
        alert("Location provider unavailable.");
      } else if (err.code === 3) {
        alert("Location request timed out.");
      }
    };

    console.log("🛰️ Requesting current location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      });
    } else {
      console.error("❌ Geolocation not supported by this browser");
    }

    // 2. Map Tap Location Logging
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      const msg = "📍 [MAP TAP] Tapped Location: Lat " + lat + ", Lon " + lng;
      console.error(msg);
      console.log(msg);
      window.__USER_TAPPED_LOC__ = { lat, lng };
      window.alert(msg);

      marker.setLatLng([lat, lng]);
      setFormData(prev => ({ ...prev, lat: lat, lng: lng }));
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 30, background: "white", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>Company Registration</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 15, marginBottom: 20 }}>
          <input style={inputStyle} placeholder="Company Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          <input style={inputStyle} placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
          <input style={inputStyle} type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          <input style={inputStyle} type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
        </div>

        <p style={{ fontSize: 13, color: "#666", marginBottom: 10 }}>* Check console for Latitude/Longitude logs on entry and map tap.</p>

        <div id="map-container" style={{ height: 350, width: "100%", borderRadius: 10, border: "1px solid #ddd", marginBottom: 20, background: "#f0f0f0" }}></div>

        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "#888" }}>
            Lat: {formData.lat || "-"} | Lon: {formData.lng || "-"}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={() => navigate(-1)} style={{ ...buttonStyle, background: "#9ca3af" }}>Back</button>
            <button type="submit" style={{ ...buttonStyle, background: "#2563eb" }}>Register</button>
          </div>
        </div>
      </form>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", boxSizing: "border-box", fontSize: "14px" };
const buttonStyle = { padding: "10px 20px", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "14px" };

