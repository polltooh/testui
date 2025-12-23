import { useState, useRef } from 'react';
import { getCurrentToken } from '../lib/temp-token';

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export function useChatMessages(
  chatHistory: ChatMessage[],
  setChatHistory: (history: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void,
  isAuthenticated: boolean,
  fetchSessions: () => void
) {
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const aiMessageAddedRef = useRef(false);

  const loadSessionMessages = async (sessionIdToLoad: string) => {
    if (!isAuthenticated) return;
    try {
      const token = getCurrentToken();
      if (!token) return;

      const response = await fetch(`/api/chat/sessions/${sessionIdToLoad}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const messages = await response.json();
        // Convert messages to chat history format
        const history = messages.map((msg: any) => ({
          role: msg.role === 'assistant' ? 'ai' : msg.role,
          content: msg.content
        }));
        setChatHistory(history);
        setSessionId(sessionIdToLoad);
      }
    } catch (error) {
      console.error('Error loading session messages:', error);
    }
  };

  const handleSendMessage = async (
    message: string,
    isDiagnosisMode: boolean,
    setMessage: (msg: string) => void
  ) => {
    // Allow empty message only if we're switching to diagnosis mode
    // This triggers the greeting message (works for both new and existing sessions)
    const isModeSwitchTrigger = !message.trim() && isDiagnosisMode;

    if ((!message.trim() && !isModeSwitchTrigger) || isTyping) {
      return;
    }

    // For mode switch trigger, don't add placeholder if chat history is empty
    // The greeting will be the first message
    if (!isModeSwitchTrigger) {
      const newUserMessage: ChatMessage = { role: 'user', content: message };
      setChatHistory(prev => [...prev, newUserMessage]);
      setMessage('');
    } else if (chatHistory.length > 0) {
      // Only add placeholder if there's existing chat history
      // This will be removed when greeting arrives
      setChatHistory(prev => [...prev, { role: 'user', content: 'Start Self-diagnosis Mode' }]);
    }
    setIsTyping(true);

    try {
      const token = getCurrentToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const isNewSession = !sessionId;
      const endpoint = sessionId
        ? `/api/chat/message`
        : `/api/chat/start`;

      // For mode switch, send empty string; for real messages, use the message content
      const messageToSend = isModeSwitchTrigger ? "" : message;

      const body = sessionId
        ? {
          session_id: sessionId,
          input_message: messageToSend,
          workflow_type: isDiagnosisMode ? 'intake' : 'normal'
        }
        : {
          input_message: messageToSend,
          workflow_type: isDiagnosisMode ? 'intake' : 'normal'
        };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        let errorMessage = `Failed to send message (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Reset the ref for this new message
      aiMessageAddedRef.current = false;

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';
      let isFirstChunk = !sessionId;
      let hasContent = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        let processedChunk = chunk;
        if (isFirstChunk) {
          const separatorIndex = chunk.indexOf('[SESSION_ID_END]');
          if (separatorIndex !== -1) {
            const sessionDataStr = chunk.substring(0, separatorIndex);
            try {
              const sessionData = JSON.parse(sessionDataStr);
              if (sessionData.session_id) {
                setSessionId(sessionData.session_id);
              }
            } catch (e) {
              console.error('Failed to parse session ID', e);
            }
            processedChunk = chunk.substring(separatorIndex + '[SESSION_ID_END]'.length);
            isFirstChunk = false;
          }
        }

        if (processedChunk) {
          aiContent += processedChunk;

          if (!hasContent && aiContent.trim()) {
            hasContent = true;
            // For mode switch triggers, ensure we add the AI message immediately when we get content
            if (isModeSwitchTrigger && !aiMessageAddedRef.current) {
              aiMessageAddedRef.current = true;
              setChatHistory(prev => [...prev, { role: 'ai', content: '' }]);
            }
          }

          if (hasContent && !aiMessageAddedRef.current) {
            aiMessageAddedRef.current = true;
            setChatHistory(prev => [...prev, { role: 'ai', content: '' }]);
          }

          if (aiMessageAddedRef.current) {
            setChatHistory(prev => {
              if (prev.length === 0) return prev;
              const newHistory = [...prev];
              const lastIndex = newHistory.length - 1;
              if (newHistory[lastIndex] && newHistory[lastIndex].role === 'ai') {
                newHistory[lastIndex] = {
                  role: 'ai',
                  content: aiContent.replace('\n[DIAGNOSIS_GENERATED]', '')
                };
              }
              return newHistory;
            });
          }
        }
      }

      // Final update
      if (aiMessageAddedRef.current) {
        setChatHistory(prev => {
          if (prev.length === 0) return prev;
          const newHistory = [...prev];
          const lastIndex = newHistory.length - 1;
          if (newHistory[lastIndex] && newHistory[lastIndex].role === 'ai') {
            newHistory[lastIndex] = {
              role: 'ai',
              content: aiContent.replace('\n[DIAGNOSIS_GENERATED]', '')
            };
          }
          return newHistory;
        });
      } else if (aiContent.trim()) {
        // For mode switch, add the greeting message directly
        setChatHistory(prev => [...prev, {
          role: 'ai',
          content: aiContent.replace('\n[DIAGNOSIS_GENERATED]', '')
        }]);
      }

      // Keep the "Start Self-diagnosis Mode" message visible - don't remove it

      // Refresh sessions if a new session was created
      if (isModeSwitchTrigger && !sessionId && isAuthenticated) {
        fetchSessions();
      }

      setIsTyping(false);

      if (isAuthenticated && isNewSession) {
        fetchSessions();
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Unknown error occurred';
      setChatHistory(prev => [
        ...prev,
        {
          role: 'ai',
          content: `Sorry, I encountered an error: ${errorMessage}. Please check your connection and try again.`
        }
      ]);
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setChatHistory([]);
    setSessionId(null);
    localStorage.removeItem('alphadx_guest_history');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    isTyping,
    sessionId,
    loadSessionMessages,
    handleSendMessage,
    handleNewChat
  };
}

