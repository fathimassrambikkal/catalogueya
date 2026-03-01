import React, { useState, useEffect, useRef } from "react";
import { registerCompany, getGoogleMap } from "../../api";
import { FaTimes, FaMapMarkerAlt, FaUpload, FaSearch } from "react-icons/fa";

let isGoogleMapsLoading = false;
const callbacks = [];

function loadGoogleMaps(callback) {
    if (window.google && window.google.maps && window.google.maps.places) {
        callback();
        return;
    }
    callbacks.push(callback);
    if (isGoogleMapsLoading) return;

    isGoogleMapsLoading = true;
    const script = document.createElement("script");
    const API_KEY = "AIzaSyCPaRykDl0CWuNR-9GjN0lhJrzhKoew9p8";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
        callbacks.forEach(cb => cb());
        callbacks.length = 0;
    };
    script.onerror = () => {
        isGoogleMapsLoading = false;
        console.error("Failed to load Google Maps script");
    };
    document.head.appendChild(script);
}

export function getAddressFromLatLng(lat, lng) {
    return new Promise((resolve) => {
        loadGoogleMaps(() => {
            const dummyNode = document.createElement('div');
            const service = new window.google.maps.places.PlacesService(dummyNode);
            const request = {
                location: { lat, lng },
                radius: 50
            };
            service.nearbySearch(request, async (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                    const firstResult = results[0];
                    const placeId = firstResult.place_id;

                    console.log(`📍 [Places API] Found Place ID: ${placeId} (${firstResult.name})`);

                    // Fetch detailed/formatted address from backend enrichment API
                    try {
                        const details = await getGoogleMap(placeId);
                        const respData = details?.data;
                        console.log("🔍 [Backend Enrichment] Response data:", respData);

                        if (respData?.data) {
                            const enriched = respData.data;
                            let finalAddress = "";

                            if (enriched.address && typeof enriched.address === 'object') {
                                finalAddress = enriched.address.formatted || enriched.address.line1 || firstResult.name || firstResult.vicinity;
                            } else if (typeof enriched.address === 'string') {
                                finalAddress = enriched.address;
                            } else {
                                finalAddress = firstResult.name || firstResult.vicinity;
                            }

                            return resolve({
                                address: String(finalAddress),
                                place_id: placeId,
                                raw: enriched
                            });
                        }
                    } catch (err) {
                        console.warn("⚠️ Backend enrichment failed, using Places API fallback:", err);
                    }

                    resolve({
                        address: String(firstResult.name || firstResult.vicinity),
                        place_id: placeId,
                        raw: firstResult
                    });
                } else {
                    console.error("Places Search failed:", status);
                    resolve(null);
                }
            });
        });
    });
}

