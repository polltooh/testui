'use client';
import { Stethoscope, FileText, Compass } from 'lucide-react';

export type ViewType = 'chat' | 'doctors' | 'records' | 'explore';

interface SidebarTabsProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function SidebarTabs({ activeView, onViewChange }: SidebarTabsProps) {
  return (
    <div className="px-4 space-y-1">
      <button
        onClick={() => onViewChange('doctors')}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'doctors'
            ? 'bg-slate-100 text-slate-900'
            : 'text-slate-600 hover:bg-slate-50'
          }`}
      >
        <Stethoscope className="w-4 h-4" />
        <span>Doctors</span>
      </button>
      <button
        onClick={() => onViewChange('records')}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'records'
            ? 'bg-slate-100 text-slate-900'
            : 'text-slate-600 hover:bg-slate-50'
          }`}
      >
        <FileText className="w-4 h-4" />
        <span>Records</span>
      </button>
      <button
        onClick={() => onViewChange('explore')}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'explore'
            ? 'bg-slate-100 text-slate-900'
            : 'text-slate-600 hover:bg-slate-50'
          }`}
      >
        <Compass className="w-4 h-4" />
        <span>Explore</span>
      </button>
    </div>
  );
}
