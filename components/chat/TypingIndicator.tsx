import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-4 md:gap-6 justify-start animate-fadeIn">
      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
        <Bot className="w-6 h-6 text-white" />
      </div>
      <div className="bg-white border border-slate-100 px-5 py-4 rounded-3xl rounded-bl-none shadow-sm flex items-center gap-1">
        <div className="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
}

