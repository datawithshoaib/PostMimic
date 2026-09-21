import React, { useState } from 'react';
import { Sparkles, Play, LogIn, UserPlus, Zap } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        {/* Brand Header */}
        <DialogHeader className="text-center sm:text-center pb-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-extrabold text-white text-center">
            Welcome to Post<span className="text-sky-400">Mimic</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 text-center">
            Autonomous Multi-Agent LinkedIn Post Studio
          </DialogDescription>
        </DialogHeader>

        {/* 1-Click Demo Login Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-blue-950/40 to-indigo-950/40 border border-sky-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-sky-300" />
              Instant 1-Click Demo
            </span>
            <Badge variant="sky" className="text-[10px] font-semibold">
              Ready to Test
            </Badge>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Jump in immediately as <strong>Mohan Sharma</strong> with 10 historic posts and style persona pre-loaded.
          </p>
          <Button
            type="button"
            variant="gradient"
            size="default"
            onClick={onDemoLogin}
            disabled={isLoading}
            className="w-full font-bold shadow-md"
          >
            <span>{isLoading ? 'Signing in...' : 'Launch 1-Click Demo'}</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-2 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative px-3 bg-[#0d1424] text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            Or Account Sign In
          </span>
        </div>

        {/* Form Mode Toggle */}
        <div className="flex rounded-xl bg-[#080d1a] p-1 border border-slate-800">
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
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Rivera"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">LinkedIn Profile URL</label>
              <Input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          )}

          <Button
            type="submit"
            variant="secondary"
            size="default"
            disabled={isLoading}
            className="w-full mt-2 font-bold gap-2"
          >
            {mode === 'login' ? <LogIn className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
            <span>
              {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In to Account' : 'Create Account'}
            </span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
