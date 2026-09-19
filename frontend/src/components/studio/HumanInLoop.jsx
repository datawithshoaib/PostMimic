import React, { useState } from 'react';
import { Send, UserCheck, Sparkles, MessageCircle, Flame, Scissors, HeartHandshake } from 'lucide-react';

const QUICK_FEEDBACK_CHIPS = [
  { label: '🔥 Punchier Hook', prompt: 'Make the hook much more provocative and scroll-stopping for mobile users.' },
  { label: '✂️ Shorten Sentences', prompt: 'Trim the body. Ensure strict 1-sentence paragraphs for maximum skimmability.' },
  { label: '❤️ More Vulnerable', prompt: 'Inject more raw personal vulnerability and authenticity from the creator\'s lived experience.' },
  { label: '❓ Better Comment CTA', prompt: 'Replace the closing line with a direct, conversational question that asks readers to comment.' },
  { label: '🚫 Cut Fluff', prompt: 'Eliminate all corporate clichés, generic platitudes, and buzzwords.' },
];

export default function HumanInLoop({ onRefine, isRefining }) {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!feedback.trim() || isRefining) return;
    onRefine(feedback.trim());
    setFeedback('');
  };

  const handleChipClick = (prompt) => {
    setFeedback(prompt);
  };

  return (
    <div className="pt-4 border-t border-slate-800/90 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <div className="p-1 rounded-md bg-purple-500/20 text-purple-400">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <span>Human-in-the-Loop: Guide the Agent Revision</span>
        </label>
        <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
          Instant Agent Rework
        </span>
      </div>

      {/* Quick Suggestion Pills */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK_FEEDBACK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(chip.prompt)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0e1628] hover:bg-purple-950/40 text-slate-300 hover:text-purple-200 border border-slate-800 hover:border-purple-500/30 transition-all"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Feedback Input Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="e.g. Add a 2-line real life failure anecdote before the takeaway..."
          className="flex-1 bg-[#090e1c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={!feedback.trim() || isRefining}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
            !feedback.trim() || isRefining
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/20 hover:scale-[1.02]'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isRefining ? 'Re-drafting...' : 'Refine'}</span>
        </button>
      </form>
    </div>
  );
}
