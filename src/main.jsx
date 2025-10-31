import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { FavouriteProvider } from "./context/FavouriteContext";
import ErrorBoundary from "./components/ErrorBoundary"; // ✅ import it

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <FavouriteProvider>
          <App />
        </FavouriteProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
