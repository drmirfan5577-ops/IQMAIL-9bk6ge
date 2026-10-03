import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth, mapSupabaseUser } from '@/hooks/useAuth';
import LiveBackground from '@/components/features/LiveBackground';
import BismillahHeader from '@/components/layout/BismillahHeader';

type Step = 'email' | 'otp' | 'password';

export default function Register() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true });
  }, [user, loading, navigate]);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) { toast.error(error.message); setBusy(false); return; }
    toast.success('OTP sent! Check your email.');
    setStep('otp');
    setBusy(false);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    if (error) { toast.error(error.message); setBusy(false); return; }
    toast.success('Email verified!');
    setStep('password');
    setBusy(false);
  };

  const setPasswordStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setBusy(true);
    const { data, error } = await supabase.auth.updateUser({ password, data: { username: username || email.split('@')[0] } });
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
            <p className="text-white/40 text-sm tracking-widest">CREATE YOUR ACCOUNT</p>
            <div className="flex justify-center gap-2 mt-4">
              {(['email', 'otp', 'password'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s ? 'text-[#050710]' : 'text-white/30 border border-white/10'}`}
                    style={step === s ? { background: 'linear-gradient(135deg, #00f0ff, #0080ff)' } : {}}>
                    {i + 1}
                  </div>
                  {i < 2 && <div className="w-8 h-px bg-white/10" />}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-8 shadow-2xl">
            {step === 'email' && (
              <form onSubmit={sendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs text-white/50 mb-2 tracking-widest uppercase">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/60 transition-colors text-sm"
                    placeholder="you@iqmail.online" />
                </div>
                <button type="submit" disabled={busy}
                  className="w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #00f0ff, #0080ff)', color: '#050710', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
                  {busy ? 'Sending...' : 'Send OTP →'}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={verifyOtp} className="space-y-5">
                <div>
                  <label className="block text-xs text-white/50 mb-2 tracking-widest uppercase">Enter OTP (4 digits)</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.slice(0, 4))} required maxLength={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/60 transition-colors text-sm text-center text-2xl tracking-[1rem]"
                    placeholder="○○○○" />
                  <p className="text-white/30 text-xs mt-2 text-center">Sent to {email}</p>
                </div>
                <button type="submit" disabled={busy}
                  className="w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #00f0ff, #0080ff)', color: '#050710', boxShadow: '0 0 20px rgba(0,240,255,0.4)' }}>
                  {busy ? 'Verifying...' : 'Verify OTP →'}
                </button>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={setPasswordStep} className="space-y-5">
                <div>
                  <label className="block text-xs text-white/50 mb-2 tracking-widest uppercase">Username</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/60 transition-colors text-sm"
                    placeholder="your_username" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-2 tracking-widest uppercase">Set Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/60 transition-colors text-sm"
                    placeholder="Min. 6 characters" />
                </div>
                <button type="submit" disabled={busy}
                  className="w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #06d6a0, #00c8ff)', color: '#050710', boxShadow: '0 0 20px rgba(6,214,160,0.4)' }}>
                  {busy ? 'Creating...' : '⚡ Create Account'}
                </button>
              </form>
            )}

            <p className="text-center text-white/30 text-xs mt-6">
              Have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
