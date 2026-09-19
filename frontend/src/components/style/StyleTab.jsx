import React from 'react';
import { 
  Dna, 
  Sparkles, 
  Zap, 
  Layout, 
  Hash, 
  MessageCircle, 
  Tag, 
  UserCheck, 
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function StyleTab({
  styleProfile,
  onReanalyzeStyle,
  isReanalyzing
}) {
  const p = styleProfile || {};

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#101628] via-[#161f36] to-[#101628] border border-slate-800 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Writing Style DNA & Persona
              </h1>
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Trained from 10–15 Posts
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Reverse-engineered by Groq LLM to clone your authentic voice, paragraph spacing rhythm, first-line hook patterns, and comment-generating CTAs.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReanalyzeStyle}
          disabled={isReanalyzing}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-sky-500/25 shrink-0"
        >
          <Sparkles className={`w-4 h-4 ${isReanalyzing ? 'animate-spin' : ''}`} />
          <span>{isReanalyzing ? 'Re-analyzing Posts...' : 'Re-Extract Style Persona'}</span>
        </button>
      </div>

      {/* Style DNA Grid (6 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Card 1: Persona Archetype */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl space-y-4 hover:border-sky-500/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Persona Archetype
              </span>
              <h3 className="text-sm font-bold text-white">
                {p.persona_name || 'Empathetic Realist & Career Coach'}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {p.tone_summary || 'Vulnerable, brutally honest, conversational, anti-corporate jargon, deeply relatable and encouraging.'}
          </p>

          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-semibold block">Language Blend:</span>
            <p className="text-xs text-sky-300 mt-0.5">
              Conversational English with occasional authentic Hinglish idioms & relatable metaphors
            </p>
          </div>
        </div>

        {/* Card 2: Hook Formula */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl space-y-4 hover:border-amber-500/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Hook Formula
              </span>
              <h3 className="text-sm font-bold text-white">
                Scroll-Stopping Opening
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {p.hook_style || 'Direct provocation, relatable jobseeker pain-point, or contrasting counter-intuitive observation.'}
          </p>

          <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800/90 text-[11px] text-amber-300/90 italic">
            "Looking for jobs on LinkedIn is like online dating: Full of promises, but in the end, you’re just left ghosted."
          </div>
        </div>

        {/* Card 3: Whitespace Anatomy */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Whitespace Anatomy
              </span>
              <h3 className="text-sm font-bold text-white">
                Formatting & Skimmability
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {p.structure_rules || '1-2 lines per paragraph. Generous blank line breaks. High mobile skimmability designed for the thumb-scroll.'}
          </p>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 font-medium">Avg. Line Count per Post:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {p.avg_line_count || 6.8} lines
            </span>
          </div>
        </div>

        {/* Card 4: Emoji & Hashtags */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl space-y-4 hover:border-purple-500/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Visual Discipline
              </span>
              <h3 className="text-sm font-bold text-white">
                Emoji & Hashtag Strategy
              </h3>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">Emoji Strategy:</span>
            <p className="text-xs text-slate-300 mt-0.5">
              {p.emoji_strategy || 'Sparse and warm (1-2 maximum, e.g. 🌻, 💔) used for emotional accent, never spammy.'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-semibold block">Hashtag Policy:</span>
            <p className="text-xs text-purple-300 mt-0.5">
              {p.hashtag_strategy || 'Zero hashtags (strictly clean organic approach for higher organic reach).'}
            </p>
          </div>
        </div>

        {/* Card 5: Ending CTA */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl space-y-4 hover:border-pink-500/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Ending CTA
              </span>
              <h3 className="text-sm font-bold text-white">
                Engagement Conversion
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {p.call_to_action_style || 'Ends with a heartfelt encouragement or an open-ended question prompting readers to share their stories in comments.'}
          </p>

          <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800/90 text-[11px] text-pink-300/90 italic">
            "Your dream job will come, but for now, breathe. 🌻"
          </div>
        </div>

        {/* Card 6: Top Themes & Content Pillars */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl space-y-4 hover:border-blue-500/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Core Content Pillars
              </span>
              <h3 className="text-sm font-bold text-white">
                Signature Themes
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {(p.top_themes || ['Career Advice', 'Job Search Realities', 'Mental Health', 'Anti-Hustle', 'Skill Growth']).map((theme, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-semibold"
              >
                #{theme}
              </span>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800/80">
            These themes trigger high resonance and are referenced when Writer Agent selects few-shot training examples.
          </p>
        </div>

      </div>

    </div>
  );
}
