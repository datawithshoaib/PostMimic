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
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function StyleTab({
  styleProfile,
  onReanalyzeStyle,
  isReanalyzing
}) {
  const p = styleProfile || {};

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <Card className="border-slate-800/90 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-sky-500/10 via-blue-500/5 to-transparent pointer-events-none"></div>
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm shrink-0">
              <Dna className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Writing Style DNA & Persona
                </h1>
                <Badge variant="success" className="font-mono text-xs font-semibold gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Trained from 10–15 Posts
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Reverse-engineered by Groq LLM to clone your authentic voice, paragraph spacing cadence, first-line hook patterns, and comment-generating CTAs.
              </p>
            </div>
          </div>

          <Button
            variant="gradient"
            size="default"
            onClick={onReanalyzeStyle}
            disabled={isReanalyzing}
            className="gap-2 shrink-0 font-bold"
          >
            <Sparkles className={`w-4 h-4 ${isReanalyzing ? 'animate-spin' : ''}`} />
            <span>{isReanalyzing ? 'Re-analyzing Posts...' : 'Re-Extract Style DNA'}</span>
          </Button>
        </CardContent>
      </Card>

      {/* Style DNA Grid (6 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Card 1: Persona Archetype */}
        <Card className="border-slate-800/90 hover:border-sky-500/40 transition-all duration-200 shadow-lg group">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Persona Archetype
                </span>
                <CardTitle className="text-sm">
                  {p.persona_name || 'Empathetic Realist & Career Coach'}
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5">
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {p.tone_summary || 'Vulnerable, brutally honest, conversational, anti-corporate jargon, deeply relatable and encouraging.'}
            </p>

            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-semibold block">Language Blend:</span>
              <p className="text-xs text-sky-300 mt-0.5">
                Conversational English with occasional authentic Hinglish idioms & relatable metaphors
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Hook Formula */}
        <Card className="border-slate-800/90 hover:border-amber-500/40 transition-all duration-200 shadow-lg group">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Hook Formula
                </span>
                <CardTitle className="text-sm">
                  Scroll-Stopping Opening
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5">
            <p className="text-xs text-slate-300 leading-relaxed">
              {p.hook_style || 'Direct provocation, relatable jobseeker pain-point, or contrasting counter-intuitive observation.'}
            </p>

            <div className="p-3 rounded-xl bg-[#070c17] border border-slate-800/90 text-[11px] text-amber-300/90 italic shadow-inner">
              "Looking for jobs on LinkedIn is like online dating: Full of promises, but in the end, you’re just left ghosted."
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Whitespace Anatomy */}
        <Card className="border-slate-800/90 hover:border-emerald-500/40 transition-all duration-200 shadow-lg group">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Whitespace Anatomy
                </span>
                <CardTitle className="text-sm">
                  Formatting & Skimmability
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5">
            <p className="text-xs text-slate-300 leading-relaxed">
              {p.structure_rules || '1-2 lines per paragraph. Generous blank line breaks. High mobile skimmability designed for the thumb-scroll.'}
            </p>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
              <span className="text-slate-400 font-medium">Avg. Line Count per Post:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {p.avg_line_count || 6.8} lines
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Emoji & Hashtags */}
        <Card className="border-slate-800/90 hover:border-purple-500/40 transition-all duration-200 shadow-lg group">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <Hash className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Visual Discipline
                </span>
                <CardTitle className="text-sm">
                  Emoji & Hashtag Strategy
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Emoji Strategy:</span>
              <p className="text-xs text-slate-300 mt-0.5">
                {p.emoji_strategy || 'Sparse and warm (1-2 maximum, e.g. 🌻, 💔) used for emotional accent, never spammy.'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-semibold block">Hashtag Policy:</span>
              <p className="text-xs text-purple-300 mt-0.5">
                {p.hashtag_strategy || 'Zero hashtags (strictly clean organic approach for higher feed reach).'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Ending CTA */}
        <Card className="border-slate-800/90 hover:border-pink-500/40 transition-all duration-200 shadow-lg group">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Ending CTA
                </span>
                <CardTitle className="text-sm">
                  Engagement Conversion
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3.5">
            <p className="text-xs text-slate-300 leading-relaxed">
              {p.call_to_action_style || 'Ends with a heartfelt encouragement or an open-ended question prompting readers to share their stories in comments.'}
            </p>

            <div className="p-3 rounded-xl bg-[#070c17] border border-slate-800/90 text-[11px] text-pink-300/90 italic shadow-inner">
              "Your dream job will come, but for now, breathe. 🌻"
            </div>
          </CardContent>
        </Card>

        {/* Card 6: Top Themes & Content Pillars */}
        <Card className="border-slate-800/90 hover:border-blue-500/40 transition-all duration-200 shadow-lg group">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Core Content Pillars
                </span>
                <CardTitle className="text-sm">
                  Signature Themes
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(p.top_themes || ['Career Advice', 'Job Search Realities', 'Mental Health', 'Anti-Hustle', 'Skill Growth']).map((theme, i) => (
                <Badge
                  key={i}
                  variant="subtleSky"
                  className="text-xs font-semibold"
                >
                  #{theme}
                </Badge>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800/80">
              These themes trigger high resonance and are referenced when Writer Agent selects few-shot training examples.
            </p>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
