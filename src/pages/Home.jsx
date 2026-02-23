import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* Load ALL components immediately */
import Banner from "../components/Banner";
import HomeServices from "../components/HomeServices";
import NewArrivals from "../components/NewArrivals";
import Sales from "../components/Sales";
import Pricing from "../components/Pricing";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === "pricing") {
      const section = document.getElementById("pricing");
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div>
      <Banner />
      <HomeServices />
      <NewArrivals />
      <Sales />
      <Pricing />
      <Faq />
      <CallToAction />
    </div>
  );
}