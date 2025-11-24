import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { FavouriteProvider } from "./context/FavouriteContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary"; 
import { getGoogleMap } from "./api";

// Import Lenis directly
import Lenis from 'lenis';

// Function to dynamically load Google Maps script
const loadGoogleMaps = (apiKey) => {
  if (!document.getElementById("google-maps")) {
    const script = document.createElement("script");
    script.id = "google-maps";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
};

// Lenis initialization component
const LenisProvider = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      smoothTouch: false,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return children;
};

const Main = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Starting application...');
        
        try {
          const res = await getGoogleMap();
          const apiKey = res.data.apiKey; 
          if (apiKey) {
            loadGoogleMaps(apiKey);
            console.log('✅ Google Maps loaded successfully');
          } else {
            console.warn('⚠️ No Google Maps API key found');
          }
        } catch (mapError) {
          console.warn('⚠️ Failed to load Google Maps:', mapError);
        }
        
        console.log('🎉 Application started successfully!');
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <FavouriteProvider>
            <LenisProvider>
              <App />
            </LenisProvider>
          </FavouriteProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);