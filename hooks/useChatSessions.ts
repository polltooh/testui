import { useState, useEffect, useCallback } from 'react';
import { getCurrentToken } from '../lib/temp-token';

export interface Session {
  id: string;
  title: string | null;
  updated_at: string;
}

export function useChatSessions(isAuthenticated: boolean) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const fetchSessions = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingSessions(true);
    try {
      const token = getCurrentToken();
      if (!token) return;

      const response = await fetch(`/api/chat/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions();
    }
  }, [isAuthenticated, fetchSessions]);

  return { sessions, isLoadingSessions, fetchSessions };
}

