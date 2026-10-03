import { Mail, Send, FileText, CheckCircle, AlertTriangle, Star, Mic, User, Settings, LogOut, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { EmailFolder } from '@/types';

interface Props {
  activeFolder: EmailFolder;
  onFolderChange: (f: EmailFolder) => void;
  emailCounts?: Partial<Record<EmailFolder, number>>;
  collapsed?: boolean;
}

const folders: { key: EmailFolder; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'incoming', label: 'Incoming', icon: Mail, color: '#00f0ff' },
  { key: 'outreach', label: 'Outreach', icon: Send, color: '#06d6a0' },
  { key: 'on_the_way', label: 'On_the_Way', icon: FileText, color: '#ffd60a' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: '#4cc9f0' },
  { key: 'betrayed', label: 'Betrayed', icon: AlertTriangle, color: '#ff4d6d' },
  { key: 'specific', label: 'Specific', icon: Star, color: '#f72585' },
];

export default function Sidebar({ activeFolder, onFolderChange, emailCounts, collapsed }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/login');
  };

  return (
    <aside className={`flex flex-col h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
      style={{ background: 'rgba(5,7,15,0.9)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #00f0ff, #ff00dc)' }}>
          <span className="font-orbitron text-xs font-black text-black">IQ</span>
        </div>
        {!collapsed && (
          <div>
            <div className="font-orbitron text-sm font-bold" style={{ color: '#00f0ff' }}>IQMAIL</div>
            <div className="text-white/30 text-[10px] tracking-widest">iqmail.online</div>
          </div>
        )}
      </div>

      {/* Compose */}
      <div className="p-3">
        <button
          onClick={() => navigate('/dashboard?compose=1')}
          className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95"
          style={{ background: 'linear-gradient(135deg, #00f0ff22, #ff00dc22)', border: '1px solid rgba(0,240,255,0.3)', color: '#00f0ff' }}>
          <span className="text-lg">✏️</span>
          {!collapsed && 'Compose'}
        </button>
      </div>

      {/* Folders */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto py-2">
        {folders.map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => onFolderChange(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeFolder === key ? 'text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
            style={activeFolder === key ? { background: `${color}18`, border: `1px solid ${color}44`, color } : {}}>
            <Icon size={16} style={{ color: activeFolder === key ? color : undefined }} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{label}</span>
                {emailCounts?.[key] !== undefined && emailCounts[key]! > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: `${color}33`, color }}>{emailCounts[key]}</span>
                )}
              </>
            )}
          </button>
        ))}

        <div className="h-px bg-white/5 my-2" />

        <button
          onClick={() => navigate('/voicemail')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${location.pathname === '/voicemail' ? 'text-[#f72585]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
          style={location.pathname === '/voicemail' ? { background: '#f7258518', border: '1px solid #f7258544' } : {}}>
          <Mic size={16} />
          {!collapsed && 'VoiceMail'}
        </button>
      </nav>

      {/* Bottom nav */}
      <div className="p-2 border-t border-white/5 space-y-0.5">
        {user && !collapsed && (
          <div className="px-3 py-2 flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #00f0ff, #ff00dc)', color: '#050710' }}>
              {(user.username || user.email)[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white/80 text-xs font-medium truncate">{user.username}</div>
              <div className="text-white/30 text-[10px] truncate">{user.email}</div>
            </div>
          </div>
        )}
        <button onClick={() => navigate('/admin')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 text-sm transition-all">
          <Shield size={15} />
          {!collapsed && 'Admin'}
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/5 text-sm transition-all">
          <LogOut size={15} />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
