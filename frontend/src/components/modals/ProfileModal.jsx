import React, { useState, useEffect } from 'react';
import { X, User, Check } from 'lucide-react';

export default function ProfileModal({
  isOpen,
  onClose,
  user,
  onUpdateProfile,
  isLoading
}) {
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setHeadline(user.headline || '');
      setAvatarUrl(user.avatar_url || '');
      setLinkedinUrl(user.linkedin_url || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile({
      full_name: fullName.trim(),
      headline: headline.trim(),
      avatar_url: avatarUrl.trim(),
      linkedin_url: linkedinUrl.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-6 sm:p-7 rounded-3xl border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Edit Profile & Persona Brand</h3>
            <p className="text-xs text-slate-400">
              Customize how your author info appears on LinkedIn live preview
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#090e1c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              LinkedIn Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Founder @ Codebasics | 150K+ LinkedIn"
              className="w-full bg-[#090e1c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-[#090e1c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/username"
              className="w-full bg-[#090e1c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-500/25 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
