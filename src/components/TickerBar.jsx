import { useState, useEffect } from 'react'

function LiveCounter() {
  const [count, setCount] = useState(74)
  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => Math.min(98, Math.max(54, c + Math.floor(Math.random() * 5) - 2)))
    }, 3800)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: '#FFD700' }} />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: '#FFD700', boxShadow: '0 0 6px rgba(255,215,0,0.9)' }} />
      </span>
      <span className="font-body text-[11px] font-bold text-white/80 whitespace-nowrap">
        {count} LIVE
      </span>
    </div>
  )
}

export default function TickerBar() {
  return (
    <div
      className="fixed left-0 right-0 z-40 h-9 flex items-center justify-between px-4"
      style={{ top: 64, background: 'rgba(8,6,14,0.97)', borderBottom: '1px solid rgba(255,215,0,0.18)' }}
    >
      <span className="font-body text-[11px] text-white/50 whitespace-nowrap">
        ⭐ Rated <span className="text-white/80 font-bold">5.0</span> by 1,000+ resellers
      </span>
      <LiveCounter />
    </div>
  )
}
