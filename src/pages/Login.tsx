import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth, mapSupabaseUser } from '@/hooks/useAuth';
import LiveBackground from '@/components/features/LiveBackground';
import BismillahHeader from '@/components/layout/BismillahHeader';

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true });
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast.error(error.message); setBusy(false); return; }
    login(mapSupabaseUser(data.user));
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen" style={{ background: 'rgb(5,7,15)' }}>
      <LiveBackground />
      <BismillahHeader />
      <div className="relative z-10 flex min-h-[calc(100vh-38px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="font-orbitron text-4xl font-black mb-2" style={{ color: '#00f0ff', textShadow: '0 0 20px #00f0ff88' }}>
              IQ<span style={{ color: '#ff00dc' }}>MAIL</span>
            </div>
            <p className="text-white/40 text-sm tracking-widest">SIGN IN TO YOUR ACCOUNT</p>
          </div>

          <div className="glass-strong rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs text-white/50 mb-2 tracking-widest uppercase">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/60 transition-colors text-sm"
                  placeholder="you@iqmail.online"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2 tracking-widest uppercase">Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/60 transition-colors text-sm"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit" disabled={busy}
                className="w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #00f0ff, #0080ff)', color: '#050710', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}
              >
                {busy ? 'Signing In...' : '⚡ Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-white/30 text-xs">
                No account?{' '}
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">Create one →</Link>
              </p>
              <p className="text-white/20 text-xs">
                <Link to="/" className="hover:text-white/40 transition-colors">← Back to Intro</Link>
              </p>
            </div>
          </div>

          <p className="text-center text-white/15 text-xs mt-6 tracking-widest">IQMAIL · iqmail.online</p>
        </div>
      </div>
    </div>
  );
}
