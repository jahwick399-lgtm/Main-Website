export default function TheNextLevel() {
  return (
    <section className="py-16 px-4">
      <div
        className="max-w-2xl mx-auto rounded-2xl p-8 sm:p-10"
        style={{
          background: 'rgba(12,8,20,0.96)',
          border: '1px solid rgba(255,215,0,0.35)',
          boxShadow: '0 0 60px rgba(255,215,0,0.1), 0 0 120px rgba(255,215,0,0.04)',
        }}
      >
        <div className="gold-divider mb-8" />

        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🏭</div>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
            Don't Just Resell.<br />
            <span className="gold-text">Become The Source.</span>
          </h2>
          <p className="text-white/45 font-body text-sm leading-relaxed max-w-md mx-auto">
            Learn how to go from buyer to supplier. Build your own vendor operation and sell access to other resellers.
          </p>
        </div>

        <ul className="space-y-3 mb-8 max-w-sm mx-auto">
          {[
            'Source products directly from manufacturers',
            'Build your own supplier catalog',
            'Sell vendor access like this platform does',
          ].map(item => (
            <li key={item} className="flex items-start gap-3 text-white/65 font-body text-sm">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)' }}>
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3l2 2 4-4" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full font-body text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.35)', color: '#FFD700' }}>
            Available for Paid Members Only
          </span>
        </div>

        <a
          href="#plans"
          className="btn-gold rounded-full font-body font-bold text-dark text-sm w-full text-center block"
          style={{ padding: '16px 24px', minHeight: 52 }}
        >
          UNLOCK THE SUPPLIER PROGRAM →
        </a>
      </div>
    </section>
  )
}
