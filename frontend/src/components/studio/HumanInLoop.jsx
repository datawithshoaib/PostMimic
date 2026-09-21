import React, { useState } from 'react';
import { Send, UserCheck, Sparkles, Flame, Scissors, HeartHandshake, RefreshCw, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-sm font-bold text-white">Human-in-the-Loop Refinement</span>
            <span className="text-[11px] font-normal text-slate-400">Direct the Writer Agent with manual editorial guidance</span>
          </div>
        </label>
        <Badge variant="purple" className="text-[10px]">
          Instant Agent Rework
        </Badge>
      </div>

      {/* Quick Suggestion Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {QUICK_FEEDBACK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(chip.prompt)}
            className="text-[11px] px-2.5 py-1 rounded-xl bg-[#090e1c] hover:bg-purple-950/40 text-slate-300 hover:text-purple-200 border border-slate-800 hover:border-purple-500/40 transition-all font-medium select-none"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Feedback Input Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="e.g. Add a 2-line real life failure anecdote before the takeaway..."
          className="flex-1 text-xs"
        />
        <Button
          type="submit"
          variant="purple"
          size="default"
          disabled={!feedback.trim() || isRefining}
          className="shrink-0 gap-1.5 font-bold"
        >
          {isRefining ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Re-drafting...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Refine</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
