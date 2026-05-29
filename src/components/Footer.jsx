import { motion } from 'framer-motion'

const VENDORS_URL = 'https://vendor-website-two.vercel.app/?canceled=true#vendors'

const NAV_LINKS = [
  { label: 'Plans',   href: '#plans' },
  { label: 'Vendors', href: VENDORS_URL, external: true },
  { label: 'FAQ',     href: '#faq' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t py-12 px-5" style={{ borderColor: 'rgba(255,215,0,0.08)' }}>
      {/* Ambient orb */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 600, height: 200,
          background: 'radial-gradient(ellipse, rgba(255,215,0,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-dark font-display text-base"
              style={{ background: 'linear-gradient(135deg,#FFE566,#FFD700,#FFA500)', boxShadow: '0 0 12px rgba(255,215,0,0.4)' }}
            >
              R
            </div>
            <span className="font-display text-xl tracking-wider">
              <span className="gold-text">FLIP</span>
              <span className="text-white"> LABS</span>
            </span>
          </motion.a>

          {/* Nav links */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-6"
          >
            {NAV_LINKS.map((l, i) => (
              <a
                key={i}
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
                className="relative text-white/40 hover:text-white/70 text-sm font-body transition-colors group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </motion.nav>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/20 font-body text-xs"
          >
            © {year} Flip Labs. All rights reserved.
          </motion.p>
        </div>

        <div className="gold-divider mt-8 mb-6 opacity-30" />

        <p className="text-center text-white/15 font-body text-xs leading-relaxed max-w-xl mx-auto">
          Flip Labs provides educational content and vendor information for informational purposes only. Results vary. We do not guarantee income or profit.
        </p>
      </div>
    </footer>
  )
}
