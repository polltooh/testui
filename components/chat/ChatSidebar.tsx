import { X, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import InfoPopover from './InfoPopover';
import SessionList from './SessionList';
import { Session } from '../../hooks/useChatSessions';
import { ViewType } from './SidebarTabs';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userEmail?: string | null;
  userName?: string | null;
  onProfileOpen: () => void;
  isInfoPageOpen: boolean;
  onToggleInfo: () => void;
  sessions: Session[];
  isLoadingSessions: boolean;
  currentSessionId: string | null;
  onNewChat: () => void;
  onLoadSession: (sessionId: string) => void;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ChatSidebar({
  isOpen,
  onClose,
  isAuthenticated,
  userEmail,
  userName,
  onProfileOpen,
  isInfoPageOpen,
  onToggleInfo,
  sessions,
  isLoadingSessions,
  currentSessionId,
  onNewChat,
  onLoadSession,
  activeView,
  onViewChange
}: ChatSidebarProps) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col
      transition-all duration-300 ease-in-out lg:relative overflow-hidden
      ${isOpen
        ? 'translate-x-0 opacity-100'
        : '-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:border-none'
      }
    `}>
      <div className="flex items-center justify-between p-6 pb-8">
        <div className="flex items-center gap-2">
          {isOpen && (
            <InfoPopover
              isOpen={isInfoPageOpen}
              onToggle={onToggleInfo}
              isAuthenticated={isAuthenticated}
            />
          )}
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {isAuthenticated && (
        <SessionList
          sessions={sessions}
          isLoadingSessions={isLoadingSessions}
          currentSessionId={currentSessionId}
          onNewChat={onNewChat}
          onLoadSession={onLoadSession}
          activeView={activeView}
          onViewChange={onViewChange}
        />
      )}

      <div className="p-6 border-t border-slate-100">
        {isAuthenticated ? (
          <button
            onClick={onProfileOpen}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left group border border-transparent hover:border-slate-100"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
              {userName?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 text-sm font-semibold truncate">
                {userName || userEmail}
              </p>
              <p className="text-slate-500 text-xs">Manage Account</p>
            </div>
          </button>
        ) : (
          <div className="space-y-3">
            <Link href="/user/login" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-sm font-semibold">
              <LogIn className="w-4 h-4" />
              Log in
            </Link>
            <Link href="/user/register" className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all text-sm font-semibold">
              <UserPlus className="w-4 h-4" />
              Create Account
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

