'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Save, UserCircle, LogOut, Lock } from 'lucide-react';
import { useAuth } from '@/app/auth-context';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { userEmail, userData, updateUser, logout } = useAuth();

  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [zipcode, setZipcode] = useState(userData?.zipcode || '');
  const [gender, setGender] = useState(userData?.gender || '');
  const [dateOfBirth, setDateOfBirth] = useState(userData?.dateOfBirth || '');
  const [language, setLanguage] = useState(userData?.language || 'en');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const passwordSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showPasswordChange && passwordSectionRef.current) {
      setTimeout(() => {
        passwordSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showPasswordChange]);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setZipcode(userData.zipcode || '');
      setGender(userData.gender || '');
      setDateOfBirth(userData.dateOfBirth || '');
      setLanguage(userData.language || 'en');
    }
  }, [userData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    const token = localStorage.getItem('alphadx_token');
    if (!token) {
      setError('Session expired. Please login again.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          zipcode,
          gender,
          dateOfBirth,
          language
        }),
      });

      const data = await response.json();

      if (response.ok) {
        updateUser({
          firstName,
          lastName,
          zipcode,
          gender,
          dateOfBirth,
          language
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsLoading(true);

    const token = localStorage.getItem('alphadx_token');
    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 leading-none mb-1">My Profile</h3>
              <p className="text-sm text-slate-500">Manage your account information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-slate-400 font-normal">(Non-editable)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-300" />
                </div>
                <input
                  type="email"
                  value={userEmail || ''}
                  readOnly
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-500 text-base cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="p-firstName" className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>
                <input
                  id="p-firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-cyan-400 transition-all text-base"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="p-lastName" className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <input
                  id="p-lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-cyan-400 transition-all text-base"
                />
              </div>

              {/* Zipcode */}
              <div>
                <label htmlFor="p-zipcode" className="block text-sm font-medium text-slate-700 mb-2">
                  Zipcode
                </label>
                <input
                  id="p-zipcode"
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-cyan-400 transition-all text-base"
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="p-gender" className="block text-sm font-medium text-slate-700 mb-2">
                  Gender
                </label>
                <select
                  id="p-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-cyan-400 transition-all text-base appearance-none bg-no-repeat bg-[right_1rem_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="p-dob" className="block text-sm font-medium text-slate-700 mb-2">
                  Date of Birth
                </label>
                <input
                  id="p-dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-cyan-400 transition-all text-base"
                />
              </div>

              {/* Language */}
              <div>
                <label htmlFor="p-language" className="block text-sm font-medium text-slate-700 mb-2">
                  Language
                </label>
                <select
                  id="p-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-cyan-400 transition-all text-base appearance-none bg-no-repeat bg-[right_1rem_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
                >
                  <option value="en">English</option>
                  <option value="zh">Chinese</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl text-sm">
                Profile updated successfully!
              </div>
            )}

            {/* Change Password Section */}
            <div ref={passwordSectionRef} className="pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>{showPasswordChange ? 'Hide Password Change' : 'Change Password'}</span>
              </button>

              {showPasswordChange && (
                <div className="mt-6 space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-cyan-400 transition-all text-base"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-cyan-400 transition-all text-base"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-cyan-400 transition-all text-base"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl text-sm">
                      Password changed successfully!
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                      className="px-6 py-2 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={async () => {
              await logout();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-2xl transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
