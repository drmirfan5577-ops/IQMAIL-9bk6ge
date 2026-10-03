import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, X, RefreshCw, Reply, Trash2, Archive } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import BismillahHeader from '@/components/layout/BismillahHeader';
import Sidebar from '@/components/layout/Sidebar';
import EmailList from '@/components/features/EmailList';
import EmailCompose from '@/components/features/EmailCompose';
import LiveBackground from '@/components/features/LiveBackground';
import type { Email, EmailFolder } from '@/types';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [folder, setFolder] = useState<EmailFolder>('incoming');
  const [emails, setEmails] = useState<Email[]>([]);
  const [selected, setSelected] = useState<Email | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [composing, setComposing] = useState(params.get('compose') === '1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [user, loading, navigate]);

  const fetchEmails = async () => {
    if (!user) return;
    setEmailLoading(true);
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .eq('user_id', user.id)
      .eq('folder', folder)
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    else setEmails((data as Email[]) || []);
    setEmailLoading(false);
  };

  useEffect(() => { if (user) fetchEmails(); }, [folder, user]);

  const markRead = async (email: Email) => {
    setSelected(email);
    if (!email.is_read) {
      await supabase.from('emails').update({ is_read: true }).eq('id', email.id);
      setEmails(prev => prev.map(e => e.id === email.id ? { ...e, is_read: true } : e));
    }
  };

  const toggleStar = async (id: string) => {
    const email = emails.find(e => e.id === id);
    if (!email) return;
    const newFolder = email.folder === 'specific' ? 'incoming' : 'specific';
    await supabase.from('emails').update({ folder: newFolder }).eq('id', id);
    setEmails(prev => prev.filter(e => e.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success(newFolder === 'specific' ? 'Added to Specific ★' : 'Removed from Specific');
  };

  const deleteEmail = async () => {
    if (!selected) return;
    await supabase.from('emails').delete().eq('id', selected.id);
    setEmails(prev => prev.filter(e => e.id !== selected.id));
    setSelected(null);
    toast.success('Moved to Betrayed');
  };

  const emailCounts: Partial<Record<EmailFolder, number>> = {};
  emails.forEach(e => { if (!e.is_read) emailCounts[e.folder as EmailFolder] = (emailCounts[e.folder as EmailFolder] || 0) + 1; });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(5,7,15)' }}>
      <div className="font-orbitron text-2xl animate-pulse" style={{ color: '#00f0ff' }}>IQMAIL</div>
    </div>
  );

  return (
    <div className="relative flex flex-col h-screen overflow-hidden" style={{ background: 'rgb(5,7,15)' }}>
      <LiveBackground />
      <div className="relative z-10 flex flex-col h-full">
        <BismillahHeader />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className={`flex-shrink-0 transition-all duration-300 overflow-hidden ${sidebarOpen ? 'w-64' : 'w-0 md:w-16'}`}>
            <Sidebar
              activeFolder={folder}
              onFolderChange={f => { setFolder(f); setSelected(null); }}
              emailCounts={emailCounts}
              collapsed={!sidebarOpen}
            />
          </div>

          {/* Email list */}
          <div className="flex flex-col border-r border-white/5" style={{ width: selected ? '280px' : '100%', minWidth: '220px', flexShrink: 0 }}>
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
              <button onClick={() => setSidebarOpen(s => !s)} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">
                {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
              <button onClick={fetchEmails} className="p-2 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-white/5 transition-all">
                <RefreshCw size={14} />
              </button>
              <button onClick={() => setComposing(true)}
                className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #00f0ff33, #0080ff33)', border: '1px solid rgba(0,240,255,0.3)', color: '#00f0ff' }}>
                ✏️ Compose
              </button>
            </div>
            <EmailList emails={emails} folder={folder} onSelect={markRead} selected={selected} onStar={toggleStar} loading={emailLoading} />
          </div>

          {/* Email detail */}
          {selected && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
                <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"><X size={16} /></button>
                <div className="flex-1" />
                <button onClick={() => setReplying(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 transition-all"><Reply size={14} /> Reply</button>
                <button onClick={deleteEmail} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-red-400 hover:bg-red-500/5 transition-all"><Trash2 size={14} /> Delete</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <h1 className="text-xl font-bold text-white mb-4">{selected.subject || '(no subject)'}</h1>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: `hsl(${selected.from_email.charCodeAt(0) * 10 % 360}, 70%, 45%)`, color: 'white' }}>
                    {selected.from_email[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white/80 text-sm font-medium">{selected.from_email}</div>
                    <div className="text-white/30 text-xs">To: {selected.to_email}</div>
                  </div>
                  <div className="ml-auto text-white/30 text-xs">{new Date(selected.created_at).toLocaleString()}</div>
                </div>
                <div className="text-white/70 leading-relaxed text-sm whitespace-pre-wrap">{selected.body || '(empty message)'}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {composing && <EmailCompose onClose={() => setComposing(false)} />}
    </div>
  );
}
