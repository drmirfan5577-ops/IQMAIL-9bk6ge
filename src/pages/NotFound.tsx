import { useNavigate } from 'react-router-dom';
import BismillahHeader from '@/components/layout/BismillahHeader';
import LiveBackground from '@/components/features/LiveBackground';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen" style={{ background: 'rgb(5,7,15)' }}>
      <LiveBackground />
      <BismillahHeader />
      <div className="relative z-10 flex min-h-[calc(100vh-38px)] flex-col items-center justify-center text-center px-4">
        <div className="font-orbitron text-8xl font-black mb-4" style={{ color: '#f72585', textShadow: '0 0 40px #f7258588' }}>404</div>
        <div className="font-orbitron text-xl font-bold text-white mb-2">Page Not Found</div>
        <p className="text-white/30 text-sm mb-8">This digital route doesn't exist in the IQMailverse.</p>
        <button onClick={() => navigate('/')}
          className="px-8 py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #00f0ff, #0080ff)', color: '#050710' }}>
          ← Return Home
        </button>
        <p className="text-white/20 text-xs mt-8 tracking-widest">IQMAIL · iqmail.online</p>
      </div>
    </div>
  );
}
