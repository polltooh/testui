import { Bot, User, ChevronDown, ChevronUp, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
  role: 'user' | 'ai' | 'system';
  content: string;
  isTyping?: boolean;
  decisionChain?: {
    chief_complaint: string;
    chief_complaint_highlights: string[];
    differentials: string[];
    nodes: Array<{
      question: string;
      question_tag: string;
      patient_answer: string;
      clinical_reasoning: string;
    }>;
  };
}

export default function MessageBubble({ role, content, isTyping = false, decisionChain }: MessageBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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

        {role === 'ai' && decisionChain && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold text-xs transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              {isExpanded ? 'Hide Reasoning Path' : 'Show Reasoning Path'}
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isExpanded && (
              <div className="mt-4 space-y-4 animate-fadeIn">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Chief Complaint</h4>
                  <p className="text-sm font-bold text-slate-900 mb-2">{decisionChain.chief_complaint}</p>
                  <div className="flex flex-wrap gap-2">
                    {decisionChain.chief_complaint_highlights.map((h, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-[10px] text-slate-600 rounded-md">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Reasoning Flow</h4>
                  {decisionChain.nodes.map((node, i) => (
                    <div key={i} className="relative pl-6 pb-4 last:pb-0">
                      {i !== decisionChain.nodes.length - 1 && (
                        <div className="absolute left-[7px] top-[14px] bottom-0 w-[1px] bg-slate-200" />
                      )}
                      <div className="absolute left-0 top-[2px] w-3.5 h-3.5 rounded-full bg-white border-2 border-cyan-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-900">{node.question}</span>
                          <span className="px-1.5 py-0.5 bg-cyan-50 text-cyan-600 text-[9px] font-bold rounded uppercase tracking-tight">
                            {node.question_tag}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 bg-white/50 p-2 rounded-lg border border-slate-50">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="text-xs text-slate-700 italic">"{node.patient_answer}"</p>
                            <p className="text-[11px] text-slate-500 leading-normal">{node.clinical_reasoning}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {decisionChain.differentials.length > 0 && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      Current Differentials
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {decisionChain.differentials.map((d, i) => (
                        <span key={i} className="px-2 py-1 bg-white border border-amber-200 text-[11px] font-bold text-amber-900 rounded-lg shadow-sm">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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

