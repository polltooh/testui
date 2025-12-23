import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/sessions';

export async function POST(request: NextRequest) {
  try {
    // Backend uses JWT tokens which don't support server-side invalidation easily
    // unless using a blacklist. For now, frontend just drops the token.

    // Clear cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('alphadx_session');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

