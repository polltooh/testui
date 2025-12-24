import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'ai' | 'system';
  content: string;
  isTyping?: boolean;
}

export default function MessageBubble({ role, content, isTyping = false }: MessageBubbleProps) {
  if (role === 'system') {
    return (
      <div className="flex justify-center w-full my-6 animate-fadeInUp">
        <div className="bg-slate-100/80 backdrop-blur-sm border border-slate-200 text-slate-500 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          {content.includes('MODE_SWITCH') ? 'Self-Diagnosis Mode Started' : content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-4 md:gap-6 ${role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
      {role === 'ai' && (
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
      )}
      <div className={`
        max-w-[85%] px-5 py-4 rounded-3xl text-[15px] leading-relaxed shadow-sm
        ${role === 'user'
          ? 'bg-cyan-600 text-white rounded-br-none'
          : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'}
      `}>
        {role === 'ai' && !content.trim() && isTyping ? (
          <div className="typing-dots">
            <span></span><span></span><span></span>
          </div>
        ) : (
          content
        )}
      </div>
      {role === 'user' && (
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0 border border-white shadow-sm">
          <User className="w-5 h-5 text-slate-600" />
        </div>
      )}
    </div>
  );
}

