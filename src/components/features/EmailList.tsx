import { Star, Paperclip } from 'lucide-react';
import type { Email, EmailFolder } from '@/types';
import { FOLDER_LABELS } from '@/types';

interface Props {
  emails: Email[];
  folder: EmailFolder;
  onSelect: (email: Email) => void;
  selected: Email | null;
  onStar: (id: string) => void;
  loading: boolean;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function EmailList({ emails, folder, onSelect, selected, onStar, loading }: Props) {
  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <h2 className="font-orbitron text-sm font-bold" style={{ color: '#00f0ff' }}>
          {FOLDER_LABELS[folder]}
        </h2>
        <span className="text-white/30 text-xs">{emails.length} messages</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="text-4xl mb-3 opacity-30">📭</div>
            <p className="text-white/30 text-sm">No messages in {FOLDER_LABELS[folder]}</p>
          </div>
        ) : (
          emails.map(email => (
            <div
              key={email.id}
              onClick={() => onSelect(email)}
              className={`group px-4 py-3 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${selected?.id === email.id ? 'bg-cyan-500/10 border-l-2 border-l-cyan-500' : !email.is_read ? 'border-l-2 border-l-transparent' : ''}`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: `hsl(${email.from_email.charCodeAt(0) * 10 % 360}, 70%, 45%)`, color: 'white' }}>
                  {email.from_email[0].toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!email.is_read && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />}
                    <span className={`text-sm truncate ${email.is_read ? 'text-white/60 font-normal' : 'text-white font-semibold'}`}>
                      {email.from_email}
                    </span>
                    <span className="text-white/30 text-xs flex-shrink-0 ml-auto">{timeAgo(email.created_at)}</span>
                  </div>
                  <div className={`text-sm truncate mt-0.5 ${email.is_read ? 'text-white/40' : 'text-white/80'}`}>
                    {email.subject || '(no subject)'}
                  </div>
                  <div className="text-white/30 text-xs truncate mt-0.5 flex items-center gap-2">
                    {email.has_attachment && <Paperclip size={10} />}
                    {email.body?.slice(0, 80) || ''}
                  </div>
                </div>

                <button
                  onClick={e => { e.stopPropagation(); onStar(email.id); }}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <Star size={14} className={email.folder === 'specific' ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
