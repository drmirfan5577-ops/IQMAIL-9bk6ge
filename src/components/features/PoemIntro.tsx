import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveBackground from './LiveBackground';
import BismillahHeader from '@/components/layout/BismillahHeader';

interface PoemLine {
  text: string;
  color: string;
  direction: string;
  italic?: boolean;
  bold?: boolean;
  size?: string;
}

const poemLines: PoemLine[] = [
  { text: 'Ever No Compromise', color: '#ff4d6d', direction: 'left', bold: true },
  { text: 'Just Come and Arise', color: '#ff6b35', direction: 'right', bold: true },
  { text: 'All done and Superwise', color: '#ffd60a', direction: 'top', bold: true },
  { text: 'Modern and Enterprise', color: '#06d6a0', direction: 'bottom', bold: true },
  { text: '', color: '', direction: 'none' },
  { text: 'Beautifully Organized', color: '#4cc9f0', direction: 'top-left', bold: true },
  { text: 'Auto done Stabilized', color: '#b76cfb', direction: 'top-right', bold: true },
  { text: 'Uni_Vision Improvised', color: '#f72585', direction: 'bottom-left', bold: true },
  { text: 'Beyond limits Visualized', color: '#4361ee', direction: 'bottom-right', bold: true },
  { text: '', color: '', direction: 'none' },
  { text: 'Grow, Glow as Pro', color: '#06d6a0', direction: 'left', bold: true },
  { text: 'Wish and go through', color: '#ff6b35', direction: 'right', bold: true },
  { text: 'Universal ever Flow', color: '#ffd60a', direction: 'top', bold: true },
  { text: 'Higher than higher Go..!', color: '#ff4d6d', direction: 'bottom', bold: true, size: 'xl' },
  { text: '', color: '', direction: 'none' },
  { text: 'Written & Organized by:', color: '#adb5bd', direction: 'fade', italic: true },
  { text: 'Dr M Irfan Qadir Thaheem', color: '#4cc9f0', direction: 'right', italic: true },
  { text: '', color: '', direction: 'none' },
  { text: '✦ IQ_Voicemail ✦', color: '#ffd60a', direction: 'scale', bold: true, size: '2xl' },
  { text: '✦✦ by ESOneWorld ✦✦', color: '#06d6a0', direction: 'left', bold: true },
  { text: '— Unique · United · Universal —', color: '#f72585', direction: 'bottom', italic: true },
];

const directionClass: Record<string, string> = {
  left: 'animate-from-left',
  right: 'animate-from-right',
  top: 'animate-from-top',
  bottom: 'animate-from-bottom',
  'top-left': 'animate-from-top-left',
  'top-right': 'animate-from-top-right',
  'bottom-left': 'animate-from-bottom-left',
  'bottom-right': 'animate-from-bottom-right',
  scale: 'animate-fade-scale',
  fade: 'animate-fade-in',
};

export default function PoemIntro() {
  const navigate = useNavigate();
  const [visibleLines, setVisibleLines] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<'poem' | 'brand'>('poem');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let delay = 400;

    poemLines.forEach((line, i) => {
      if (!line.text) { delay += 300; return; }
      const t = setTimeout(() => setVisibleLines(prev => new Set([...prev, i])), delay);
      timeouts.push(t);
      delay += 1600;
    });

    const brandT = setTimeout(() => setPhase('brand'), delay);
    timeouts.push(brandT);

    const doneT = setTimeout(() => setDone(true), delay + 2000);
    timeouts.push(doneT);

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const handleEnter = () => navigate('/login');

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'rgb(5, 7, 15)' }}>
      <LiveBackground />
      <BismillahHeader />

      <div className="relative z-10 flex flex-col min-h-[calc(100vh-38px)] items-center justify-center px-4 py-8">
        {/* Brand logo */}
        <div className="mb-8 text-center">
          <div
            className="font-orbitron text-3xl md:text-5xl font-black tracking-widest animate-pulse-glow"
            style={{ color: '#00f0ff', textShadow: '0 0 20px #00f0ff, 0 0 60px #00f0ff44' }}
          >
            IQ<span style={{ color: '#ff00dc' }}>MAIL</span>
          </div>
          <div className="text-xs tracking-[0.4em] text-white/40 mt-1 font-orbitron uppercase">
            Text + Voice Mail
          </div>
        </div>

        {/* Poem display */}
        <div className="w-full max-w-2xl space-y-1 text-center overflow-hidden">
          {poemLines.map((line, i) => {
            if (!line.text) return <div key={i} className="h-3" />;
            const visible = visibleLines.has(i);
            const animClass = visible ? directionClass[line.direction] || 'animate-fade-in' : 'opacity-0';
            const sizeClass = line.size === '2xl' ? 'text-2xl md:text-3xl' : line.size === 'xl' ? 'text-xl md:text-2xl' : 'text-base md:text-lg';
            return (
              <div
                key={i}
                className={`${animClass} ${sizeClass} leading-relaxed transition-all`}
                style={{
                  color: line.color,
                  fontStyle: line.italic ? 'italic' : 'normal',
                  fontWeight: line.bold ? 700 : 400,
                  textShadow: visible ? `0 0 8px ${line.color}88, 0 0 20px ${line.color}44` : 'none',
                  fontFamily: i >= 18 ? "'Orbitron', sans-serif" : 'Inter, sans-serif',
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {done && (
          <div className="mt-10 animate-fade-in flex flex-col items-center gap-3">
            <button
              onClick={handleEnter}
              className="font-orbitron px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #00f0ff, #ff00dc, #ffd700)',
                color: '#050710',
                boxShadow: '0 0 30px rgba(0, 240, 255, 0.5), 0 0 60px rgba(255, 0, 220, 0.3)',
              }}
            >
              ⚡ Enter IQMAIL
            </button>
            <p className="text-white/30 text-xs tracking-widest">iqmail.online</p>
          </div>
        )}

        {/* Skip button */}
        <button
          onClick={handleEnter}
          className="fixed bottom-6 right-6 text-white/30 hover:text-white/70 text-xs tracking-widest transition-colors z-20"
        >
          SKIP ›
        </button>
      </div>
    </div>
  );
}
