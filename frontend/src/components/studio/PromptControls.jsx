import React, { useState } from 'react';
import { 
  Sliders, 
  Wand2, 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  Check, 
  ChevronRight,
  Flame,
  Brain,
  ShieldCheck,
  Zap
} from 'lucide-react';

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

  return (
    <div className="space-y-5">
      {/* Studio Configuration Card */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Prompt & Multi-Agent Controls
              </h2>
              <p className="text-[11px] text-slate-400">
                Configure your topic and iteration parameters
              </p>
            </div>
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Agent Ready
          </span>
        </div>

        {/* Topic Input Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>What do you want to post about?</span>
            {topic && (
              <button
                type="button"
                onClick={() => setTopic('')}
                className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                Clear
              </button>
            )}
          </label>
          <textarea
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Why the best career advice I ever received was to say 'NO' more often..."
            className="w-full bg-[#0a0f1d] border border-slate-700/80 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all resize-none shadow-inner"
          />
        </div>

        {/* Quick Inspiration Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Quick Inspiration Pills:
            </span>
            <div className="flex gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
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
                className="text-left text-[11px] px-2.5 py-1.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5 group"
              >
                <span className="text-[10px] text-sky-400 font-mono">#{item.category}</span>
                <span className="truncate max-w-[240px]">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Length & Language Controls */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Length & Density
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full bg-[#0a0f1d] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500 transition-all"
            >
              <option value="Short">Short (1–5 lines, punchy)</option>
              <option value="Medium">Medium (6–10 lines, sweetspot)</option>
              <option value="Long">Long (11–15 lines, deep story)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Language / Tone
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#0a0f1d] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500 transition-all"
            >
              <option value="English">English (Authentic Personal)</option>
              <option value="Hinglish">Hinglish (Hindi + English blend)</option>
            </select>
          </div>
        </div>

        {/* Loop Iterations Control */}
        <div className="pt-2 bg-[#090e1c] p-3 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Autonomous Review Loops:
            </span>
            <span className="text-xs font-mono font-bold text-sky-400 px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20">
              {maxAttempts} max attempt{maxAttempts > 1 ? 's' : ''}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <p className="text-[10px] text-slate-400 leading-normal">
            The Reviewer Agent systematically grades Hook Stopping Power, formatting, and authentic voice. If rejected, Writer Agent refines based on critique.
          </p>
        </div>

        {/* Launch Button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating || !topic.trim()}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
            isGenerating || !topic.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01]'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-sky-300" />
              <span>Multi-Agent Feedback Loop Running...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-sky-200" />
              <span>Launch Multi-Agent Post Generator</span>
            </>
          )}
        </button>

      </div>

      {/* Style Guardrails Badge Card */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Style DNA Guardrails Active
          </h3>
        </div>

        <ul className="text-[11px] text-slate-300 space-y-1.5">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span><strong>Persona:</strong> {personaTitle || 'Empathetic Realist & Tech Mentor'}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span><strong>Whitespace:</strong> 1-2 sentences per line break for skimmability</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span><strong>Voice:</strong> Vulnerable, anti-corporate jargon, zero buzzwords</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
            <span><strong>Ending:</strong> Heartfelt engagement question prompting comments</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
