import React from 'react'
import Banner from '../components/Banner'
import HomeServices from '../components/HomeServices'

import Faq from '../components/Faq'
import Sales from '../components/Sales'
import NewArrivals from '../components/NewArrivals'
import Pricing from '../components/Pricing'
import CallToAction from '../components/CallToAction'

function Home() {
  return (
    <>
    <Banner/>
    <HomeServices/>
    <NewArrivals/>
   <Sales/>
   <Pricing/>
   <Faq/>
   <CallToAction/>
    </>
  )
}

export default Home