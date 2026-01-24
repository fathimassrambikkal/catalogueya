import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./i18n";
import { useTranslation } from "react-i18next";
import AddToListPopup from "./components/AddToListPopup";
import CustomerRegister from "./pages/CustomerRegister";
import CompanyRegister from "./pages/CompanyRegister";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./store/authSlice";
import { Toaster } from "react-hot-toast";
import { showToast } from "./utils/showToast.jsx";
import { fetchFavourites } from "./store/favouritesSlice";




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
const Chat = React.lazy(() => import("./Customer/Chat"));
const Messages = React.lazy(() => import("./Customer/Messages"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const ProductReviews = React.lazy(() => import("./pages/ProductReviews"));
const MoreDetails = React.lazy(() => import("./dashboard/MoreDetails"));

function AppContent() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

// 1️⃣ AUTH REHYDRATION (MUST BE FIRST)
useEffect(() => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const userType = localStorage.getItem("userType");

  if (token && user && userType) {
    dispatch(
      loginSuccess({
        user: JSON.parse(user),
        userType,
      })
    );
  }
}, [dispatch]);

// 2️⃣ FETCH FAVOURITES (AFTER AUTH EXISTS)
useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    dispatch(fetchFavourites());
  }
}, [dispatch]);




const hideNavbar = [
  "/customer-login/chat",
].some(path => location.pathname.startsWith(path));

const hideFooter = [
  "/sign",
  "/forgot-password",
  "/customer-register",
  "/company-register",
  "/company-forgot-password",
  "/customer-login",
  "/customer-login/chat",
  "/customer-login/messages",
  "/company-dashboard",
].some(path => location.pathname.startsWith(path));

const isChatRoute = location.pathname.startsWith("/customer-login/chat");



useEffect(() => {
  window.alert = (message) => {
    const isRTL = document.documentElement.dir === "rtl";
    showToast(message, { rtl: isRTL });
  };
}, []);


  return (
    <div className="flex flex-col min-h-screen bg-white">
         {/* global  TOAST CONTAINER */}
    <Toaster
  position="top-center"
  toastOptions={{
    //  disable default styles
    style: {
      background: "transparent",
      boxShadow: "none",
      padding: 0,
    },
  }}
/>


       {!hideNavbar && <Navbar />}

       
      <Scroll />

<main
  className={`flex-grow ${
    isChatRoute
      ? "h-screen overflow-hidden"
      : "pt-10"
  }`}
>



        {/* ⭐ FIXED — No more footer flash, no white gap */}
        <Suspense fallback={null}>
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sign" element={<Sign />} />

            <Route path="/customer-login/chat/:conversationId" element={<Chat />} />


            <Route path="/customer-login/messages" element={<Messages />} />

            <Route path="/favourite" element={<Favourite />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/customer-register" element={<CustomerRegister />} />
            <Route path="/company-register" element={<CompanyRegister />} />

            <Route path="/company-dashboard" element={<CompanyDashboard />} />
           <Route
  path="/dashboard/products/:id"
  element={<MoreDetails />}
/>


            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/company-forgot-password" element={<CompanyForgotPassword />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />


            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/category/:categoryId/company/:companyId" element={<CompanyPage />} />
            <Route path="/company/:companyId" element={<CompanyPage />} />

            <Route path="/category/:categoryId/company/:companyId/product/:id" element={<ProductProfile />} />
            <Route path="/company/:companyId/product/:id" element={<ProductProfile />} />
            <Route path="/product/:id" element={<ProductProfile />} />
            <Route path="/product/:productId/reviews" element={<ProductReviews />} />

            <Route path="/company/:companyId/reviews" element={<CompanyReviewsPage />} />

            <Route path="/salesproducts" element={<SalesProductPage />} />
            <Route path="/salesproduct/:id" element={<SalesProductProfile />} />

            <Route path="/newarrivalproducts" element={<NewArrivalProductPage />} />
            <Route path="/newarrivalprofile/:id" element={<NewArrivalProductProfile />} />

          </Routes>
        </Suspense>

      </main>
      <AddToListPopup /> 
      {!hideFooter && <Footer />}

    </div>
  );
}

export default function App() {
  return <AppContent />;
}
