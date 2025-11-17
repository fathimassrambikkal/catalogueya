import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { FavouriteProvider } from "./context/FavouriteContext";
import ErrorBoundary from "./components/ErrorBoundary"; 
import { getGoogleMap } from "./api"; 

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_PUBLIC_DSN",
});

// Function to dynamically load Google Maps script
const loadGoogleMaps = (apiKey) => {
  if (!document.getElementById("google-maps")) {
    const script = document.createElement("script");
    script.id = "google-maps";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
};

const Main = () => {
  useEffect(() => {
    // Fetch Google Maps API key from your backend
    getGoogleMap()
      .then((res) => {
        const apiKey = res.data.apiKey; 
        loadGoogleMaps(apiKey);
      })
      .catch((err) => {
        console.error("Failed to load Google Maps API key:", err);
      });
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <FavouriteProvider>
          <App />
        </FavouriteProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
