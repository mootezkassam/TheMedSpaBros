import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import WhyUs from './components/WhyUs'
import HowItWorks from './components/HowItWorks'
import Results from './components/Results'
import Pricing from './components/ui/pricing-section'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Problem />
      <WhyUs />
      <HowItWorks />
      <Results />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </>
  )
}

export default App
