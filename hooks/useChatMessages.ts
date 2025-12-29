import { useState, useRef } from 'react';
import { getCurrentToken } from '../lib/temp-token';

export interface ChatMessage {
  role: 'user' | 'ai' | 'system';
  content: string;
  meta_data?: any;
}

export function useChatMessages(
  chatHistory: ChatMessage[],
  setChatHistory: (history: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void,
  isAuthenticated: boolean,
  fetchSessions: () => void
) {
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [decisionChain, setDecisionChain] = useState<any | null>(null);
  const [isFetchingChain, setIsFetchingChain] = useState(false);
  const aiMessageAddedRef = useRef(false);

  const fetchDecisionChain = async (sid: string) => {
    try {
      const token = getCurrentToken();
      if (!token) return;

      setIsFetchingChain(true);
      const response = await fetch(`/api/chat/sessions/${sid}/decision-chain`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDecisionChain(data);
      }
    } catch (error) {
      console.error('Error fetching decision chain:', error);
    } finally {
      setIsFetchingChain(false);
    }
  };

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
          role: msg.role === 'assistant' ? 'ai' :
            msg.role === 'system' ? 'system' :
              msg.role,
          content: msg.content,
          meta_data: msg.meta_data
        }));
        setChatHistory(history);
        setSessionId(sessionIdToLoad);

        // Also fetch decision chain for existing intake sessions
        fetchDecisionChain(sessionIdToLoad);
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
    const isModeSwitchTrigger = !message.trim() && isDiagnosisMode;

    if ((!message.trim() && !isModeSwitchTrigger) || isTyping) {
      return;
    }

    if (!isModeSwitchTrigger) {
      const newUserMessage: ChatMessage = { role: 'user', content: message };
      setChatHistory(prev => [...prev, newUserMessage]);
      setMessage('');
    } else if (chatHistory.length > 0) {
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

      aiMessageAddedRef.current = false;

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';
      let isFirstChunk = !sessionId;
      let hasContent = false;
      let finalSessionId = sessionId;

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
                finalSessionId = sessionData.session_id;
                setSessionId(finalSessionId);
              }
            } catch (e) {
              console.error('Failed to parse session ID', e);
            }
            processedChunk = chunk.substring(separatorIndex + '[SESSION_ID_END]'.length);
            isFirstChunk = false;
          }
        }

        if (processedChunk) {
          if (processedChunk.includes('__SYSTEM_EVENT:MODE_SWITCH:INTAKE__')) {
            processedChunk = processedChunk.replace('__SYSTEM_EVENT:MODE_SWITCH:INTAKE__', '').trim();
            setChatHistory(prev => {
              const filtered = prev.filter(m => m.content !== 'Start Self-diagnosis Mode');
              return [...filtered, { role: 'system', content: '__SYSTEM_EVENT:MODE_SWITCH:INTAKE__' }];
            });
            aiMessageAddedRef.current = false;
            aiContent = '';
          }

          if (processedChunk) {
            aiContent += processedChunk;
            if (!hasContent && aiContent.trim()) {
              hasContent = true;
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
                    ...newHistory[lastIndex],
                    content: aiContent.replace('\n[DIAGNOSIS_GENERATED]', '')
                  };
                }
                return newHistory;
              });
            }
          }
        }
      }

      if (aiMessageAddedRef.current) {
        setChatHistory(prev => {
          if (prev.length === 0) return prev;
          const newHistory = [...prev];
          const lastIndex = newHistory.length - 1;
          if (newHistory[lastIndex] && newHistory[lastIndex].role === 'ai') {
            newHistory[lastIndex] = {
              ...newHistory[lastIndex],
              content: aiContent.replace('\n[DIAGNOSIS_GENERATED]', '')
            };
          }
          return newHistory;
        });
      } else if (aiContent.trim()) {
        setChatHistory(prev => [...prev, {
          role: 'ai',
          content: aiContent.replace('\n[DIAGNOSIS_GENERATED]', '')
        }]);
      }

      if (isModeSwitchTrigger && !sessionId && isAuthenticated) {
        fetchSessions();
      }

      setIsTyping(false);

      if (isAuthenticated && isNewSession) {
        fetchSessions();
      }

      // Automatically fetch decision chain after message is finished in diagnosis mode
      if (isDiagnosisMode && finalSessionId) {
        fetchDecisionChain(finalSessionId);
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
    setDecisionChain(null);
    localStorage.removeItem('alphadx_guest_history');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    isTyping,
    sessionId,
    decisionChain,
    isFetchingChain,
    loadSessionMessages,
    handleSendMessage,
    handleNewChat
  };
}

