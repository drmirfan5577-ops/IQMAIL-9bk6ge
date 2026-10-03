import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const MAX_DURATION = 600; // 10 minutes

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function VoiceRecorder({ onSaved }: { onSaved: () => void }) {
  const { user } = useAuth();
  const [state, setState] = useState<'idle' | 'recording' | 'preview'>('idle');
  const [duration, setDuration] = useState(0);
  const [playPos, setPlayPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState('');
  const [pinProtect, setPinProtect] = useState(false);
  const [pin, setPin] = useState('');
  const [saving, setSaving] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => () => {
    clearInterval(timerRef.current!);
    cancelAnimationFrame(animRef.current);
  }, []);

  const drawWave = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext('2d')!;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(data);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    const slice = canvas.width / data.length;
    let x = 0;
    data.forEach((v, i) => {
      const y = (v / 128) * (canvas.height / 2);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      x += slice;
    });
    ctx.stroke();
    animRef.current = requestAnimationFrame(drawWave);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => null);
    if (!stream) { toast.error('Microphone access denied'); return; }
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    analyserRef.current = analyser;
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mr.ondataavailable = e => chunksRef.current.push(e.data);
    mr.onstop = () => { blobRef.current = new Blob(chunksRef.current, { type: 'audio/webm' }); stream.getTracks().forEach(t => t.stop()); };
    mr.start();
    mediaRef.current = mr;
    setState('recording');
    setDuration(0);
    timerRef.current = setInterval(() => setDuration(d => {
      if (d >= MAX_DURATION - 1) { stopRecording(); return d; }
      return d + 1;
    }), 1000);
    drawWave();
  };

  const stopRecording = () => {
    clearInterval(timerRef.current!);
    cancelAnimationFrame(animRef.current);
    mediaRef.current?.stop();
    setState('preview');
  };

  const togglePlay = () => {
    if (!blobRef.current) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(URL.createObjectURL(blobRef.current));
      audioRef.current.ontimeupdate = () => setPlayPos(audioRef.current!.currentTime);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const discard = () => { blobRef.current = null; audioRef.current = null; setState('idle'); setDuration(0); };

  const save = async () => {
    if (!user || !blobRef.current) return;
    setSaving(true);
    const path = `voicemails/${user.id}/${Date.now()}.webm`;
    const { error: upErr } = await supabase.storage.from('voicemails').upload(path, blobRef.current, { contentType: 'audio/webm' });
    if (upErr) {
      // fallback: save without audio_url
      const { error } = await supabase.from('voicemails').insert({ user_id: user.id, title: title || 'Voice Message', duration, is_played: false, pin_protected: pinProtect, pin_code: pinProtect ? pin : null });
      if (error) { toast.error(error.message); setSaving(false); return; }
    } else {
      const { data } = supabase.storage.from('voicemails').getPublicUrl(path);
      const { error } = await supabase.from('voicemails').insert({ user_id: user.id, title: title || 'Voice Message', duration, audio_url: data.publicUrl, is_played: false, pin_protected: pinProtect, pin_code: pinProtect ? pin : null });
      if (error) { toast.error(error.message); setSaving(false); return; }
    }
    toast.success('VoiceMail saved! ✨');
    discard();
    setSaving(false);
    onSaved();
  };

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-5">
      <h3 className="font-orbitron text-sm font-bold" style={{ color: '#f72585' }}>🎙️ Voice Recorder</h3>

      {/* Waveform */}
      <canvas ref={canvasRef} width={400} height={60} className="w-full rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }} />

      {/* Timer */}
      <div className="text-center">
        <span className="font-orbitron text-3xl font-bold" style={{ color: state === 'recording' ? '#f72585' : '#00f0ff', textShadow: `0 0 15px ${state === 'recording' ? '#f72585' : '#00f0ff'}88` }}>
          {formatTime(state === 'preview' ? Math.round(playPos) : duration)}
        </span>
        {state === 'recording' && <span className="ml-2 text-red-400 animate-blink text-xs">● REC</span>}
        <div className="text-white/30 text-xs mt-1">Max: 10:00</div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {state === 'idle' && (
          <button onClick={startRecording} className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f72585, #ff4d6d)', boxShadow: '0 0 25px #f7258588' }}>
            <Mic size={24} className="text-white" />
          </button>
        )}
        {state === 'recording' && (
          <button onClick={stopRecording} className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-pulse"
            style={{ background: 'linear-gradient(135deg, #ff4d6d, #ff0000)', boxShadow: '0 0 25px #ff000088' }}>
            <Square size={22} className="text-white" />
          </button>
        )}
        {state === 'preview' && (
          <>
            <button onClick={discard} className="p-3 rounded-full bg-white/5 hover:bg-red-500/20 transition-all text-white/50 hover:text-red-400"><Trash2 size={18} /></button>
            <button onClick={togglePlay} className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #00f0ff, #0080ff)', boxShadow: '0 0 20px #00f0ff66' }}>
              {playing ? <Pause size={22} className="text-black" /> : <Play size={22} className="text-black ml-1" />}
            </button>
          </>
        )}
      </div>

      {/* Save options */}
      {state === 'preview' && (
        <div className="space-y-3 pt-2 border-t border-white/5">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Message title..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-pink-500/60 transition-colors" />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={pinProtect} onChange={e => setPinProtect(e.target.checked)} className="w-4 h-4 accent-pink-500" />
            <span className="text-white/60 text-sm">PIN-lock this message</span>
          </label>
          {pinProtect && (
            <input value={pin} onChange={e => setPin(e.target.value.slice(0, 4))} placeholder="4-digit PIN" maxLength={4} type="password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-pink-500/60 transition-colors text-center tracking-widest" />
          )}
          <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #f72585, #7b2fff)', color: 'white', boxShadow: '0 0 20px #f7258566' }}>
            <Save size={16} />{saving ? 'Saving...' : 'Save VoiceMail'}
          </button>
        </div>
      )}
    </div>
  );
}
