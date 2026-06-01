export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative py-10 px-5"
      style={{ borderTop: '1px solid rgba(255,215,0,0.15)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center sm:text-left">
          {/* Left: Brand */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-display text-2xl tracking-wider">
              <span className="gold-text">FLIP</span>
              <span className="text-white"> LABS</span>
            </span>
          </div>

          {/* Center: tagline */}
          <div className="flex items-center justify-center">
            <p className="text-white/50 font-body text-sm">Built for resellers. By resellers.</p>
          </div>

          {/* Right: copyright */}
          <div className="flex items-center justify-center sm:justify-end">
            <p className="text-white/25 font-body text-xs">© {year}. All rights reserved.</p>
          </div>
        </div>

        <div className="gold-divider mt-8 mb-5 opacity-20" />

        <p className="text-center text-white/15 font-body text-xs leading-relaxed max-w-xl mx-auto">
          Flip Labs provides educational content and vendor information for informational purposes only. Results vary. We do not guarantee income or profit.
        </p>
      </div>
    </footer>
  )
}
