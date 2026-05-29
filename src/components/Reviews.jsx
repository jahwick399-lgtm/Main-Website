import { motion } from 'framer-motion'

const REVIEWS = [
  { name: 'Marcus W.',   initials: 'MW', text: "Vendor lowkey crazy, made 3k my first couple weeks 😭" },
  { name: 'Jaylen T.',  initials: 'JT', text: "Been using this vendor for a minute now and results been wild" },
  { name: 'Tre B.',     initials: 'TB', text: "Got the vendor and already made my money back fast" },
  { name: 'Devon A.',   initials: 'DA', text: "I ain't even expect this to work that good ngl" },
  { name: 'Jordan C.',  initials: 'JC', text: "Copped the iPhone vendor and flipped my first order quick" },
  { name: 'Malik R.',   initials: 'MR', text: "Thought people was overhyping it till I tried it myself 😂" },
  { name: 'Andre S.',   initials: 'AS', text: "I've been eating off these vendors for a while now" },
  { name: 'Chris L.',   initials: 'CL', text: "I only started wit $50 and kept running it up" },
  { name: 'Darius F.',  initials: 'DF', text: "Wish I found this sooner ngl" },
  { name: 'Zach P.',    initials: 'ZP', text: "First week using it and I already seen progress" },
  { name: 'Brandon H.', initials: 'BH', text: "Almost ain't buy it but I'm glad I did" },
  { name: 'Kevin M.',   initials: 'KM', text: "My bro put me onto this sh** works wonders 😭" },
  { name: 'Tyler J.',   initials: 'TJ', text: "Been consistent with it and it's been paying off ngl" },
  { name: 'Isaiah N.',  initials: 'IN', text: "I was skeptical at first but I see why people talk about it now 😂" },
  { name: 'Cam E.',     initials: 'CE', text: "Lowkey one of the best investments I've made this year" },
]

const AVATAR_COLORS = [
  'linear-gradient(135deg,#FFD700,#FFA500)',
  'linear-gradient(135deg,#c084fc,#7c3aed)',
  'linear-gradient(135deg,#34d399,#059669)',
  'linear-gradient(135deg,#f472b6,#db2777)',
  'linear-gradient(135deg,#60a5fa,#2563eb)',
]

function ReviewCard({ review, idx }) {
  return (
    <div
      className="review-card flex-shrink-0 rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
      style={{
        width: 'clamp(260px, 80vw, 320px)',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,215,0,0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxSizing: 'border-box',
      }}
    >
      {/* Stars */}
      <div className="flex gap-0.5 flex-shrink-0">
        {[0,1,2,3,4].map(i => (
          <span key={i} className="gold-star text-sm leading-none">★</span>
        ))}
      </div>

      {/* Review text */}
      <p
        className="font-body text-sm text-white/70 leading-relaxed flex-1"
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
        }}
      >
        "{review.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-2.5 flex-shrink-0 mt-auto">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-dark font-display text-xs flex-shrink-0"
          style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
        >
          {review.initials}
        </div>
        <div className="min-w-0">
          <div
            className="text-white/80 font-body text-xs font-semibold leading-tight"
            style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {review.name}
          </div>
          <div className="text-white/30 font-body text-xs">Verified Member</div>
        </div>
      </div>
    </div>
  )
}

export default function Reviews() {
  const doubled = [...REVIEWS, ...REVIEWS]

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="text-center px-5 mb-10 sm:mb-12"
      >
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-widest uppercase mb-4"
          style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}
        >
          Member Reviews
        </span>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-3">
          <span className="text-white">Real People,</span>{' '}
          <span className="gold-text">Real Results</span>
        </h2>
        <p className="text-white/45 font-body text-sm sm:text-base max-w-sm mx-auto">
          Over 2,400 members. Here's what they're saying.
        </p>
      </motion.div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-4 overflow-hidden">
        <div className="review-track-left flex gap-4 w-max">
          {doubled.map((r, i) => <ReviewCard key={i} review={r} idx={i} />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10" style={{ background: 'linear-gradient(to right,#080808,transparent)' }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10" style={{ background: 'linear-gradient(to left,#080808,transparent)' }} />
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative overflow-hidden">
        <div className="review-track-right flex gap-4 w-max">
          {doubled.map((r, i) => <ReviewCard key={i} review={r} idx={i + 7} />)}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10" style={{ background: 'linear-gradient(to right,#080808,transparent)' }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10" style={{ background: 'linear-gradient(to left,#080808,transparent)' }} />
      </div>
    </section>
  )
}
