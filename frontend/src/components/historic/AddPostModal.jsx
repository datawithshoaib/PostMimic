import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

export default function AddPostModal({ isOpen, onClose, onAddPost, isSubmitting }) {
  const [text, setText] = useState('');
  const [engagement, setEngagement] = useState(150);
  const [language, setLanguage] = useState('English');
  const [tagsInput, setTagsInput] = useState('Career, JobSearch');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onAddPost({
      text: text.trim(),
      engagement: parseInt(engagement) || 150,
      language,
      tags: tags.length ? tags : ['Career']
    });

    setText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-6 sm:p-7 rounded-3xl border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Add Historic Post Sample</h3>
            <p className="text-xs text-slate-400">
              Paste a high-performing past post to train your Style Persona
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              LinkedIn Post Content
            </label>
            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your past LinkedIn post text here with its original spacing and line breaks..."
              required
              className="w-full bg-[#090e1c] border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 transition-all resize-none shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estimated Reactions (Likes)
              </label>
              <input
                type="number"
                value={engagement}
                onChange={(e) => setEngagement(e.target.value)}
                className="w-full bg-[#090e1c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#090e1c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
              >
                <option value="English">English</option>
                <option value="Hinglish">Hinglish</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Topic Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Career, AI, Motivation, Leadership"
              className="w-full bg-[#090e1c] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={!text.trim() || isSubmitting}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving & Analyzing...' : 'Add Sample & Retrain Style DNA'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
