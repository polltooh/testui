// Simple in-memory session store
// In production, use Redis or a database for session storage

export interface SessionData {
  userId: string;
  email: string;
  name: string;
}

interface Session {
  token: string;
  data: SessionData;
  createdAt: Date;
  expiresAt: Date;
}

const sessions: Map<string, Session> = new Map();
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Generate a simple token (in production, use JWT)
function generateToken(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

export function createSession(data: SessionData): Session {
  const token = generateToken();
  const now = new Date();
  const session: Session = {
    token,
    data,
    createdAt: now,
    expiresAt: new Date(now.getTime() + SESSION_DURATION),
  };
  sessions.set(token, session);
  
  // Clean up expired sessions periodically
  cleanupExpiredSessions();
  
  return session;
}

export function getSession(token: string): Session | undefined {
  const session = sessions.get(token);
  
  if (!session) {
    return undefined;
  }
  
  // Check if session is expired
  if (new Date() > session.expiresAt) {
    sessions.delete(token);
    return undefined;
  }
  
  return session;
}

export function deleteSession(token: string): boolean {
  return sessions.delete(token);
}

function cleanupExpiredSessions() {
  const now = new Date();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token);
    }
  }
}

// Clean up expired sessions every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredSessions, 60 * 60 * 1000);
}

