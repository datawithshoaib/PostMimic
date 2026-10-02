import React, { useState } from 'react';
import PromptControls from './PromptControls';
import AgentPipeline from './AgentPipeline';
import HumanInLoop from './HumanInLoop';
import LinkedInPreview from './LinkedInPreview';
import { Bot, Dna, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-7">
      
      {/* Studio Header Banner */}
      <Card className="overflow-hidden border-slate-700/60 bg-gradient-to-br from-[#111c2b] via-[#101827] to-[#101522] shadow-lg shadow-black/10">
        <CardContent className="relative flex flex-col justify-between gap-6 p-6 md:flex-row md:items-center md:p-7">
          <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300 sm:flex">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">Writing workspace</span>
                <Badge variant="success" className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Agents ready
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">Create your next LinkedIn post</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                Shape an idea, then let your writer and reviewer refine it in your voice.
              </p>
            </div>
          </div>

          <button onClick={() => onSwitchTab('style')} className="relative flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-950/40 px-4 py-3 text-left transition-colors hover:border-sky-500/40 hover:bg-slate-950/70">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300"><Dna className="h-4 w-4" /></span>
            <span className="min-w-0">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">Active voice</span>
              <span className="mt-0.5 block max-w-[190px] truncate text-sm font-semibold text-slate-200">{personaTitle || 'Empathetic Career Mentor'}</span>
            </span>
            <ArrowUpRight className="ml-1 h-4 w-4 text-slate-500" />
          </button>
        </CardContent>
      </Card>

      {/* Studio Main Grid Layout (12 columns) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-7">
        
        {/* Left Column: Generator Controls (5 cols on lg) */}
        <div className="space-y-6 lg:col-span-5">
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
        <div className="space-y-6 lg:col-span-7">
          
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
            <Card className="border-purple-500/30 shadow-xl bg-[#0f1426]/70">
              <CardContent className="p-5">
                <HumanInLoop onRefine={onRefine} isRefining={isRefining} />
              </CardContent>
            </Card>
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
