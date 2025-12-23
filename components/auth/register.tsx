'use client';
import React, { useState } from 'react';
import { Mail, Lock, UserPlus, User } from 'lucide-react';
import Link from 'next/link';

interface RegisterProps {
  onRegister: (email: string, userData?: { email: string; name: string }) => void;
}

export default function Register({ onRegister }: RegisterProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [zipcode, setZipcode] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [language, setLanguage] = useState('en');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!firstName.trim()) {
      setError('Please enter your first name');
      return;
    }

    if (!lastName.trim()) {
      setError('Please enter your last name');
      return;
    }

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!zipcode.trim()) {
      setError('Please enter your zipcode');
      return;
    }

    if (!gender) {
      setError('Please select your gender');
      return;
    }

    if (!dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: `${firstName.trim()} ${lastName.trim()}`,
          zipcode,
          gender,
          date_of_birth: dateOfBirth,
          language,
          base_url: window.location.origin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Registration successful - Show success message instead of auto-login
      setIsLoading(false);
      setSuccess(true);

    } catch {
      setIsLoading(false);
      setError('Network error. Please check your connection and try again.');
    }
  };

  if (success) {
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
          
          .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `}</style>
        <div className="w-full max-w-md fade-in-up">
          <div className="text-center mb-8">
            <h1 className="brand-font text-4xl font-bold text-slate-900 tracking-tight mb-2">
              Alpha<span className="text-cyan-600">DX</span>
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-8 text-center">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-cyan-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">Check your email</h2>
            <p className="text-slate-600 mb-8">
              We've sent a verification link to <span className="font-semibold text-slate-900">{email}</span>.
              Please click the link to verify your account and continue.
            </p>

            <Link
              href="/user/login"
              className="
                inline-block
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
              "
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="w-full max-w-2xl fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="brand-font text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Alpha<span className="text-cyan-600">DX</span>
          </h1>
          <p className="text-slate-600 text-sm">Create your account</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name Field */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
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



            {/* Last Name Field */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
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

            {/* Zipcode Field */}
            <div>
              <label htmlFor="zipcode" className="block text-sm font-medium text-slate-700 mb-2">
                Zipcode
              </label>
              <div className="relative">
                <input
                  id="zipcode"
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  placeholder="12345"
                  className="
                    w-full px-4 py-3
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

            {/* Gender Field */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-2">
                Gender
              </label>
              <div className="relative">
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="
                    w-full px-4 py-3
                    bg-white
                    border-2 border-slate-200
                    rounded-xl
                    text-slate-900
                    focus:outline-none focus:border-cyan-400
                    input-glow
                    transition-all duration-300
                    text-base appearance-none
                  "
                  disabled={isLoading}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Date of Birth Field */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="
                    w-full px-4 py-3
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

            {/* Language Field */}
            <div className="md:col-span-2">
              <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-2">
                Preferred Language
              </label>
              <div className="relative">
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="
                    w-full px-4 py-3
                    bg-white
                    border-2 border-slate-200
                    rounded-xl
                    text-slate-900
                    focus:outline-none focus:border-cyan-400
                    input-glow
                    transition-all duration-300
                    text-base appearance-none
                  "
                  disabled={isLoading}
                >
                  <option value="en">English</option>
                  <option value="zh">Chinese</option>
                  <option value="es">Spanish</option>
                </select>
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
                  placeholder="At least 6 characters"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
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
              <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="md:col-span-2">
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              Already have an account?{' '}
              <Link
                href="/user/login"
                className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

