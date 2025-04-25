import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import LatestProducts from '../components/LatestProducts.jsx'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'


const Home = () => {
  return (
    <div>
     <Hero />
     <LatestProducts/>
     <OurPolicy/>
     <NewsletterBox/>
    </div>
  )
}

export default Home
