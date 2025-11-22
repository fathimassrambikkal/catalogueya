import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./i18n";
import { useTranslation } from "react-i18next";
import CustomerLogin from "./pages/CustomerLogin";
// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Scroll from "./components/Scroll";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Sign from "./pages/Sign";
import Favourite from "./pages/Favourite";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import CompanyLogin from "./pages/Companylogin";
import CompanyForgotPassword from "./pages/CompanyForgotPassword";
import PricingPage from "./pages/PricingPage";
import CompanyDashboard from "./pages/CompanyDashboard";

// Category + Product + Company
import CategoryPage from "./pages/CategoryPage";
import CompanyPage from "./pages/CompanyPage";
import ProductProfile from "./pages/ProductProfile";
import CompanyReviewsPage from "./pages/CompanyReviewsPage";

// Sales
import SalesProductPage from "./pages/SalesProductPage";
import SalesProductProfile from "./pages/SalesProductProfile";

// New Arrival
import NewArrivalProductPage from "./pages/NewArrivalProductPage";
import NewArrivalProductProfile from "./pages/NewArrivalProductProfile";

function AppContent() {
  const location = useLocation();
  const { i18n } = useTranslation();

  // Set direction (RTL/LTR)
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const hideLayoutPaths = [
    "/sign",
    "/forgot-password",
    "/register",
    "/company-login",
    "/company-forgot-password",
    "/company-dashboard",
    "/customer-dashboard", // Use this single route for all customer pages
  ];

  const hideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {!hideLayout && <Navbar />}
      <Scroll />
      <main className="flex-grow">
        <Routes>
          {/* Main */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="/favourite" element={<Favourite />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/company-login" element={<CompanyLogin />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/customer-login" element={<CustomerLogin />} /> {/* Single customer dashboard route */}
          <Route
            path="/company-forgot-password"
            element={<CompanyForgotPassword />}
          />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Category + Company + Product */}
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route
            path="/category/:categoryId/company/:companyId"
            element={<CompanyPage />}
          />
          {/* ADDED: Direct company route */}
          <Route path="/company/:companyId" element={<CompanyPage />} />
          <Route
            path="/category/:categoryId/company/:companyId/product/:id"
            element={<ProductProfile />}
          />
          {/* ADDED: Direct company product route */}
          <Route
            path="/company/:companyId/product/:id"
            element={<ProductProfile />}
          />

          {/* Reviews */}
          <Route
            path="/category/:categoryId/company/:companyId/reviews"
            element={<CompanyReviewsPage />}
          />
          {/* ADDED: Direct company reviews route */}
          <Route
            path="/company/:companyId/reviews"
            element={<CompanyReviewsPage />}
          />

          {/* Sales */}
          <Route path="/salesproducts" element={<SalesProductPage />} />
          <Route path="/salesproduct/:id" element={<SalesProductProfile />} />

          {/* New Arrival */}
          <Route
            path="/newarrivalproducts"
            element={<NewArrivalProductPage />}
          />
          <Route
            path="/newarrivalprofile/:id"
            element={<NewArrivalProductProfile />}
          />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}