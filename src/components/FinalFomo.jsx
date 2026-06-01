export default function FinalFomo() {
  return (
    <section className="py-16 px-4">
      <div
        className="max-w-lg mx-auto rounded-2xl p-8 text-center"
        style={{
          background: 'rgba(12,8,20,0.96)',
          border: '1px solid rgba(255,215,0,0.3)',
          boxShadow: '0 0 60px rgba(255,215,0,0.1)',
        }}
      >
        <div className="text-3xl mb-4">🚨</div>
        <h2 className="font-display text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' }}>
          REAL TALK
        </h2>
        <p className="text-white/55 font-body text-sm leading-relaxed mb-4">
          "Most people will see this, think about it, close the tab, and keep making nothing.
          The ones who actually join are the ones eating right now."
        </p>
        <p className="text-white/55 font-body text-sm leading-relaxed mb-8">
          "Don't be the person who finds this in a year and wishes they started today."
        </p>
        <a
          href="#plans"
          className="btn-gold rounded-full font-body font-bold text-base text-dark w-full text-center inline-block"
          style={{ padding: '16px 24px', minHeight: 52 }}
        >
          I'M READY — LET'S GO →
        </a>
      </div>
    </section>
  )
}
