
// Use NEXT_PUBLIC_ prefix for client-side access in Next.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  is_verified: boolean;
  zipcode?: string | null;
  language?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
}

export interface ApiError {
  detail: string | { msg: string }[];
}

export async function fetchWithAuth(endpoint: string, token: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}
