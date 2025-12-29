import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  decisionChain?: any;
}

export default function ChatMessages({ messages, isTyping, decisionChain }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll immediately on messages or isTyping change
    scrollToBottom();

    // Also scroll on a slight delay to capture any late rendering or images
    const timer = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return null; // Empty state is handled in parent
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto chat-container"
    >
      <div className="max-w-3xl mx-auto space-y-8 p-6 md:p-12 pb-32">
        {(() => {
          const lastAiIndex = [...messages].reverse().findIndex(m => m.role === 'ai');
          const targetIndex = lastAiIndex !== -1 ? messages.length - 1 - lastAiIndex : -1;

          return messages.map((msg, index) => (
            <MessageBubble
              key={index}
              role={msg.role}
              content={msg.content}
              isTyping={msg.role === 'ai' && !msg.content.trim() && isTyping}
              decisionChain={index === targetIndex ? decisionChain : undefined}
            />
          ));
        })()}
        {isTyping && (!messages.length || messages[messages.length - 1].role !== 'ai') && (
          <TypingIndicator />
        )}
        <div ref={messagesEndRef} className="h-0 w-0 overflow-hidden" />
      </div>
    </div>
  );
}

