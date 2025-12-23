/**
 * Utility functions for managing temporary user tokens
 */

const TEMP_TOKEN_KEY = 'alphadx_temp_token';

/**
 * Generate a UUID v4 token
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get or create a temporary token for guest users
 */
export function getOrCreateTempToken(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // Check if user has a real auth token
  const authToken = localStorage.getItem('alphadx_token');
  if (authToken) {
    // User is authenticated, don't use temp token
    return '';
  }

  // Check if we already have a temp token
  let tempToken = localStorage.getItem(TEMP_TOKEN_KEY);
  if (!tempToken) {
    // Generate a new temp token
    tempToken = generateUUID();
    localStorage.setItem(TEMP_TOKEN_KEY, tempToken);
  }

  return tempToken;
}

/**
 * Clear the temporary token
 */
export function clearTempToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TEMP_TOKEN_KEY);
  }
}

/**
 * Get the current token (auth token or temp token)
 */
export function getCurrentToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Prefer auth token over temp token
  const authToken = localStorage.getItem('alphadx_token');
  if (authToken) {
    return authToken;
  }

  return getOrCreateTempToken() || null;
}

