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
}

export default function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            role={msg.role}
            content={msg.content}
            isTyping={msg.role === 'ai' && !msg.content.trim() && isTyping}
          />
        ))}
        {isTyping && (!messages.length || messages[messages.length - 1].role !== 'ai') && (
          <TypingIndicator />
        )}
      </div>
    </div>
  );
}

