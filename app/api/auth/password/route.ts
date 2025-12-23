import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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
    const { currentPassword, newPassword } = body;

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${backendUrl}/api/v1/auth/password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.detail || 'Failed to change password' },
          { status: response.status }
        );
      }

      return NextResponse.json({ success: true, message: 'Password changed successfully' });

    } catch (backendError) {
      console.error('Backend connection error:', backendError);
      return NextResponse.json(
        { error: 'Failed to connect to authentication server' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
