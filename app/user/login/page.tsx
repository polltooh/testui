'use client';
import Login from '@/components/auth/login';
import { useAuth } from '@/app/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const verified = searchParams.get('verified');
  const error = searchParams.get('error');

  const successMessage = verified === 'true'
    ? 'Email verified successfully! You can now log in.'
    : undefined;

  let errorMessage = undefined;
  if (error === 'verification_failed') {
    errorMessage = 'Email verification failed. The link may have expired or is invalid.';
  } else if (error === 'server_error') {
    errorMessage = 'An error occurred during verification. Please try again later.';
  }

  const handleLogin = (email: string, userData?: { email: string; name: string }) => {
    login(email, userData);
    router.push('/');
  };

  return <Login onLogin={handleLogin} successMessage={successMessage} errorMessage={errorMessage} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

