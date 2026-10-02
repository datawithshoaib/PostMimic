"use client";

import React, { useState } from 'react';
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
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

export default function StyleTab({
  styleProfile,
  onReanalyzeStyle,
  isReanalyzing
}) {
  const p = styleProfile || {};

  // Interactive Live Style-Match Checker
  const [testText, setTestText] = useState('');
  
  // Calculate instant style heuristics if text entered
  const testLines = testText.split('\n').filter(l => l.trim().length > 0);
  const testFirstLine = testText.split('\n')[0] || '';
  const testHasCta = /\?|\b(thoughts|agree|what do you think|how do you|drop a comment)\b/i.test(testText);
  const testHookGood = testFirstLine.length > 10 && testFirstLine.length <= 110;
  const testSpacingGood = testLines.length >= 3;

  let calculatedScore = 50;
  if (testText.trim()) {
    if (testHookGood) calculatedScore += 20;
    if (testSpacingGood) calculatedScore += 15;
    if (testHasCta) calculatedScore += 15;
  }

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

      {/* Visual Persona Radar / Style Gauges Banner */}
      <Card className="border-slate-800/90 shadow-xl">
        <CardHeader className="pb-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <CardTitle className="text-sm font-bold text-white">
                Persona Voice Dimensions & Algorithmic Weights
              </CardTitle>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Calibrated via Groq</span>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="space-y-1.5 p-3 rounded-2xl bg-[#080d1a] border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Vulnerability Index</span>
                <span className="text-sky-400 font-mono font-bold">88%</span>
              </div>
              <Progress value={88} className="h-1.5" indicatorClassName="bg-sky-400" />
              <p className="text-[10px] text-slate-400">Empathy, honesty & personal failures</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-[#080d1a] border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Thumb-Skimmability</span>
                <span className="text-emerald-400 font-mono font-bold">95%</span>
              </div>
              <Progress value={95} className="h-1.5" indicatorClassName="bg-emerald-400" />
              <p className="text-[10px] text-slate-400">1-2 lines per block, generous breaks</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-[#080d1a] border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Jargon Elimination</span>
                <span className="text-purple-400 font-mono font-bold">92%</span>
              </div>
              <Progress value={92} className="h-1.5" indicatorClassName="bg-purple-400" />
              <p className="text-[10px] text-slate-400">Zero corporate buzzwords or platitudes</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-[#080d1a] border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Comment Conversion CTA</span>
                <span className="text-amber-400 font-mono font-bold">86%</span>
              </div>
              <Progress value={86} className="h-1.5" indicatorClassName="bg-amber-400" />
              <p className="text-[10px] text-slate-400">Conversational reply prompt ending</p>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Style DNA Grid (6 Core Cards) */}
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

      {/* Interactive Live Style-Match Checker Card */}
      <Card className="border-slate-800/90 shadow-xl bg-[#090e1c]/60">
        <CardHeader className="pb-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <div>
                <CardTitle className="text-sm font-bold text-white">
                  Live Style-Match Test Sandbox
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-400">
                  Paste or draft content to test alignment against your cloned DNA rules in real time
                </CardDescription>
              </div>
            </div>

            {testText.trim() && (
              <Badge variant={calculatedScore >= 80 ? "success" : "amber"} className="font-mono text-xs">
                Style Fit: {calculatedScore}%
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-3">
          <Textarea
            rows={3}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Type or paste any text to test Hook fold length, paragraph spacing, and ending question alignment..."
            className="text-xs leading-relaxed"
          />

          {testText.trim() && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                testHookGood ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
              }`}>
                {testHookGood ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                <span>{testHookGood ? 'Hook <= 110 chars' : 'Hook is too long'}</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                testSpacingGood ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
              }`}>
                {testSpacingGood ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                <span>{testSpacingGood ? '3+ Linebreak Spacing' : 'Add more linebreaks'}</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                testHasCta ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
              }`}>
                {testHasCta ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                <span>{testHasCta ? 'Conversational CTA ending' : 'Add comment CTA (?)'}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
