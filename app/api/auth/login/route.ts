import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, initializeDefaultUser } from '@/lib/users';
import { createSession } from '@/lib/sessions';

// Initialize default user on first import (server-side only)
initializeDefaultUser();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call Backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${backendUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.detail || 'Login failed' },
          { status: response.status }
        );
      }

      // Return success with session token
      return NextResponse.json({
        success: true,
        token: data.access_token, // Use the access token from backend
        user: {
          id: data.user_id,
          email: data.email,
          // Backend login response doesn't give name, but we can fetch it later or ignore for now
        },
      });

    } catch (backendError) {
      console.error('Backend connection error:', backendError);
      return NextResponse.json(
        { error: 'Failed to connect to authentication server' },
        { status: 502 } // Bad Gateway
      );
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

