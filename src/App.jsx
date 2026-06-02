import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getSession, migrateOldUsers, checkAndExpireSubscriptions } from './auth'
import CursorDot from './components/CursorDot'
import GoldParticles from './components/GoldParticles'
import MeshBackground from './components/MeshBackground'
import Navbar from './components/Navbar'
import TickerBar from './components/TickerBar'
import Hero from './components/Hero'
import FomoSection from './components/FomoSection'
import Plans from './components/Plans'
import WhatYouGet from './components/WhatYouGet'
import HowItWorks from './components/HowItWorks'
import ByTheNumbers from './components/ByTheNumbers'
import WhoItsFor from './components/WhoItsFor'
import FinalFomo from './components/FinalFomo'
import Reviews from './components/Reviews'
import TrustBadges from './components/TrustBadges'
import FAQ from './components/FAQ'
import TheNextLevel from './components/TheNextLevel'
import Footer from './components/Footer'
import PurchaseToast from './components/PurchaseToast'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import StickyBar from './components/StickyBar'
import Success from './pages/Success'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Admin from './pages/Admin'

function ProtectedRoute({ children, requireAdmin = false }) {
  const session = getSession()
  if (!session) return <Navigate to="/login" replace />
  if (requireAdmin && session.tier !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-dark text-white overflow-x-hidden font-body">
      <ScrollProgress />
      <MeshBackground />
      <GoldParticles />
      <TickerBar />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <FomoSection />
        <Plans />
        <WhatYouGet />
        <HowItWorks />
        <ByTheNumbers />
        <WhoItsFor />
        <FinalFomo />
        <Reviews />
        <TrustBadges />
        <FAQ />
        <TheNextLevel />
      </main>
      <Footer />
      <PurchaseToast />
      <BackToTop />
      <StickyBar />
    </div>
  )
}

export default function App() {
  useEffect(() => {
    migrateOldUsers()
    checkAndExpireSubscriptions()
    const interval = setInterval(checkAndExpireSubscriptions, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <BrowserRouter>
      <CursorDot />
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/success"   element={<Success />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin"     element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
