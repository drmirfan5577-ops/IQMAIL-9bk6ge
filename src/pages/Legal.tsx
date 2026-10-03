import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BismillahHeader from '@/components/layout/BismillahHeader';
import LiveBackground from '@/components/features/LiveBackground';

type Section = 'about' | 'privacy' | 'terms' | 'disclaimer';

const sections: { id: Section; label: string }[] = [
  { id: 'about', label: 'About Us' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms & Usage' },
  { id: 'disclaimer', label: 'Disclaimer' },
];

export default function Legal() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Section>('about');

  return (
    <div className="relative min-h-screen" style={{ background: 'rgb(5,7,15)' }}>
      <LiveBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <BismillahHeader />

        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"><ArrowLeft size={18} /></button>
          <span className="font-orbitron text-sm font-bold" style={{ color: '#4cc9f0' }}>Legal & About</span>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Section nav */}
          <div className="flex md:flex-col gap-1 p-3 md:w-48 border-b md:border-b-0 md:border-r border-white/5 overflow-x-auto">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${active === s.id ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 max-w-3xl">
            {active === 'about' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="font-orbitron text-3xl font-black mb-2" style={{ color: '#00f0ff', textShadow: '0 0 20px #00f0ff88' }}>
                    IQ<span style={{ color: '#ff00dc' }}>MAIL</span>
                  </div>
                  <div className="text-white/40 text-sm tracking-widest">Text + Voice Mail — by ESOneWorld</div>
                </div>

                <div className="glass rounded-2xl p-6 space-y-4">
                  <h2 className="text-lg font-bold text-white">SMART WORLD ORDER · ESOneWorld</h2>
                  <div className="text-white/50 text-sm leading-relaxed space-y-3">
                    <p className="text-cyan-400 font-medium italic">
                      "Neither a Global Village, Nor a Global Community — It's a Global Family Platform Vision"
                    </p>
                    <p>
                      Founded by <strong className="text-white">Dr M Irfan Qadir Thaheem</strong>, ESOneWorld is committed to
                      enhancing the whole world in every field of life within Unity, Integrity and Universality — In-sha-Allah Azza-wa-Jall.
                    </p>
                    <p>
                      IQMAIL represents a breakthrough in digital communication — combining professional email with voice messaging
                      in a single, unified, universally accessible platform.
                    </p>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                  <h3 className="text-white font-semibold">Contact & Reach</h3>
                  <div className="space-y-2 text-sm font-mono">
                    {['admin@iqmail.online', 'admin@uniorni.com', 'admin@drirfan.online', 'dr.esoneworld@gmail.com', 'uni.smartworldorder@gmail.com'].map(e => (
                      <div key={e} className="flex items-center gap-2">
                        <span className="text-cyan-400">✉</span>
                        <a href={`mailto:${e}`} className="text-white/50 hover:text-cyan-400 transition-colors">{e}</a>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">📱</span>
                      <span className="text-white/50">WhatsApp: +92300-4737757</span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-5 text-center space-y-2">
                  <div className="text-pink-400 font-medium italic text-sm">"Ever No Compromise · Just Come and Arise"</div>
                  <p className="text-white/20 text-xs tracking-widest">*Unique · United · Universal*</p>
                  <p className="text-white/15 text-xs">iqmail.online · euni.site · uniorni.com · drirfan.online</p>
                </div>
              </div>
            )}

            {active === 'privacy' && (
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">Privacy Policy</h2>
                <div className="text-white/50 text-sm leading-relaxed space-y-4">
                  <p>IQMAIL by ESOneWorld is committed to protecting your privacy and personal data with the highest standards.</p>
                  <div className="glass rounded-xl p-4 space-y-3">
                    <p><strong className="text-cyan-400">Data Collection:</strong> We collect only email addresses and credentials required for authentication. Voice messages are encrypted and stored securely via Supabase Storage.</p>
                    <p><strong className="text-cyan-400">Data Usage:</strong> Your data is used solely for providing IQMAIL services and is never sold to third parties.</p>
                    <p><strong className="text-cyan-400">Security:</strong> All communications use TLS/SSL encryption. Voicemails can be additionally PIN-protected.</p>
                    <p><strong className="text-cyan-400">Retention:</strong> You may delete your account and all associated data at any time by contacting admin@iqmail.online.</p>
                  </div>
                  <p>For privacy concerns: <a href="mailto:admin@iqmail.online" className="text-cyan-400 hover:underline">admin@iqmail.online</a></p>
                </div>
              </div>
            )}

            {active === 'terms' && (
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">Terms & Usage</h2>
                <div className="text-white/50 text-sm leading-relaxed space-y-3">
                  <p>By using IQMAIL, you agree to use this service only for lawful, ethical, and constructive purposes aligned with ESOneWorld's Global Family Platform vision.</p>
                  <div className="glass rounded-xl p-4 space-y-2">
                    <p className="text-red-400">Prohibited uses include: Spam, harassment, illegal content, impersonation, or any activity violating applicable laws.</p>
                    <p>Voice messages are limited to 10 minutes maximum duration.</p>
                    <p>Storage is subject to fair usage policies.</p>
                    <p>ESOneWorld reserves the right to terminate accounts that violate these terms without notice.</p>
                  </div>
                </div>
              </div>
            )}

            {active === 'disclaimer' && (
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">Legal Disclaimer & Copyright</h2>
                <div className="text-white/50 text-sm leading-relaxed space-y-3">
                  <div className="glass rounded-xl p-4 space-y-2">
                    <p>© 2024 IQMAIL by ESOneWorld. All Rights Reserved Worldwide.</p>
                    <p>IQMAIL™, IQ_Voicemail™, ESOneWorld™, and Smart World Order™ are trademarks of Dr M Irfan Qadir Thaheem.</p>
                    <p>Unauthorized reproduction, distribution, or use of any part of this platform is strictly prohibited.</p>
                  </div>
                  <p>This platform is provided "as is" without warranty of any kind. ESOneWorld shall not be liable for any indirect, incidental, or consequential damages arising from use of this service.</p>
                  <p>Domain: <span className="text-cyan-400">iqmail.online</span> — Deployed via Cloudflare with Resend email delivery integration.</p>
                  <div className="mt-6 p-4 glass rounded-xl text-center">
                    <p className="text-cyan-400/70 italic text-sm">Written & Organized by</p>
                    <p className="text-white font-semibold">Dr M Irfan Qadir Thaheem</p>
                    <p className="text-white/40 text-xs mt-1">ESOneWorld · Smart World Order</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
