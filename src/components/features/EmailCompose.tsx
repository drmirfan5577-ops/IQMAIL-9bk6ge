import { useState } from 'react';
import { X, Send, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  onClose: () => void;
}

export default function EmailCompose({ onClose }: Props) {
  const { user } = useAuth();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const handleSend = async () => {
    if (!to || !user) return;
    setBusy(true);

    const { error } = await supabase.from('emails').insert({
      user_id: user.id,
      from_email: user.email,
      to_email: to,
      subject: subject || '(no subject)',
      body,
      folder: 'delivered',
      is_read: true,
    });

    if (error) { toast.error('Failed to send: ' + error.message); setBusy(false); return; }
    toast.success('Message sent via Outreach! ✨');
    onClose();
  };

  if (minimized) return (
    <div
      className="fixed bottom-4 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer"
      style={{ background: 'linear-gradient(135deg, #00f0ff22, #0080ff22)', border: '1px solid rgba(0,240,255,0.3)' }}
      onClick={() => setMinimized(false)}>
      <span className="text-cyan-400 text-sm font-medium">New Message</span>
      <Minimize2 size={14} className="text-white/40" />
    </div>
  );

  return (
    <div className="fixed bottom-4 right-6 z-50 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
      style={{ background: 'rgba(8,10,20,0.97)', border: '1px solid rgba(0,240,255,0.2)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: 'linear-gradient(90deg, rgba(0,240,255,0.15), rgba(0,128,255,0.15))' }}>
        <span className="text-sm font-semibold text-white/80">New Message</span>
        <div className="flex gap-2">
          <button onClick={() => setMinimized(true)} className="text-white/40 hover:text-white/70 p-1 transition-colors"><Minimize2 size={14} /></button>
          <button onClick={onClose} className="text-white/40 hover:text-red-400 p-1 transition-colors"><X size={14} /></button>
        </div>
      </div>

      {/* Fields */}
      <div className="p-4 space-y-3">
        <input type="email" value={to} onChange={e => setTo(e.target.value)} placeholder="To"
          className="w-full bg-transparent border-b border-white/10 pb-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-500/60 transition-colors" />
        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject"
          className="w-full bg-transparent border-b border-white/10 pb-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-500/60 transition-colors" />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Compose your message..."
          rows={6}
          className="w-full bg-transparent text-white text-sm placeholder-white/30 focus:outline-none resize-none leading-relaxed" />
      </div>

      <div className="px-4 pb-4 flex justify-end">
        <button
          onClick={handleSend} disabled={busy || !to}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #00f0ff, #0080ff)', color: '#050710' }}>
          <Send size={14} />
          {busy ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
