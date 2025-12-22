import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter } from "react-router-dom"; // CHANGED: BrowserRouter → HashRouter
import { FavouriteProvider } from "./context/FavouriteContext";
import { FollowingProvider } from "./context/FollowingContext";
import { FollowersProvider } from "./context/FollowersContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { getGoogleMap } from "./api";
import Lenis from "lenis";

/* Load Google Maps Script */
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

/* Lenis Smooth Scroll */
const LenisProvider = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      smoothTouch: false,
      infinite: false,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return children;
};

/* Main App Wrapper */
const Main = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const res = await getGoogleMap();
        const apiKey = res?.data?.apiKey;
        if (apiKey) loadGoogleMaps(apiKey);
      } catch {}
    };

    initializeApp();
  }, []);

  return (
    <ErrorBoundary>
      <HashRouter> {/* CHANGED: BrowserRouter → HashRouter */}
        <FavouriteProvider>
          <FollowingProvider>
            <FollowersProvider>
              <LenisProvider>
                <App />
              </LenisProvider>
            </FollowersProvider>
          </FollowingProvider>
        </FavouriteProvider>
      </HashRouter> {/* CHANGED: BrowserRouter → HashRouter */}
    </ErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);