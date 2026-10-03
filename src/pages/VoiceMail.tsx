import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Trash2, Lock, Mic, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import BismillahHeader from '@/components/layout/BismillahHeader';
import LiveBackground from '@/components/features/LiveBackground';
import VoiceRecorder from '@/components/features/VoiceRecorder';
import PinLock from '@/components/features/PinLock';
import type { VoiceMail as VoiceMailType } from '@/types';

type Tab = 'list' | 'record';

function formatDur(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2,'0')}`;
}

export default function VoiceMailPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('list');
  const [messages, setMessages] = useState<VoiceMailType[]>([]);
  const [fetching, setFetching] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [lockedMsg, setLockedMsg] = useState<VoiceMailType | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (!loading && !user) navigate('/login'); }, [user, loading]);

  const fetchMessages = async () => {
    if (!user) return;
    setFetching(true);
    const { data, error } = await supabase.from('voicemails').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    else setMessages((data as VoiceMailType[]) || []);
    setFetching(false);
  };

  useEffect(() => { if (user) fetchMessages(); }, [user]);

  const playMessage = (msg: VoiceMailType) => {
    if (msg.pin_protected && msg.pin_code) { setLockedMsg(msg); return; }
    startPlay(msg);
  };

  const startPlay = (msg: VoiceMailType) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (playingId === msg.id) { setPlayingId(null); return; }
    if (msg.audio_url) {
      const a = new Audio(msg.audio_url);
      a.play();
      a.onended = () => setPlayingId(null);
      audioRef.current = a;
    }
    setPlayingId(msg.id);
    supabase.from('voicemails').update({ is_played: true }).eq('id', msg.id);
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_played: true } : m));
  };

  const deleteMsg = async (id: string) => {
    await supabase.from('voicemails').delete().eq('id', id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (playingId === id) { audioRef.current?.pause(); setPlayingId(null); }
    toast.success('VoiceMail deleted');
  };

  return (
    <div className="relative flex flex-col min-h-screen" style={{ background: 'rgb(5,7,15)' }}>
      <LiveBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <BismillahHeader />

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft size={18} />
          </button>
          <div className="font-orbitron text-sm font-bold" style={{ color: '#f72585', textShadow: '0 0 10px #f7258588' }}>
            🎙️ IQ_VoiceMail
          </div>
          <button onClick={() => navigate('/dashboard')} className="ml-auto p-2 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-white/5 transition-all">
            <Mail size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {(['list', 'record'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tab === t ? 'text-pink-400 border-b-2 border-pink-500' : 'text-white/40 hover:text-white/70'}`}>
              {t === 'list' ? <><Play size={14} /> Messages</> : <><Mic size={14} /> Record</>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'record' && <VoiceRecorder onSaved={() => { setTab('list'); fetchMessages(); }} />}

          {tab === 'list' && (
            fetching ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 rounded-full border-2 border-pink-500/30 border-t-pink-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4 opacity-30">🎙️</div>
                <p className="text-white/30 text-sm mb-4">No voice messages yet</p>
                <button onClick={() => setTab('record')} className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #f72585, #7b2fff)', color: 'white' }}>
                  Record First Message
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className="glass rounded-2xl p-4 flex items-center gap-4 transition-all hover:bg-white/5">
                    <button onClick={() => playMessage(msg)}
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
                      style={msg.pin_protected ? { background: 'linear-gradient(135deg, #ffd60a, #ff6b35)' } : { background: 'linear-gradient(135deg, #f72585, #7b2fff)' }}>
                      {msg.pin_protected ? <Lock size={18} className="text-black" /> : playingId === msg.id ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white ml-0.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!msg.is_played && <div className="w-2 h-2 rounded-full bg-pink-400 flex-shrink-0" />}
                        <span className={`text-sm font-semibold truncate ${msg.is_played ? 'text-white/60' : 'text-white'}`}>{msg.title}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-white/30 text-xs">{formatDur(msg.duration)}</span>
                        {msg.pin_protected && <span className="text-yellow-500/70 text-xs flex items-center gap-1"><Lock size={10} /> PIN</span>}
                        <span className="text-white/20 text-xs">{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button onClick={() => deleteMsg(msg.id)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* PIN lock modal */}
      {lockedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-strong rounded-3xl max-w-xs w-full mx-4">
            <PinLock correctPin={lockedMsg.pin_code || '0000'} onUnlock={() => { startPlay(lockedMsg); setLockedMsg(null); }} />
            <div className="pb-4 text-center">
              <button onClick={() => setLockedMsg(null)} className="text-white/30 text-xs hover:text-white/60 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
