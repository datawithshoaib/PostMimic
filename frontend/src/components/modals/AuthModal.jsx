import React, { useState } from 'react';
import { X, Sparkles, Play, LogIn, UserPlus } from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onDemoLogin,
  isLoading
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(email, password);
    } else {
      onRegister({
        email,
        password,
        full_name: fullName,
        linkedin_url: linkedinUrl
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Welcome to Post<span className="text-sky-400">Mimic</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous Multi-Agent LinkedIn Post Studio
          </p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-blue-950/40 to-indigo-950/40 border border-sky-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 fill-sky-300" />
              Instant 1-Click Demo
            </span>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-semibold">
              Ready to Test
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
            Jump in immediately as <strong>Mohan Sharma</strong> with 10 historic posts and style persona pre-loaded.
          </p>
          <button
            type="button"
            onClick={onDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-600/25"
          >
            <span>{isLoading ? 'Signing in...' : 'Launch 1-Click Demo'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative px-3 bg-[#0d1424] text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            Or Account Sign In
          </span>
        </div>

        {/* Form Mode Toggle */}
        <div className="flex rounded-xl bg-[#080d1a] p-1 mb-4 border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full bg-[#090e1c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#090e1c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#090e1c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs text-slate-300 mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-[#090e1c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            {mode === 'login' ? <LogIn className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
            <span>
              {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In to Account' : 'Create Account'}
            </span>
          </button>
        </form>

      </div>
    </div>
  );
}
