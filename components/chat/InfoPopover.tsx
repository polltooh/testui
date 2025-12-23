import { useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface InfoPopoverProps {
  isOpen: boolean;
  onToggle: () => void;
  isAuthenticated: boolean;
}

export default function InfoPopover({ isOpen, onToggle, isAuthenticated }: InfoPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const brandButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      {isAuthenticated ? (
        <div className="brand-font text-xl font-bold text-slate-900 tracking-tight px-3 py-1.5 cursor-default">
          Alpha<span className="text-cyan-600">DX</span>
        </div>
      ) : (
        <button
          ref={brandButtonRef}
          onClick={onToggle}
          className="brand-font text-xl font-bold text-slate-900 tracking-tight hover:bg-slate-50 transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-transparent hover:border-slate-100"
        >
          <span>Alpha<span className="text-cyan-600">DX</span></span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* AlphaDX Info Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full left-0 mt-3 w-80 bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden z-[70] fade-in-up origin-top-left"
        >
          {/* Visual Header */}
          <div className="h-24 bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>

          <div className="p-6 text-left">
            <h3 className="brand-font text-xl font-bold text-slate-900 mb-2 leading-tight text-balance">AlphaDX - Your Expert Level AI Doctor</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Get smarter health insights, personalized summaries, and private diagnostic tracking.
            </p>

            <div className="flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/user/login"
                    className="w-full h-11 flex items-center justify-center bg-slate-900 text-white rounded-xl font-semibold hover:bg-black transition-all text-sm"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/user/register"
                    className="w-full h-11 flex items-center justify-center bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all text-sm"
                  >
                    Sign up for free
                  </Link>
                </>
              ) : (
                <div className="py-2 text-center text-xs text-slate-400 font-medium">You are logged in</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

