import React, { useState } from 'react';
import { register, login, RegisterData, LoginData } from '../api/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: { id: number; username: string }) => void;
  mode: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, mode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data: RegisterData | LoginData = { username, password };
      const response = mode === 'register' ? await register(data) : await login(data);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onSuccess(response.token, response.user);

      setUsername('');
      setPassword('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/20 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl shadow-[#5B4BFF1A]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              {mode === 'register' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-1 text-xs text-[#475569]">
              {mode === 'register'
                ? 'Pick a unique username and start your first number conversation.'
                : 'Sign in to continue your calculation threads.'}
            </p>
          </div>
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#64748B] hover:bg-[#EEF2FF] hover:text-[#0F172A]"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0F172A]">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none ring-0 transition placeholder:text-[#94A3B8] focus:border-[#5B4BFF] focus:ring-2 focus:ring-[#5B4BFF]/40"
              placeholder="e.g. math_wizard"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#0F172A]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none ring-0 transition placeholder:text-[#94A3B8] focus:border-[#5B4BFF] focus:ring-2 focus:ring-[#5B4BFF]/40"
              placeholder="At least 6 characters"
            />
          </div>
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#5B4BFF] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#5B4BFF55] transition hover:bg-[#4A3DE0] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
