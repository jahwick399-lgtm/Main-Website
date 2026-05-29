import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CursorDot from './components/CursorDot'
import GoldParticles from './components/GoldParticles'
import MeshBackground from './components/MeshBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import ByTheNumbers from './components/ByTheNumbers'
import WhatYouGet from './components/WhatYouGet'
import WhoItsFor from './components/WhoItsFor'
import GetVendors from './components/GetVendors'
import Plans from './components/Plans'
import Reviews from './components/Reviews'
import TrustBadges from './components/TrustBadges'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import PurchaseToast from './components/PurchaseToast'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import Success from './pages/Success'
import Dashboard from './pages/Dashboard'

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-dark text-white overflow-x-hidden font-body">
      <ScrollProgress />
      <MeshBackground />
      <GoldParticles />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <HowItWorks />
        <ByTheNumbers />
        <WhatYouGet />
        <WhoItsFor />
        <GetVendors />
        <Plans />
        <Reviews />
        <TrustBadges />
        <FAQ />
      </main>
      <Footer />
      <PurchaseToast />
      <BackToTop />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CursorDot />
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/success"   element={<Success />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
