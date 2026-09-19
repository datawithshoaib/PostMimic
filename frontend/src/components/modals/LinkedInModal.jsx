import React, { useState } from 'react';
import { X, Linkedin, Sparkles, Check, ArrowRight, User } from 'lucide-react';

export default function LinkedInModal({
  isOpen,
  onClose,
  onExtractUrl,
  onSelectPreset,
  onImportCustomPosts,
  isLoading
}) {
  const [url, setUrl] = useState('');
  const [customPostsText, setCustomPostsText] = useState('');

  if (!isOpen) return null;

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onExtractUrl(url.trim());
  };

  const handleCustomPostsSubmit = (e) => {
    e.preventDefault();
    if (!customPostsText.trim()) return;
    const posts = customPostsText
      .split('\n---\n')
      .map((p) => p.trim())
      .filter(Boolean);

    onImportCustomPosts(posts.length > 0 ? posts : [customPostsText.trim()]);
  };

  const presets = [
    {
      key: 'tech_educator',
      name: 'Mohan Sharma',
      role: 'Tech Educator & Mentor',
      badge: '10 Authentic Posts',
      color: 'text-sky-400 border-sky-500/30'
    },
    {
      key: 'ai_founder',
      name: 'Sarah Chen',
      role: 'AI Agent Founder',
      badge: '10 AI Agent Posts',
      color: 'text-emerald-400 border-emerald-500/30'
    },
    {
      key: 'growth_creator',
      name: 'Arjun Mehta',
      role: 'B2B SaaS Growth Lead',
      badge: '10 High-Growth Posts',
      color: 'text-purple-400 border-purple-500/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-6 sm:p-7 rounded-3xl border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-[#0a66c2]/20 text-sky-400 border border-sky-500/30">
            <Linkedin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Connect LinkedIn & Sync 10–15 Posts
            </h3>
            <p className="text-xs text-slate-400">
              Extract historic posts to train your autonomous Style Persona
            </p>
          </div>
        </div>

        <div className="space-y-5">
          
          {/* Option 1: Profile URL */}
          <div className="p-4 rounded-2xl bg-[#090e1c] border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200 block">
              Method 1: Extract from Profile URL
            </span>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/your-profile"
                className="flex-1 bg-[#050811] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shrink-0 disabled:opacity-50"
              >
                {isLoading ? 'Extracting...' : 'Extract'}
              </button>
            </form>
          </div>

          {/* Option 2: Instant Persona Presets */}
          <div>
            <span className="text-xs font-bold text-slate-200 block mb-2">
              Method 2: Select an Instant Creator Persona
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {presets.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => onSelectPreset(preset.key)}
                  disabled={isLoading}
                  className="p-3.5 rounded-xl bg-[#090e1c] hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 text-left transition-all group"
                >
                  <span className="text-xs font-bold text-white block group-hover:text-sky-300">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {preset.role}
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded mt-2 inline-block bg-slate-800 ${preset.color}`}>
                    {preset.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Option 3: Bulk Paste */}
          <div className="p-4 rounded-2xl bg-[#090e1c] border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200 block">
              Method 3: Direct Past Post Paste (Separated by ---)
            </span>
            <textarea
              rows={4}
              value={customPostsText}
              onChange={(e) => setCustomPostsText(e.target.value)}
              placeholder="Paste 10-15 past posts separated by '---' on a new line..."
              className="w-full bg-[#050811] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none resize-none"
            />
            <button
              type="button"
              onClick={handleCustomPostsSubmit}
              disabled={isLoading || !customPostsText.trim()}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all disabled:opacity-50"
            >
              Import Pasted Posts & Re-train Style DNA
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
