import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // Backend URL
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

  try {
    // Proxy request to backend
    const response = await fetch(`${backendUrl}/api/v1/auth/verify/${token}`, {
      method: 'GET',
    });

    // Construct the redirect URL base (frontend)
    const frontendBaseUrl = new URL(request.url).origin;

    if (response.ok) {
      // Verification successful
      return NextResponse.redirect(`${frontendBaseUrl}/user/login?verified=true`);
    } else {
      // Verification failed
      return NextResponse.redirect(`${frontendBaseUrl}/user/login?error=verification_failed`);
    }

  } catch (error) {
    console.error('Verification proxy error:', error);
    const frontendBaseUrl = new URL(request.url).origin;
    return NextResponse.redirect(`${frontendBaseUrl}/user/login?error=server_error`);
  }
}
