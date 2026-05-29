import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el   = document.documentElement
      const max  = el.scrollHeight - el.clientHeight
      setPct(max > 0 ? (el.scrollTop / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-0.5 pointer-events-none">
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(to right,#FFE566,#FFD700,#FFA500)',
          boxShadow: '0 0 8px rgba(255,215,0,0.8)',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  )
}
