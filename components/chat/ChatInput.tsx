import { Send, AudioLines } from 'lucide-react';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isTyping: boolean;
  isVoiceMode: boolean;
  voiceError: string;
  onToggleVoice: () => void;
  isDiagnosisMode: boolean;
  onToggleDiagnosisMode: () => void;
}

export default function ChatInput({
  message,
  setMessage,
  onSubmit,
  isTyping,
  isVoiceMode,
  voiceError,
  onToggleVoice,
  isDiagnosisMode,
  onToggleDiagnosisMode
}: ChatInputProps) {
  return (
    <div className="max-w-3xl mx-auto relative group">
      <form onSubmit={onSubmit} className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          className="
            w-full px-6 py-5 pr-32
            bg-white
            border-2 border-slate-100
            rounded-3xl
            text-slate-900 placeholder-slate-400
            focus:outline-none focus:border-cyan-400/50
            input-glow
            transition-all duration-300
            text-base shadow-lg shadow-slate-200/40
          "
          disabled={isTyping}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleVoice}
            className={`
              w-12 h-12 rounded-full
              flex items-center justify-center
              transition-all duration-300
              ${isVoiceMode ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
            `}
            title={isVoiceMode ? 'Stop recording' : 'Voice interaction'}
          >
            <AudioLines className={`w-6 h-6 ${isVoiceMode ? 'animate-pulse' : ''}`} />
          </button>
          <button
            type="submit"
            disabled={!message.trim() || isTyping}
            className="
              w-12 h-12
              bg-slate-900 hover:bg-black
              disabled:bg-slate-200 disabled:text-slate-400
              text-white
              rounded-2xl
              flex items-center justify-center
              transition-all duration-300
              shadow-lg shadow-black/10
              hover:scale-105 active:scale-95
            "
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
      {voiceError && (
        <p className="absolute -bottom-6 left-6 text-[11px] text-red-500 font-medium">{voiceError}</p>
      )}

      {/* Mode Switcher - Refined Toggle */}
      <div className="mt-8 flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-[280px] px-2 py-1 select-none">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800 tracking-tight">Self-diagnosis mode</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.05em]">Advanced health tracker</span>
          </div>
          <button
            type="button"
            onClick={onToggleDiagnosisMode}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 outline-none
              ${isDiagnosisMode ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-slate-200'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm
                ${isDiagnosisMode ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

