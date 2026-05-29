import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getSession } from './utils/auth'
import CursorDot from './components/CursorDot'
import GoldParticles from './components/GoldParticles'
import MeshBackground from './components/MeshBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Plans from './components/Plans'
import HowItWorks from './components/HowItWorks'
import ByTheNumbers from './components/ByTheNumbers'
import WhatYouGet from './components/WhatYouGet'
import WhoItsFor from './components/WhoItsFor'
import Reviews from './components/Reviews'
import TrustBadges from './components/TrustBadges'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import PurchaseToast from './components/PurchaseToast'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
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
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Plans />
        <HowItWorks />
        <ByTheNumbers />
        <WhatYouGet />
        <WhoItsFor />
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
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/success"   element={<Success />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin"     element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
