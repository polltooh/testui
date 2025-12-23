'use client';
import Register from '@/components/auth/register';
import { useAuth } from '@/app/auth-context';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = (email: string, userData?: { email: string; name: string }) => {
    login(email, userData);
    router.push('/');
  };

  return <Register onRegister={handleRegister} />;
}

