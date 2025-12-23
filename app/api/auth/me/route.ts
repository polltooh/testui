import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessions';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') ||
      request.cookies.get('alphadx_session')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Call Backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${backendUrl}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Invalid or expired session' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        user: {
          id: data.id,
          email: data.email,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.email,
          firstName: data.first_name || 'Geoff',
          lastName: data.last_name || 'Doe',
          zipcode: data.zipcode || '10001',
          gender: data.gender || 'male',
          dateOfBirth: data.date_of_birth || '1990-01-01',
          language: data.language || 'en'
        },
      });

    } catch (backendError) {
      console.error('Backend connection error:', backendError);
      return NextResponse.json(
        { error: 'Failed to connect to authentication server' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') ||
      request.cookies.get('alphadx_session')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${backendUrl}/api/v1/auth/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: body.firstName,
          last_name: body.lastName,
          zipcode: body.zipcode,
          gender: body.gender,
          date_of_birth: body.dateOfBirth,
          language: body.language
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.detail || 'Failed to update profile' },
          { status: response.status }
        );
      }

      return NextResponse.json({
        user: {
          id: data.id,
          email: data.email,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.email,
          firstName: data.first_name || 'Geoff',
          lastName: data.last_name || 'Doe',
          zipcode: data.zipcode || '10001',
          gender: data.gender || 'male',
          dateOfBirth: data.date_of_birth || '1990-01-01',
          language: data.language || 'en'
        },
      });

    } catch (backendError) {
      console.error('Backend connection error:', backendError);
      return NextResponse.json(
        { error: 'Failed to connect to authentication server' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
