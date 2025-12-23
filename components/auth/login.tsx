'use client';
import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import Link from 'next/link';

interface LoginProps {
  onLogin: (email: string, userData?: { email: string; name: string }) => void;
  successMessage?: string;
  errorMessage?: string;
}

export default function Login({ onLogin, successMessage, errorMessage }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(errorMessage || '');
  const [isLoading, setIsLoading] = useState(false);

  // Update error state if prop changes (optional, but good for navigation updates)
  React.useEffect(() => {
    if (errorMessage) setError(errorMessage);
  }, [errorMessage]);


  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('alphadx_token', data.token);
        // Also set as cookie for server-side access
        document.cookie = `alphadx_session=${data.token}; path=/; max-age=${24 * 60 * 60}`;
      }

      setIsLoading(false);
      onLogin(data.user.email, data.user);
    } catch {
      setIsLoading(false);
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Work+Sans:wght@300;400;500;600&display=swap');
        
        * {
          font-family: 'Work Sans', sans-serif;
        }
        
        .brand-font {
          font-family: 'Libre Baskerville', serif;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .slide-in {
          animation: slideIn 0.4s ease-out forwards;
        }
        
        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1),
                      0 0 20px rgba(14, 165, 233, 0.15);
        }
      `}</style>

      <div className="w-full max-w-md fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="brand-font text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Alpha<span className="text-cyan-600">DX</span>
          </h1>
          <p className="text-slate-600 text-sm">Sign in to your account</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm fade-in-up">
            {successMessage}
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="
                    w-full pl-12 pr-4 py-3
                    bg-white
                    border-2 border-slate-200
                    rounded-xl
                    text-slate-900 placeholder-slate-400
                    focus:outline-none focus:border-cyan-400
                    input-glow
                    transition-all duration-300
                    text-base
                  "
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="
                    w-full pl-12 pr-4 py-3
                    bg-white
                    border-2 border-slate-200
                    rounded-xl
                    text-slate-900 placeholder-slate-400
                    focus:outline-none focus:border-cyan-400
                    input-glow
                    transition-all duration-300
                    text-base
                  "
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                bg-slate-900
                hover:bg-black
                text-white
                font-semibold
                py-4
                px-6
                rounded-xl
                transition-all duration-300
                shadow-sm
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              Don&apos;t have an account?{' '}
              <Link
                href="/user/register"
                className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

