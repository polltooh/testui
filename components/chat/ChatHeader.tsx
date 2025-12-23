import { Menu, Home } from 'lucide-react';
import Link from 'next/link';
import InfoPopover from './InfoPopover';

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isAuthenticated: boolean;
  isInfoPageOpen: boolean;
  onToggleInfo: () => void;
  chatHistoryLength: number;
  onNewChat: () => void;
}

export default function ChatHeader({
  isSidebarOpen,
  onToggleSidebar,
  isAuthenticated,
  isInfoPageOpen,
  onToggleInfo,
  chatHistoryLength,
  onNewChat
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white/50 backdrop-blur-md border-b border-slate-100 lg:border-none lg:bg-transparent relative">
      <div className="flex-1 flex justify-start items-center gap-2 relative">
        {isAuthenticated && (
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-500 hover:text-slate-900 transition-all rounded-xl hover:bg-slate-100 group"
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {!isSidebarOpen && (
          <InfoPopover
            isOpen={isInfoPageOpen}
            onToggle={onToggleInfo}
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        {chatHistoryLength > 0 && !isSidebarOpen && (
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-900 transition-all rounded-xl hover:bg-slate-100 group bg-white/40 shadow-sm border border-slate-100/50"
            title="New Chat"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        {!isAuthenticated && (
          <Link
            href="/user/login"
            className="h-10 flex items-center justify-center px-5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-black transition-all text-sm shadow-sm"
          >
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}

