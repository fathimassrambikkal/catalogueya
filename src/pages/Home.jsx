import React from "react";

/* Load ALL components immediately */
import Banner from "../components/Banner";
import HomeServices from "../components/HomeServices";
import NewArrivals from "../components/NewArrivals";
import Sales from "../components/Sales";
import Pricing from "../components/Pricing";
import Faq from "../components/Faq";
import CallToAction from "../components/CallToAction";


export default function Home() {
  return (
    <div>
      {/* Everything loads instantly */}
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
