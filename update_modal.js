const fs = require('fs');

const FILE_PATH = '/Volumes/tridelMac/Projects/Ganapathi/cataloguyea/web_v1/catalogueya/src/components/auth/CompanyRegisterModal.jsx';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// We will export a helper to forcefully inject Google Maps with the hardcoded API key if it's missing.

const replacement = `
export const injectGoogleMapsIfNeeded = () => {
    return new Promise((resolve) => {
        if (window.google && window.google.maps && window.google.maps.places) {
            resolve(true);
            return;
        }
        
        if (document.getElementById("google-maps-hardcoded")) {
            // Script already injecting, we wait...
            const check = setInterval(() => {
                if (window.google && window.google.maps && window.google.maps.places) {
                    clearInterval(check);
                    resolve(true);
                }
            }, 500);
            return;
        }

        const API_KEY = "AIzaSyCPaRykDl0CWuNR-9GjN0lhJrzhKoew9p8";
        const script = document.createElement("script");
        script.id = "google-maps-hardcoded";
        script.src = \`https://maps.googleapis.com/maps/api/js?key=\${API_KEY}&libraries=places\`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export async function getAddressFromLatLng(lat, lng) {
    await injectGoogleMapsIfNeeded();
    if (!window.google || !window.google.maps) {
        console.error("Google Maps API not loaded");
        return null;
    }

    return new Promise((resolve) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, async (results, status) => {
            if (status === "OK" && results && results.length > 0) {
                const firstResult = results[0];
                const placeId = firstResult.place_id;

                console.log(\`📍 [Places API] Found Place ID: \${placeId} (\${firstResult.formatted_address})\`);

                // Fetch detailed/formatted address from backend enrichment API
                try {
                    const details = await getGoogleMap(placeId);
                    const respData = details.data;
                    console.log("🔍 [Backend Enrichment] Response data:", respData);

                    if (respData?.data) {
                        const enriched = respData.data;
                        let finalAddress = "";

                        if (enriched.address && typeof enriched.address === 'object') {
                            finalAddress = enriched.address.formatted || enriched.address.line1 || firstResult.formatted_address;
                        } else if (typeof enriched.address === 'string') {
                            finalAddress = enriched.address;
                        } else {
                            finalAddress = firstResult.formatted_address;
                        }

                        resolve({
                            address: String(finalAddress),
                            place_id: placeId,
                            raw: enriched
                        });
                        return;
                    }
                } catch (err) {
                    console.warn("⚠️ Backend enrichment failed, using Places API fallback:", err);
                }

                resolve({
                    address: String(firstResult.formatted_address),
                    place_id: placeId,
                    raw: firstResult
                });
            } else {
                console.error("Places Search failed:", status);
                resolve(null);
            }
        });
    });
}
`;

// Replace from export async function getAddressFromLatLng... down to the end of it.
content = content.replace(/export async function getAddressFromLatLng[\s\S]*?^}/m, replacement.trim());


// Now fix fetchPredictions
const fetchPredictionsReplace = `
        const fetchPredictions = async () => {
            await injectGoogleMapsIfNeeded();
            if (!window.google || !window.google.maps || !window.google.maps.places) return;
            const service = new window.google.maps.places.AutocompleteService();
            service.getPlacePredictions({ input: formData.address }, (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setPredictions(predictions);
                } else {
                    setPredictions([]);
                }
            });
        };
`;

content = content.replace(/const fetchPredictions = \(\) => {[\s\S]*?};/, fetchPredictionsReplace.trim());

// Now fix handlePredictionSelect
const handlePredictionSelectReplace = `
    const handlePredictionSelect = async (p) => {
        setSearchQuery(p.description); // Deprecated but cleanly kept for backup just in case
        setFormData(prev => ({ ...prev, address: p.description }));
        setShowPredictions(false);
        const placeId = p.place_id;

        await injectGoogleMapsIfNeeded();
        if (!window.google || !window.google.maps || !window.google.maps.places) return;

        try {
            const dummyEl = document.createElement("div");
            const service = new window.google.maps.places.PlacesService(dummyEl);
            service.getDetails({ placeId: placeId, fields: ["geometry", "formatted_address"] }, (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
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
                        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
                    }
                }
            });
        } catch (err) {
            console.error("Error resolving place details:", err);
        }
    };
`;

content = content.replace(/const handlePredictionSelect = \(p\) => {[\s\S]*?    };/m, handlePredictionSelectReplace.trim());

fs.writeFileSync(FILE_PATH, content);
console.log("Updated API calls!");
