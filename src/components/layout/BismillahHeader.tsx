export default function BismillahHeader() {
  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        height: '38px',
        background: 'linear-gradient(90deg, #ff0080, #ff4d00, #ffd700, #00ff88, #00c8ff, #8000ff, #ff0080)',
        backgroundSize: '300% 100%',
        animation: 'gradientShift 4s ease infinite',
      }}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
          animation: 'gradientShift 3s ease-in-out infinite',
        }}
      />
      <div className="relative h-full flex items-center justify-center gap-3">
        <span className="text-white/70 text-xs animate-pulse">✦</span>
        <span
          className="text-white font-bold tracking-wide"
          style={{
            fontSize: '15px',
            fontFamily: '"Traditional Arabic", "Scheherazade New", "Noto Naskh Arabic", serif',
            direction: 'rtl',
            textShadow: '0 0 8px rgba(255,255,255,0.6), 0 1px 3px rgba(0,0,0,0.4)',
            letterSpacing: '0.05em',
          }}
        >
          بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِيْمِ
        </span>
        <span className="text-white/70 text-xs animate-pulse">✦</span>
      </div>
    </div>
  );
}
