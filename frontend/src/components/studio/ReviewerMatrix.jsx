import React from 'react';
import { Check, X, Sparkles, Layout, Clock, UserCheck, MessageSquare, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ReviewerMatrix({ criteria = {} }) {
  const items = [
    {
      key: 'hook',
      label: 'Hook Stopping Power',
      desc: 'First 1-2 lines grab mobile attention',
      icon: Zap,
      passed: criteria.hook ?? true
    },
    {
      key: 'clear_value',
      label: 'Clear Core Takeaway',
      desc: 'Punchy insight without corporate fluff',
      icon: Sparkles,
      passed: criteria.clear_value ?? true
    },
    {
      key: 'skimmability',
      label: 'Whitespace Spacing',
      desc: '1-2 sentences per paragraph break',
      icon: Layout,
      passed: criteria.skimmability ?? true
    },
    {
      key: 'length_pacing',
      label: 'Length & Cadence',
      desc: 'Balanced rhythm with zero filler',
      icon: Clock,
      passed: criteria.length_pacing ?? true
    },
    {
      key: 'tone_authenticity',
      label: 'Authentic Voice',
      desc: 'Matches creator persona & vulnerability',
      icon: UserCheck,
      passed: criteria.tone_authenticity ?? true
    },
    {
      key: 'cta_ending',
      label: 'Ending CTA Question',
      desc: 'Conversational wrap-up sparking replies',
      icon: MessageSquare,
      passed: criteria.cta_ending ?? true
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {items.map((item) => {
        const Icon = item.icon;
        const isPassed = item.passed;

        return (
          <div
            key={item.key}
            className={`p-3 rounded-2xl border transition-all duration-200 ${
              isPassed
                ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/50'
                : 'bg-rose-950/25 border-rose-500/30 text-rose-300 hover:border-rose-500/50'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5 mb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`} />
                <span className="text-[11px] font-bold text-slate-200 truncate">
                  {item.label}
                </span>
              </div>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold shadow-sm ${
                isPassed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {isPassed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <X className="w-2.5 h-2.5 stroke-[3]" />}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
