import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux"; 
import { store } from "./store";



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
      smoothWheel: true,
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
    const init = async () => {
      try {
        const res = await getGoogleMap();
        if (res?.data?.apiKey) {
          loadGoogleMaps(res.data.apiKey);
        }
      } catch {}
    };
    init();
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}> {/* REDUX WRAPPER */}
        <HashRouter>
          
          
              <FollowersProvider>
                <LenisProvider>
                  <App />
                </LenisProvider>
              </FollowersProvider>
           
          
        </HashRouter>
      </Provider>
    </ErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
