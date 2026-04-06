import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import WhyUs from './components/WhyUs'
import HowItWorks from './components/HowItWorks'
import Results from './components/Results'
import Pricing from './components/ui/pricing-section'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import BookPage from './pages/BookPage'
import ThankYouPage from './pages/ThankYouPage'
import './App.css'

function HomePage() {
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
      <Footer />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/book" element={<BookPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
    </Routes>
  )
}

export default App
