import { Sparkles } from 'lucide-react';
import { Session } from '../../hooks/useChatSessions';
import SidebarTabs, { ViewType } from './SidebarTabs';

interface SessionListProps {
  sessions: Session[];
  isLoadingSessions: boolean;
  currentSessionId: string | null;
  onNewChat: () => void;
  onLoadSession: (sessionId: string) => void;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function SessionList({
  sessions,
  isLoadingSessions,
  currentSessionId,
  onNewChat,
  onLoadSession,
  activeView,
  onViewChange
}: SessionListProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* New Conversation Button */}
      <div className="px-4 mb-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-700 font-medium shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Tabs Section */}
      <SidebarTabs activeView={activeView} onViewChange={onViewChange} />

      {/* Chat History Section */}
      <div className="flex-1 px-4 mt-4 pb-4 min-h-0 flex flex-col">
        <div className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex-shrink-0">Chat History</div>
        {isLoadingSessions ? (
          <div className="px-4 py-3 text-sm text-slate-400 italic">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="px-4 py-3 text-sm text-slate-400 italic">No recent chats</div>
        ) : (
          <div className="px-2 space-y-1 overflow-y-auto min-h-0 flex-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onLoadSession(session.id)}
                className={`px-3 py-2 text-sm text-slate-600 truncate rounded-lg hover:bg-slate-100 cursor-pointer transition-colors ${currentSessionId === session.id ? 'bg-slate-100 border border-slate-200' : ''
                  }`}
                title={session.title || 'Untitled'}
              >
                {session.title || 'Untitled'}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

