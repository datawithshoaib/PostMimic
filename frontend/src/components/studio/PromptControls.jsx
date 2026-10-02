"use client";

import React, { useState } from 'react';
import { 
  Sliders, 
  Wand2, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  Lightbulb, 
  AlignLeft,
  Globe2,
  Dice5,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const INSPIRATION_IDEAS = [
  { category: 'Career', text: 'Job rejections are actually blessings in disguise — here is why' },
  { category: 'AI & Tech', text: 'Why 90% of AI wrappers will fail in the next 18 months' },
  { category: 'Mindset', text: 'Mental health matters more than any offer letter or promotion' },
  { category: 'Contrarian', text: 'Stop attaching someone\'s value to the company brand name they work for' },
  { category: 'Growth', text: 'The hardest skill in tech is not coding — it is explaining simple concepts' },
  { category: 'Hiring', text: 'Resume filters are rejecting the exact candidates companies are desperately seeking' }
];

export default function PromptControls({
  topic,
  setTopic,
  length,
  setLength,
  language,
  setLanguage,
  maxAttempts,
  setMaxAttempts,
  onGenerate,
  isGenerating,
  personaTitle
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredIdeas = selectedCategory === 'All' 
    ? INSPIRATION_IDEAS 
    : INSPIRATION_IDEAS.filter(item => item.category === selectedCategory);

  const categories = ['All', 'Career', 'AI & Tech', 'Mindset', 'Contrarian'];

  const handleRandomCatalyst = () => {
    const random = INSPIRATION_IDEAS[Math.floor(Math.random() * INSPIRATION_IDEAS.length)];
    setTopic(random.text);
  };

  const getLoopDescription = (val) => {
    switch (val) {
      case 1:
        return '1 Loop: Fast direct draft with single pass reviewer audit.';
      case 2:
        return '2 Loops: Balanced refinement. Reviewer critiques hook & spacing.';
      case 3:
        return '3 Loops: Recommended. Iterates until score >= 85 or 3 revisions.';
      case 4:
      default:
        return '4 Loops: Deep autonomous multi-pass polishing for viral quality.';
    }
  };

  return (
    <div className="space-y-5">
      {/* Studio Configuration Card */}
      <Card className="border-slate-800/90 shadow-2xl">
        <CardHeader className="pb-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  Prompt & Agent Controls
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-400">
                  Direct the Writer & Reviewer agent loop
                </CardDescription>
              </div>
            </div>

            <Badge variant="success" className="gap-1.5 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Agent Ready
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-4">
          {/* Topic Input Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <label htmlFor="topic-input" className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>What do you want to post about?</span>
              </label>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomCatalyst}
                  className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 font-normal"
                  title="Pick a random topic catalyst"
                >
                  <Dice5 className="w-3 h-3" />
                  <span>Surprise Me</span>
                </button>
                {topic && (
                  <button
                    type="button"
                    onClick={() => setTopic('')}
                    className="text-[11px] text-slate-400 hover:text-rose-300 transition-colors flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="relative">
              <Textarea
                id="topic-input"
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Why the best career advice I ever received was to say 'NO' more often..."
                className="resize-none text-xs sm:text-sm font-sans leading-relaxed pr-16"
              />
              <span className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono select-none">
                {topic.length} chars
              </span>
            </div>
          </div>

          {/* Quick Inspiration Pills */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Inspiration Catalysts:
              </span>
              <div className="flex gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] px-2 py-0.5 rounded-lg font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {filteredIdeas.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(item.text)}
                  className="text-left text-[11px] px-2.5 py-1.5 rounded-xl bg-[#0b101f] hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800 hover:border-sky-500/30 transition-all flex items-center gap-1.5 group"
                >
                  <span className="text-[10px] text-sky-400 font-mono">#{item.category}</span>
                  <span className="truncate max-w-[220px]">{item.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Length & Language Grid using shadcn Select */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Length Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-sky-400" />
                <span>Length & Density</span>
              </label>
              
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short">Short (1–5 lines, punchy)</SelectItem>
                  <SelectItem value="Medium">Medium (6–10 lines, sweetspot)</SelectItem>
                  <SelectItem value="Long">Long (11–15 lines, deep story)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tone & Language</span>
              </label>
              
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English (Authentic Personal)</SelectItem>
                  <SelectItem value="Hinglish">Hinglish (Hindi + English blend)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Autonomous Review Loop Slider */}
          <div className="pt-2 bg-[#080d1a] p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Autonomous Review Loops:
              </span>
              <Badge variant="sky" className="font-mono text-xs">
                {maxAttempts} max loop{maxAttempts > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <Slider
              min={1}
              max={4}
              step={1}
              value={[maxAttempts]}
              onValueChange={(val) => setMaxAttempts(val[0])}
            />

            <p className="text-[10px] text-slate-400 leading-normal font-sans">
              {getLoopDescription(maxAttempts)}
            </p>
          </div>

          {/* Launch Button */}
          <Button
            variant={isGenerating || !topic.trim() ? "secondary" : "gradient"}
            size="xl"
            onClick={onGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full relative overflow-hidden group font-bold tracking-wide"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-sky-300" />
                <span>Autonomous Agent Loops Running...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-sky-200 group-hover:rotate-12 transition-transform" />
                <span>Launch Multi-Agent Post Generator</span>
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Style Guardrails Badge Card */}
      <Card className="border-slate-800/80">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Active Style Guardrails
              </h3>
            </div>
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
              DNA Locked
            </Badge>
          </div>

          <ul className="text-[11px] text-slate-300 space-y-1.5 pt-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span>
              <span><strong>Persona:</strong> {personaTitle || 'Empathetic Realist & Tech Mentor'}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              <span><strong>Whitespace:</strong> 1-2 sentences per line break for thumb-skimming</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
              <span><strong>Tone:</strong> Vulnerable lived experience, zero corporate clichés</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
              <span><strong>Ending:</strong> Heartfelt engagement prompt driving comments</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
