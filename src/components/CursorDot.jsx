import { useEffect, useState } from 'react'

export default function CursorDot() {
  const [pos, setPos]       = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove  = e => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true) }
    const onLeave = () => setVisible(false)
    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      className="fixed pointer-events-none z-[9999] hidden md:block"
      style={{
        left: pos.x,
        top: pos.y,
        width: 10,
        height: 10,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(255,215,0,0.85)',
        opacity: visible ? 1 : 0,
        transition: 'left 0.1s ease-out, top 0.1s ease-out, opacity 0.3s',
        boxShadow: '0 0 10px rgba(255,215,0,0.7), 0 0 20px rgba(255,215,0,0.3)',
        mixBlendMode: 'screen',
      }}
    />
  )
}
