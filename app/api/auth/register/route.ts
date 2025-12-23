import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, initializeDefaultUser } from '@/lib/users';
import { createSession } from '@/lib/sessions';

// Initialize default user on first import (server-side only)
initializeDefaultUser();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, zipcode, language, date_of_birth, gender, base_url } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Split name into first and last name if possible
    let first_name = name;
    let last_name = '';
    if (name && name.includes(' ')) {
      const parts = name.split(' ');
      first_name = parts[0];
      last_name = parts.slice(1).join(' ');
    }

    // Call Backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${backendUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          first_name,
          last_name,
          zipcode,
          language,
          date_of_birth,
          gender,
          base_url
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.detail || 'Registration failed' },
          { status: response.status }
        );
      }

      // Registration successful
      // Note: Backend doesn't return a session token on register (email verification needed usually)
      // But for this UI flow, we might need to prompt user to login or handle it.
      // The previous code returned a session token.
      // If we want to auto-login, we would need to call login endpoint, but user might be unverified.

      return NextResponse.json({
        success: true,
        // No token returned yet as email verification might be required.
        // The UI should handle this by showing a "Please verify email" message or redirecting to login.
        message: data.message,
        user: {
          id: data.id,
          email: data.email,
        },
      }, { status: 201 });

    } catch (backendError) {
      console.error('Backend connection error:', backendError);
      return NextResponse.json(
        { error: 'Failed to connect to authentication server' },
        { status: 502 }
      );
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
