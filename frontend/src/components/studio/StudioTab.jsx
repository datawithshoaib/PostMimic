import React, { useState } from 'react';
import PromptControls from './PromptControls';
import AgentPipeline from './AgentPipeline';
import HumanInLoop from './HumanInLoop';
import LinkedInPreview from './LinkedInPreview';
import { Bot, Sparkles, Sliders, Dna, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
      <Card className="border-slate-800/90 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-sky-500/10 via-blue-500/5 to-transparent pointer-events-none"></div>
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-sky-500/25 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Multi-Agent Post Studio
                </h1>
                <Badge variant="success" className="font-mono text-[10px] gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Autonomous Loop Active
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Writer Agent drafts content tuned to your Style DNA while Reviewer Agent audits hook tension, skimmability, and authentic voice through iterative feedback cycles.
              </p>
            </div>
          </div>

          {/* Active Persona Pill */}
          <div className="flex items-center gap-3 bg-[#080d1a] px-4 py-2.5 rounded-2xl border border-slate-750 shrink-0 self-start md:self-auto shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Active Style Persona
              </span>
              <span className="text-xs font-bold text-white truncate max-w-[180px] block">
                {personaTitle || 'Empathetic Career Mentor'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => onSwitchTab('style')}
              className="text-slate-400 hover:text-sky-300 ml-1"
              title="Inspect Style DNA"
            >
              <Dna className="w-4 h-4 text-sky-400" />
            </Button>
          </div>
        </CardContent>
      </Card>

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
