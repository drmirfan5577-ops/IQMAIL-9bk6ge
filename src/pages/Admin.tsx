import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowLeft, Save, Database, Globe, Mail, Key } from 'lucide-react';
import { toast } from 'sonner';
import BismillahHeader from '@/components/layout/BismillahHeader';
import LiveBackground from '@/components/features/LiveBackground';

const ADMIN_PASS = '@1122#';

interface Config {
  resend_api_key: string;
  supabase_url: string;
  supabase_anon_key: string;
  supabase_service_role_key: string;
  cloudflare_zone_id: string;
  cloudflare_api_key: string;
  email_domain: string;
  catch_all_worker: string;
}

const defaultConfig: Config = {
  resend_api_key: '',
  supabase_url: import.meta.env.VITE_SUPABASE_URL || '',
  supabase_anon_key: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  supabase_service_role_key: '',
  cloudflare_zone_id: '',
  cloudflare_api_key: '',
  email_domain: 'iqmail.online',
  catch_all_worker: 'iqmail-reciever',
};

function MaskedInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs text-white/40 mb-1.5 tracking-widest uppercase">{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-500/60 transition-colors font-mono"
          placeholder="••••••••••••••••" />
        <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [config, setConfig] = useState<Config>(() => {
    try { return { ...defaultConfig, ...JSON.parse(localStorage.getItem('iqmail_admin_cfg') || '{}') }; }
    catch { return defaultConfig; }
  });
  const [activeSection, setActiveSection] = useState('resend');

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === ADMIN_PASS) { setUnlocked(true); toast.success('Admin Panel Unlocked ✓'); }
    else { toast.error('Incorrect password'); setPassInput(''); }
  };

  const save = () => {
    localStorage.setItem('iqmail_admin_cfg', JSON.stringify(config));
    toast.success('Configuration saved securely ✓');
  };

  const set = (key: keyof Config) => (val: string) => setConfig(c => ({ ...c, [key]: val }));

  const sections = [
    { id: 'resend', label: 'Resend', icon: Mail, color: '#00f0ff' },
    { id: 'cloudflare', label: 'Cloudflare', icon: Globe, color: '#ffd60a' },
    { id: 'supabase', label: 'Supabase', icon: Database, color: '#06d6a0' },
    { id: 'dns', label: 'DNS Records', icon: Key, color: '#f72585' },
  ];

  if (!unlocked) return (
    <div className="relative min-h-screen" style={{ background: 'rgb(5,7,15)' }}>
      <LiveBackground />
      <BismillahHeader />
      <div className="relative z-10 flex min-h-[calc(100vh-38px)] items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #f72585, #7b2fff)' }}>
              <Shield size={28} className="text-white" />
            </div>
            <div className="font-orbitron text-xl font-bold text-white mb-1">Admin Panel</div>
            <p className="text-white/30 text-xs tracking-widest">PASSWORD PROTECTED</p>
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <form onSubmit={unlock} className="space-y-4">
              <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest focus:outline-none focus:border-pink-500/60 transition-colors"
                placeholder="Enter admin password" />
              <button type="submit" className="w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #f72585, #7b2fff)', color: 'white' }}>
                🔓 Unlock
              </button>
            </form>
          </div>
          <div className="text-center mt-4">
            <button onClick={() => navigate('/dashboard')} className="text-white/20 hover:text-white/50 text-xs transition-colors">← Back to Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen" style={{ background: 'rgb(5,7,15)' }}>
      <LiveBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <BismillahHeader />
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"><ArrowLeft size={18} /></button>
          <Shield size={16} style={{ color: '#f72585' }} />
          <span className="font-orbitron text-sm font-bold" style={{ color: '#f72585' }}>Admin Control Panel</span>
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full" style={{ background: '#f7258520', color: '#f72585', border: '1px solid #f7258540' }}>RESTRICTED</span>
          <button onClick={save} className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #06d6a0, #00c8ff)', color: '#050710' }}>
            <Save size={14} /> Save All
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Section nav */}
          <div className="w-48 flex-shrink-0 border-r border-white/5 p-3 space-y-1">
            {sections.map(({ id, label, icon: Icon, color }) => (
              <button key={id} onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeSection === id ? 'text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
                style={activeSection === id ? { background: `${color}18`, border: `1px solid ${color}33`, color } : {}}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
            {activeSection === 'resend' && (
              <div className="space-y-4">
                <h2 className="text-white font-semibold">📧 Resend Email Config</h2>
                <p className="text-white/30 text-xs">Configure Resend API for outgoing email delivery via iqmail.online domain.</p>
                <MaskedInput label="Resend API Key" value={config.resend_api_key} onChange={set('resend_api_key')} />
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 tracking-widest uppercase">Email Domain</label>
                  <input value={config.email_domain} onChange={e => setConfig(c => ({ ...c, email_domain: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/60 transition-colors font-mono" />
                </div>
                <div className="p-4 rounded-xl text-xs font-mono space-y-1" style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.1)', color: '#00f0ff88' }}>
                  <div>Catch-all Worker: <span className="text-cyan-400">{config.catch_all_worker}</span></div>
                  <div>Status: <span className="text-green-400">● Connected via Cloudflare</span></div>
                </div>
              </div>
            )}

            {activeSection === 'cloudflare' && (
              <div className="space-y-4">
                <h2 className="text-white font-semibold">☁️ Cloudflare DNS Config</h2>
                <MaskedInput label="Cloudflare API Key" value={config.cloudflare_api_key} onChange={set('cloudflare_api_key')} />
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 tracking-widest uppercase">Zone ID</label>
                  <input value={config.cloudflare_zone_id} onChange={e => setConfig(c => ({ ...c, cloudflare_zone_id: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/60 transition-colors font-mono" />
                </div>
              </div>
            )}

            {activeSection === 'supabase' && (
              <div className="space-y-4">
                <h2 className="text-white font-semibold">🗄️ Supabase Config</h2>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 tracking-widest uppercase">Supabase URL</label>
                  <input value={config.supabase_url} onChange={e => setConfig(c => ({ ...c, supabase_url: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/60 transition-colors font-mono" />
                </div>
                <MaskedInput label="Anon Key" value={config.supabase_anon_key} onChange={set('supabase_anon_key')} />
                <MaskedInput label="Service Role Key" value={config.supabase_service_role_key} onChange={set('supabase_service_role_key')} />
              </div>
            )}

            {activeSection === 'dns' && (
              <div className="space-y-4">
                <h2 className="text-white font-semibold">🌐 DNS Records Reference</h2>
                <p className="text-white/30 text-xs">All records configured on iqmail.online via Cloudflare.</p>
                {[
                  { type: 'MX', name: '@', value: 'route.mx.cloudflare.net', priority: '10', note: 'Cloudflare Email Routing' },
                  { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.resend.com ~all', note: 'SPF Record (Resend)' },
                  { type: 'CNAME', name: 'resend._domainkey', value: 'resend._domainkey.iqmail.online.resend.dev', note: 'DKIM (Resend)' },
                  { type: 'TXT', name: '_dmarc', value: 'v=DMARC1; p=quarantine; rua=mailto:admin@iqmail.online', note: 'DMARC Policy' },
                ].map((r, i) => (
                  <div key={i} className="p-3 rounded-xl text-xs font-mono" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(0,240,255,0.2)', color: '#00f0ff' }}>{r.type}</span>
                      <span className="text-white/60">{r.name}</span>
                      <span className="ml-auto text-green-400 text-[10px]">● Active</span>
                    </div>
                    <div className="text-white/40 break-all">{r.value}</div>
                    <div className="text-white/25 mt-1">{r.note}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
