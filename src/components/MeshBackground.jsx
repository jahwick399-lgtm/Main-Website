export default function MeshBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="mesh-bg absolute inset-0" />
      <div
        className="mesh-orb absolute rounded-full"
        style={{
          width: 700, height: 700,
          top: '-15%', left: '30%',
          background: 'radial-gradient(circle, rgba(88,28,135,0.22) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animation: 'meshShift 18s ease-in-out infinite alternate',
        }}
      />
      <div
        className="mesh-orb absolute rounded-full"
        style={{
          width: 500, height: 500,
          bottom: '10%', right: '-5%',
          background: 'radial-gradient(circle, rgba(63,0,100,0.18) 0%, transparent 65%)',
          filter: 'blur(70px)',
          animation: 'meshShift 22s ease-in-out infinite alternate-reverse',
        }}
      />
      <div
        className="mesh-orb absolute rounded-full"
        style={{
          width: 400, height: 300,
          top: '50%', left: '-5%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 65%)',
          filter: 'blur(50px)',
          animation: 'meshShift 26s ease-in-out infinite alternate',
        }}
      />
    </div>
  )
}