export default function CompanyRegisterModal({ onClose, planId }) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Leaflet Refs & Google Services State
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [predictions, setPredictions] = useState([]);
    const [showPredictions, setShowPredictions] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        name_ar: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        description: "",
        plan_id: planId || 1,
        // Location
        address: "",
        formatted_address: "",
        place_id: "",
        lat: "",
        lng: "",
        // Docs
        commercial_license: null,
        establishment_card: null,
        commercial_registration: null,
        qid_authorized_signatories: null,
        // Optional Info
        whatsapp: "",
        instagram: "",
        tweeter: "", // backend calls it 'tweeter'
        facebook: "",
        youtube: "",
        logo: "",
        cover_photo: "",
    });

    const defaultCenter = [25.2854, 51.5310]; // Doha [lat, lng]

    // Sync Plan ID
    useEffect(() => {
        if (planId) {
            setFormData(prev => ({ ...prev, plan_id: planId }));
        }
    }, [planId]);

    // Map & Logic Initialization
    useEffect(() => {
        console.log("🚀 CompanyRegisterModal Mounted");

        const initMap = () => {
            if (!window.L) {
                console.warn("⏳ Leaflet not ready, retrying...");
                setTimeout(initMap, 200);
                return;
            }

            const mapElement = document.getElementById("reg-map-leaflet");
            if (!mapElement) {
                setTimeout(initMap, 200);
                return;
            }
            if (mapRef.current) return;

            // Initialize map (Default center: Doha)
            const map = window.L.map(mapElement).setView(defaultCenter, 12);
            mapRef.current = map;

            // Important: call invalidateSize after a short delay to ensure the modal is fully rendered
            setTimeout(() => {
                if (mapRef.current) mapRef.current.invalidateSize();
            }, 500);

            window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);

            const marker = window.L.marker(defaultCenter, {
                draggable: true
            }).addTo(map);
            markerRef.current = marker;

            // MAP INTERACTION (Step 6) - "if user taps any location in map that time also print the lat and lon"
            map.on("click", async (e) => {
                const { lat, lng } = e.latlng;
                const msg = "📍 [MODAL MAP TAP] Tapped Location: Lat " + lat + ", Lon " + lng;
                console.error(msg); // Error level logs are visible in all filters
                console.log(msg);
                window.__LAST_MAP_TAP__ = { lat, lng };
                window.alert(msg);
                const addressData = await getAddressFromLatLng(lat, lng);

                if (addressData) {
                    setFormData(prev => ({
                        ...prev,
                        lat,
                        lng,
                        address: addressData.address,
                        formatted_address: addressData.address,
                        place_id: addressData.place_id
                    }));
                } else {
                    setFormData(prev => ({ ...prev, lat, lng }));
                }

                marker.setLatLng([lat, lng]);
                setFormData(prev => ({ ...prev, lat, lng }));
            });

            marker.on("dragend", async () => {
                const pos = marker.getLatLng();
                const { lat, lng } = pos;
                console.log(`%c📍 [MODAL MARKER DRAG] Location: Lat ${lat}, Lon ${lng}`, "color: white; background: #d97706; padding: 5px; font-weight: bold; border-radius: 4px;");

                const addressData = await getAddressFromLatLng(lat, lng);
                if (addressData) {
                    setFormData(prev => ({
                        ...prev,
                        lat,
                        lng,
                        address: addressData.address,
                        formatted_address: addressData.address,
                        place_id: addressData.place_id
                    }));
                    setSearchQuery(addressData.address);
                } else {
                    setFormData(prev => ({ ...prev, lat, lng }));
                }
            });

            // 4. GEOLOCATION (Step 1) - "when entered print the users current lat and lon"
            const handleGeoSuccess = async (position) => {
                if (!mapRef.current) return; // Safety check

                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // const msg = "✅ [MODAL PAGE ENTRY] User Current Location: Lat " + lat + ", Lon " + lng;
                // console.error(msg);
                // console.log(msg);
                window.__CURRENT_LOCATION__ = { lat, lng };
                // window.alert(msg);

                const pos = [lat, lng];
                try {
                    mapRef.current.setView(pos, 15);
                    markerRef.current.setLatLng(pos);

                    const addressData = await getAddressFromLatLng(lat, lng);
                    if (addressData) {
                        setFormData(prev => ({
                            ...prev,
                            lat,
                            lng,
                            address: addressData.address,
                            formatted_address: addressData.address,
                            place_id: addressData.place_id
                        }));
                        setSearchQuery(addressData.address);
                    } else {
                        setFormData(prev => ({ ...prev, lat, lng }));
                    }
                } catch (e) {
                    console.warn("Could not update map view:", e);
                }
            };

            const handleGeoError = (err) => {
                console.error("⚠️ Geolocation Error:", err.message);
                if (err.code === 1) {
                    alert("Location permission is requested to show your current position. Please enable it in your browser settings.");
                }
            };

            console.log("🛰️ Requesting current location...");
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError, {
                    enableHighAccuracy: true,
                    timeout: 10000
                });
            }
        };

        // Start initialization immediately since Leaflet is in index.html
        initMap();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Fetch Autocomplete Predictions
    useEffect(() => {
        if (!formData.address || formData.address.length < 3) {
            setPredictions([]);
            return;
        }

        const fetchPredictions = () => {
            loadGoogleMaps(() => {
                const service = new window.google.maps.places.AutocompleteService();
                service.getPlacePredictions({ input: formData.address }, (preds, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && preds) {
                        setPredictions(preds);
                    } else {
                        setPredictions([]);
                    }
                });
            });
        };

        const timeout = setTimeout(fetchPredictions, 300);
        return () => clearTimeout(timeout);
    }, [formData.address]);

    const handlePredictionSelect = (p) => {
        setSearchQuery(p.description); // Deprecated but cleanly kept for backup just in case
        setFormData(prev => ({ ...prev, address: p.description }));
        setShowPredictions(false);
        const placeId = p.place_id;

        loadGoogleMaps(() => {
            const dummyNode = document.createElement('div');
            const service = new window.google.maps.places.PlacesService(dummyNode);
            service.getDetails({ placeId: placeId, fields: ['geometry'] }, (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    const formattedAddress = p.description;

                    setFormData(prev => ({
                        ...prev,
                        lat,
                        lng,
                        address: formattedAddress,
                        formatted_address: formattedAddress,
                        place_id: placeId
                    }));

                    // Update Map
                    if (mapRef.current) {
                        mapRef.current.setView([lat, lng], 17);
                        markerRef.current.setLatLng([lat, lng]);
                    }
                } else {
                    console.error("Error resolving place details:", status);
                }
            });
        });
    };

    const getLiveLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const addressData = await getAddressFromLatLng(latitude, longitude);

                if (addressData) {
                    setFormData(prev => ({
                        ...prev,
                        lat: latitude,
                        lng: longitude,
                        address: addressData.address,
                        formatted_address: addressData.address,
                        place_id: addressData.place_id
                    }));
                    setSearchQuery(addressData.address);
                } else {
                    setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
                }

                if (mapRef.current) {
                    mapRef.current.setView([latitude, longitude], 17);
                    markerRef.current.setLatLng([latitude, longitude]);
                }
                setLoading(false);
            },
            (err) => {
                console.error("GPS Error:", err);
                alert("Failed to get live location. Please check your browser permissions.");
                setLoading(false);
            }
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
            if (errors[name]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (!formData.lat || !formData.lng) {
            alert("Please select a location on the map.");
            setLoading(false);
            return;
        }

        if (!formData.phone || formData.phone.replace(/\D/g, "").length < 10) {
            alert("Phone number must be at least 10 digits.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append("name", formData.name || "");
        data.append("name_ar", formData.name_ar || "");
        data.append("email", formData.email || "");
        data.append("password", formData.password || "");
        data.append("password_confirmation", formData.password_confirmation || "");
        data.append("phone", formData.phone || "");
        data.append("description", formData.description || "");
        data.append("plan_id", formData.plan_id.toString());
        data.append("lat", formData.lat);
        data.append("lng", formData.lng);
        data.append("place_id", formData.place_id || "manual_selection");
        data.append("address", formData.address || "");
        data.append("formatted_address", formData.formatted_address || "");

        if (formData.commercial_license) data.append("commercial_license", formData.commercial_license);
        if (formData.establishment_card) data.append("establishment_card", formData.establishment_card);
        if (formData.commercial_registration) data.append("commercial_registration", formData.commercial_registration);
        if (formData.qid_authorized_signatories) data.append("qid_authorized_signatories", formData.qid_authorized_signatories);

        data.append("whatsapp", formData.whatsapp || "");
        data.append("instagram", formData.instagram || "");
        data.append("tweeter", formData.tweeter || "");
        data.append("facebook", formData.facebook || "");
        data.append("youtube", formData.youtube || "");

        // Backend seems to expect these fields even if empty
        if (formData.logo) {
            data.append("logo", formData.logo);
        } else {
            data.append("logo", "");
        }

        if (formData.cover_photo) {
            data.append("cover_photo", formData.cover_photo);
        } else {
            data.append("cover_photo", "");
        }

        try {
            await registerCompany(data);
            alert("Registration message: Registration request received. Check email after approval.");
            onClose();
        } catch (err) {
            console.error("error during registration:", err.response?.data);
            const serverErrors = err.response?.data?.errors || {};
            setErrors(serverErrors);
            const msg = err.response?.data?.message || "Registration failed.";
            const subMsgs = Object.values(serverErrors).flat().join("\n");
            alert(msg + (subMsgs ? "\n" + subMsgs : ""));
        } finally {
            setLoading(false);
        }
    };

return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
        {/* Simple backdrop - just blur, no color overlay */}
        <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />

        {/* Modal - Apple/Stripe style */}
        <div className="relative bg-white w-full max-w-7xl rounded-3xl shadow-2xl max-h-[90vh] flex flex-col mx-auto border border-gray-100">
            {/* Close button - minimal */}
            <button 
                onClick={onClose} 
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition flex items-center justify-center z-20"
            >
                <FaTimes size={18} />
            </button>

            <div className="p-6 sm:p-8 lg:p-10 overflow-y-auto">
                {/* Header - minimal */}
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-3 tracking-tight">Company Registration</h2>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span className="text-xs font-medium text-gray-600">Plan: {planId === 1 ? 'Monthly' : 'Yearly'}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Company Name Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Company name (EN) *"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition ${errors.name ? 'border-red-300 bg-red-50/30' : ''}`}
                                />
                                {errors.name && <p className="text-red-500 text-xs px-3">{errors.name[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    name="name_ar"
                                    placeholder="Company name (AR)"
                                    value={formData.name_ar}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition ${errors.name_ar ? 'border-red-300 bg-red-50/30' : ''}`}
                                />
                                {errors.name_ar && <p className="text-red-500 text-xs px-3">{errors.name_ar[0]}</p>}
                            </div>
                        </div>

                        {/* Email & Phone Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address *"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition ${errors.email ? 'border-red-300 bg-red-50/30' : ''}`}
                                />
                                {errors.email && <p className="text-red-500 text-xs px-3">{errors.email[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <input
                                    type="tel"
                                    name="phone"
                                    maxLength="12"
                                    placeholder="Phone number *"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition ${errors.phone ? 'border-red-300 bg-red-50/30' : ''}`}
                                />
                                {errors.phone && <p className="text-red-500 text-xs px-3">{errors.phone[0]}</p>}
                            </div>
                        </div>

                        {/* Password Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password *"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition ${errors.password ? 'border-red-300 bg-red-50/30' : ''}`}
                                />
                                {errors.password && <p className="text-red-500 text-xs px-3">{errors.password[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    placeholder="Confirm password *"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition ${errors.password_confirmation ? 'border-red-300 bg-red-50/30' : ''}`}
                                />
                                {errors.password_confirmation && <p className="text-red-500 text-xs px-3">{errors.password_confirmation[0]}</p>}
                            </div>
                        </div>

                        {/* Business Location */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-blue-500" size={14} />
                                Business location
                            </h4>
                            
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        id="reg-address-input-google"
                                        type="text"
                                        placeholder="Search or enter address..."
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition"
                                        value={formData.address}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormData(prev => ({
                                                ...prev,
                                                address: val
                                            }));
                                            setSearchQuery(val);
                                            setShowPredictions(true);
                                        }}
                                        onFocus={() => setShowPredictions(true)}
                                    />
                                    {showPredictions && predictions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-[9999]">
                                            {predictions.map((p, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition text-sm text-gray-900 font-medium border-b border-gray-50 last:border-0"
                                                    onMouseDown={(e) => {
                                                        // use onMouseDown instead of onClick to fire before input blur event
                                                        e.preventDefault();
                                                        handlePredictionSelect(p);
                                                    }}
                                                >
                                                    {p.description}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={getLiveLocation}
                                    className="px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition flex items-center justify-center"
                                    title="Get current location"
                                >
                                    <FaSearch size={16} />
                                </button>
                            </div>

                            <div id="reg-map-leaflet" className="w-full h-64 rounded-xl border border-gray-200 overflow-hidden bg-gray-50" />

                            {/* Coordinates - minimal */}
                            <div className="flex gap-4 px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">Lat:</span>
                                    <span className="text-xs font-medium text-gray-700">{formData.lat || '—'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">Lng:</span>
                                    <span className="text-xs font-medium text-gray-700">{formData.lng || '—'}</span>
                                </div>
                            </div>
                            {(errors.lat || errors.lng || errors.place_id) && (
                                <p className="text-red-500 text-xs px-2">Valid location is required</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Documents */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaUpload className="text-blue-500" size={14} />
                                Legal documents
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Commercial License", name: "commercial_license" },
                                    { label: "Establishment Card", name: "establishment_card" },
                                    { label: "Commercial Registration", name: "commercial_registration" },
                                    { label: "QID Authorized Signatories", name: "qid_authorized_signatories" }
                                ].map(doc => (
                                    <div 
                                        key={doc.name} 
                                        className={`relative p-4 rounded-xl border ${errors[doc.name] ? 'border-red-200 bg-red-50/20' : 'border-gray-200 bg-gray-50'} hover:border-gray-300 transition cursor-pointer group`}
                                    >
                                        <input 
                                            type="file" 
                                            name={doc.name} 
                                            onChange={handleFileChange} 
                                            accept="image/*,.pdf" 
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                        />
                                        <div className="flex flex-col items-center text-center">
                                            {formData[doc.name] ? (
                                                <>
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center mb-2">
                                                        <span className="text-white text-xs">✓</span>
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-700 truncate max-w-full">
                                                        {formData[doc.name].name}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center mb-2 group-hover:border-gray-300 transition">
                                                        <FaUpload className="text-gray-300" size={14} />
                                                    </div>
                                                    <span className="text-xs text-gray-500">{doc.label}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Company description</h4>
                            <textarea
                                name="description"
                                placeholder="Tell us about your business... *"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition resize-none ${errors.description ? 'border-red-300 bg-red-50/30' : ''}`}
                            />
                            {errors.description && <p className="text-red-500 text-xs px-3">{errors.description[0]}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl font-medium text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    'Complete registration'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
);
}
