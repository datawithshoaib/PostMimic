"use client";

import React from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  Layout, 
  Clock, 
  UserCheck, 
  MessageSquare, 
  Zap,
  Info,
  ChevronDown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CRITERIA_METADATA = {
  hook: {
    label: 'Hook Stopping Power',
    desc: 'First 1-2 lines grab mobile thumb-scroll attention before the fold',
    icon: Zap,
    passTip: 'Strong contrast or counter-intuitive statement captures curiosity.',
    failTip: 'Hook is too long or generic. Needs more tension, curiosity, or bold stance.'
  },
  clear_value: {
    label: 'Clear Core Takeaway',
    desc: 'Punchy insight without corporate fluff or business buzzwords',
    icon: Sparkles,
    passTip: 'The central lesson is crisp, actionable, and memorable.',
    failTip: 'Core takeaway gets buried in preamble. Clarify the single most valuable lesson.'
  },
  skimmability: {
    label: 'Whitespace Spacing',
    desc: '1-2 sentences per paragraph break for comfortable phone scanning',
    icon: Layout,
    passTip: 'Generous blank line breaks allow effortless mobile reading.',
    failTip: 'Paragraphs are too dense. Break 3+ sentence blocks into 1-2 sentence bites.'
  },
  length_pacing: {
    label: 'Length & Cadence',
    desc: 'Balanced rhythm with zero filler and steady narrative pacing',
    icon: Clock,
    passTip: 'Pacing builds tension cleanly and resolves with punch.',
    failTip: 'Cadence drags or word count overextends. Tighten the middle section.'
  },
  tone_authenticity: {
    label: 'Authentic Voice',
    desc: 'Matches creator persona, vulnerability, and honest lived experience',
    icon: UserCheck,
    passTip: 'Feels like a genuine human mentor sharing real-life experience.',
    failTip: 'Sounds too sterile or robotic. Inject personal reflection and honesty.'
  },
  cta_ending: {
    label: 'Ending CTA Question',
    desc: 'Conversational wrap-up sparking replies in the comment feed',
    icon: MessageSquare,
    passTip: 'Open-ended question invites readers to share their personal perspective.',
    failTip: 'Missing or weak question. Conclude with a direct prompt encouraging replies.'
  }
};

export default function ReviewerMatrix({ criteria = {} }) {
  const keys = ['hook', 'clear_value', 'skimmability', 'length_pacing', 'tone_authenticity', 'cta_ending'];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs pb-1">
        <span className="font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>6-Factor Editorial Audit Checklist</span>
        </span>
        <span className="text-[11px] text-slate-400 font-mono">
          Click any factor for editorial notes
        </span>
      </div>

      <Accordion type="multiple" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {keys.map((key) => {
          const item = CRITERIA_METADATA[key];
          const isPassed = criteria[key] ?? true;
          const Icon = item.icon;

          return (
            <AccordionItem
              key={key}
              value={key}
              className={`rounded-2xl border transition-all duration-200 px-3 py-0.5 ${
                isPassed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/50'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-300 hover:border-rose-500/50'
              }`}
            >
              <AccordionTrigger className="py-2.5 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-2 text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`} />
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {item.label}
                    </span>
                  </div>

                  <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold shadow-sm ${
                    isPassed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {isPassed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <X className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-0 pb-2.5 text-[11px] text-slate-400 border-t border-slate-800/60 mt-1">
                <p className="mb-1 text-slate-300">{item.desc}</p>
                <div className={`p-2 rounded-xl text-[10px] leading-tight ${
                  isPassed 
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/20' 
                    : 'bg-rose-950/40 text-rose-300 border border-rose-500/20'
                }`}>
                  <strong>Audit Advice: </strong>{isPassed ? item.passTip : item.failTip}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
