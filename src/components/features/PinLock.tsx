import { useState } from 'react';
import { Lock } from 'lucide-react';

interface Props {
  correctPin: string;
  onUnlock: () => void;
}

export default function PinLock({ correctPin, onUnlock }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (d: string) => {
    const next = (input + d).slice(0, 4);
    setInput(next);
    setError(false);
    if (next.length === 4) {
      if (next === correctPin) { onUnlock(); }
      else { setError(true); setTimeout(() => { setInput(''); setError(false); }, 800); }
    }
  };

  const digits = ['1','2','3','4','5','6','7','8','9','*','0','⌫'];

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f72585, #7b2fff)' }}>
        <Lock size={22} className="text-white" />
      </div>
      <div>
        <h3 className="text-white font-semibold text-center mb-1">PIN Protected</h3>
        <p className="text-white/40 text-xs text-center">Enter 4-digit PIN to unlock</p>
      </div>

      {/* PIN dots */}
      <div className="flex gap-4">
        {[0,1,2,3].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${i < input.length ? (error ? 'bg-red-500 border-red-500' : 'border-pink-500') : 'border-white/20'}`}
            style={i < input.length && !error ? { background: '#f72585', boxShadow: '0 0 10px #f7258588' } : {}} />
        ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3">
        {digits.map(d => (
          <button key={d} onClick={() => d === '⌫' ? setInput(p => p.slice(0,-1)) : d !== '*' ? handleDigit(d) : null}
            className={`w-16 h-16 rounded-2xl text-white font-bold text-xl flex items-center justify-center transition-all active:scale-90 hover:scale-105 ${d === '*' ? 'opacity-0 pointer-events-none' : ''}`}
            style={{ background: d === '⌫' ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
