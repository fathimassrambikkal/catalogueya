import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./i18n";
import { useTranslation } from "react-i18next";



/* Critical components */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Scroll from "./components/Scroll";
import Home from "./pages/Home";

/* Lazy pages */
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Sign = React.lazy(() => import("./pages/Sign"));
const Favourite = React.lazy(() => import("./pages/Favourite"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const Register = React.lazy(() => import("./pages/Register"));
const CustomerLogin = React.lazy(() => import("./pages/CustomerLogin"));
const CompanyForgotPassword = React.lazy(() => import("./pages/CompanyForgotPassword"));
const CompanyDashboard = React.lazy(() => import("./pages/CompanyDashboard"));
const CategoryPage = React.lazy(() => import("./pages/CategoryPage"));
const CompanyPage = React.lazy(() => import("./pages/CompanyPage"));
const ProductProfile = React.lazy(() => import("./pages/ProductProfile"));
const CompanyReviewsPage = React.lazy(() => import("./pages/CompanyReviewsPage"));
const SalesProductPage = React.lazy(() => import("./pages/SalesProductPage"));
const SalesProductProfile = React.lazy(() => import("./pages/SalesProductProfile"));
const NewArrivalProductPage = React.lazy(() => import("./pages/NewArrivalProductPage"));
const NewArrivalProductProfile = React.lazy(() => import("./pages/NewArrivalProductProfile"));
const Terms = React.lazy(() => import("./pages/Terms"));

function AppContent() {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const hideLayoutPaths = [
    "/sign",
    "/forgot-password",
    "/register",
    "/company-forgot-password",
    "/company-dashboard",
    "/customer-login",
  ];

  const hideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {!hideLayout && <Navbar />}
      <Scroll />

      <main className="flex-grow">

        {/* ⭐ FIXED — No more footer flash, no white gap */}
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="loader" />
          </div>
        }>
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/favourite" element={<Favourite />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/company-forgot-password" element={<CompanyForgotPassword />} />
            <Route path="/terms" element={<Terms />} />


            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/category/:categoryId/company/:companyId" element={<CompanyPage />} />
            <Route path="/company/:companyId" element={<CompanyPage />} />

            <Route path="/category/:categoryId/company/:companyId/product/:id" element={<ProductProfile />} />
            <Route path="/company/:companyId/product/:id" element={<ProductProfile />} />
            <Route path="/product/:id" element={<ProductProfile />} />

            <Route path="/company/:companyId/reviews" element={<CompanyReviewsPage />} />

            <Route path="/salesproducts" element={<SalesProductPage />} />
            <Route path="/salesproduct/:id" element={<SalesProductProfile />} />

            <Route path="/newarrivalproducts" element={<NewArrivalProductPage />} />
            <Route path="/newarrivalprofile/:id" element={<NewArrivalProductProfile />} />

          </Routes>
        </Suspense>

      </main>

      {!hideLayout && <Footer />}

    </div>
  );
}

export default function App() {
  return <AppContent />;
}
