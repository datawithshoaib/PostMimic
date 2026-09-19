import React, { useState } from 'react';
import PromptControls from './PromptControls';
import AgentPipeline from './AgentPipeline';
import HumanInLoop from './HumanInLoop';
import LinkedInPreview from './LinkedInPreview';
import { Bot, Sparkles, Sliders, Dna } from 'lucide-react';

export default function StudioTab({
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
  currentPost,
  activeAttemptIndex,
  setActiveAttemptIndex,
  user,
  onRefine,
  isRefining,
  onSaveDraft,
  personaTitle,
  onSwitchTab,
  onCopySuccess
}) {
  const [overridePreviewText, setOverridePreviewText] = useState(null);

  // If user selected an earlier draft in trace, show that draft, else final_post
  const displayedDraft = overridePreviewText 
    || currentPost?.trace?.[activeAttemptIndex]?.draft 
    || currentPost?.final_post;

  const handlePreviewSpecificDraft = (text) => {
    setOverridePreviewText(text);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    if (onCopySuccess) onCopySuccess();
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#101628] via-[#161f36] to-[#101628] border border-slate-800 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Multi-Agent Post Studio
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Iterative Feedback Loop Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Writer Agent generates posts mimicking your Style DNA while Reviewer Agent audits hook tension, skimmability, and authentic voice through iterative feedback cycles.
            </p>
          </div>
        </div>

        {/* Active Persona Pill */}
        <div className="flex items-center gap-3 bg-[#0a0f1d] px-4 py-2.5 rounded-xl border border-slate-700/60 shrink-0 self-start md:self-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              Active Style Persona
            </span>
            <span className="text-xs font-bold text-white truncate max-w-[180px] block">
              {personaTitle || 'Empathetic Career Mentor'}
            </span>
          </div>
          <button
            onClick={() => onSwitchTab('style')}
            className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors ml-1"
            title="Inspect Style DNA"
          >
            <Dna className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      {/* Studio Main Grid Layout (12 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Generator Controls (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <PromptControls
            topic={topic}
            setTopic={setTopic}
            length={length}
            setLength={setLength}
            language={language}
            setLanguage={setLanguage}
            maxAttempts={maxAttempts}
            setMaxAttempts={setMaxAttempts}
            onGenerate={onGenerate}
            isGenerating={isGenerating}
            personaTitle={personaTitle}
          />
        </div>

        {/* Right Column: Multi-Agent Trace & LinkedIn Live Preview (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Multi-Agent Iteration Pipeline */}
          <AgentPipeline
            currentPost={currentPost}
            activeAttemptIndex={activeAttemptIndex}
            setActiveAttemptIndex={(idx) => {
              setActiveAttemptIndex(idx);
              setOverridePreviewText(null);
            }}
            onPreviewDraft={handlePreviewSpecificDraft}
            onCopyDraft={handleCopy}
            isGenerating={isGenerating}
          />

          {/* Human-in-the-Loop Refinement (shown if post is generated) */}
          {currentPost && (
            <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 shadow-xl">
              <HumanInLoop onRefine={onRefine} isRefining={isRefining} />
            </div>
          )}

          {/* Authentic LinkedIn Feed Preview */}
          <LinkedInPreview
            postText={displayedDraft}
            user={user}
            onSaveDraft={onSaveDraft}
            onCopySuccess={onCopySuccess}
          />

        </div>

      </div>

    </div>
  );
}
