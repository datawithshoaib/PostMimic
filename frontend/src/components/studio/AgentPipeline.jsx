import React, { useState } from 'react';
import { 
  GitMerge, 
  CheckCircle2, 
  AlertCircle, 
  GitCommit, 
  User, 
  Eye, 
  ShieldAlert, 
  Bot, 
  ArrowRight, 
  Cpu, 
  Sparkles,
  Copy,
  Check,
  Layers,
  Award
} from 'lucide-react';
import ReviewerMatrix from './ReviewerMatrix';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AgentPipeline({
  currentPost,
  activeAttemptIndex,
  setActiveAttemptIndex,
  onPreviewDraft,
  onCopyDraft,
  isGenerating
}) {
  const [copiedDraft, setCopiedDraft] = useState(false);
  const trace = currentPost?.trace || [];

  const handleCopy = (text) => {
    onCopyDraft(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  if (isGenerating) {
    return (
      <Card className="p-6 sm:p-8 border-sky-500/30 relative overflow-hidden shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

        <div className="text-center max-w-md mx-auto space-y-4 py-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-sky-500/30 relative animate-float">
            <Bot className="w-8 h-8 text-white" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0e1628]"></span>
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Autonomous Agent Loop In Progress
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Writer Agent & Reviewer Agent are collaborating, querying Style DNA, and iterating to achieve optimal quality.
            </p>
          </div>

          {/* Stepper Steps Animation */}
          <div className="p-4 rounded-2xl bg-[#080d1a]/90 border border-slate-800 text-left space-y-2.5 text-xs shadow-inner">
            <div className="flex items-center gap-2.5 text-sky-400 font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
              <span>Writer Agent: Drafting hook with authentic voice DNA...</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
              <span>Reviewer Agent: Auditing Hook Power & thumb-spacing...</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
              <span>Loop Controller: Re-drafting autonomously if score &lt; 85...</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!currentPost || trace.length === 0) {
    return (
      <Card className="border-slate-800/90 shadow-xl space-y-5">
        <CardHeader className="pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm">
              <GitMerge className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white">
                Multi-Agent Feedback Loop Visualizer
              </CardTitle>
              <CardDescription className="text-[11px] text-slate-400">
                Inspect every revision, quality score, and editorial critique
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center py-7 px-4 rounded-2xl bg-[#080d1a]/80 border border-slate-800/80 space-y-4">
            <Cpu className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="max-w-md mx-auto">
              <h4 className="text-sm font-bold text-slate-200">
                Ready to generate your first LinkedIn post
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Configure your topic and iteration parameters on the left and launch the autonomous loop.
              </p>
            </div>

            {/* Visual Architecture Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-left">
              <div className="p-3 rounded-xl bg-[#0e1628] border border-slate-800/80 shadow-sm">
                <Badge variant="sky" className="text-[9px] px-1.5 py-0 font-mono mb-1">AGENT 1</Badge>
                <p className="text-xs font-semibold text-slate-200">Style Persona</p>
                <p className="text-[10px] text-slate-400">Injects 10-15 posts</p>
              </div>
              <div className="p-3 rounded-xl bg-[#0e1628] border border-slate-800/80 shadow-sm">
                <Badge variant="sky" className="text-[9px] px-1.5 py-0 font-mono mb-1">AGENT 2</Badge>
                <p className="text-xs font-semibold text-slate-200">Writer Agent</p>
                <p className="text-[10px] text-slate-400">Drafts authentic copy</p>
              </div>
              <div className="p-3 rounded-xl bg-[#0e1628] border border-slate-800/80 shadow-sm">
                <Badge variant="amber" className="text-[9px] px-1.5 py-0 font-mono mb-1">AGENT 3</Badge>
                <p className="text-xs font-semibold text-slate-200">Reviewer Critic</p>
                <p className="text-[10px] text-slate-400">Grades 6 quality factors</p>
              </div>
              <div className="p-3 rounded-xl bg-[#0e1628] border border-slate-800/80 shadow-sm">
                <Badge variant="success" className="text-[9px] px-1.5 py-0 font-mono mb-1">LOOP</Badge>
                <p className="text-xs font-semibold text-slate-200">Loop Controller</p>
                <p className="text-[10px] text-slate-400">Refines until Approved</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeStep = trace[activeAttemptIndex] || trace[0];
  const isApproved = activeStep.verdict === 'APPROVED';
  const score = activeStep.score || 85;

  return (
    <Card className="border-slate-800/90 shadow-xl space-y-4">
      
      {/* Header and Step Selector Tabs */}
      <CardHeader className="pb-3 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm">
              <GitMerge className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                Multi-Agent Loop Trace
                <Badge variant="secondary" className="font-mono font-normal text-[10px]">
                  {trace.length} attempt{trace.length > 1 ? 's' : ''}
                </Badge>
              </CardTitle>
              <CardDescription className="text-[11px] text-slate-400">
                Step-by-step revision trace from Writer and Reviewer agents
              </CardDescription>
            </div>
          </div>

          {/* Attempt Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#080d1a] p-1 rounded-xl border border-slate-800/80">
            {trace.map((step, idx) => {
              const isStepApproved = step.verdict === 'APPROVED';
              const isHuman = step.is_human_refinement;
              const isSelected = idx === activeAttemptIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveAttemptIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-slate-700 text-white shadow-sm border border-slate-600'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {isStepApproved ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isHuman ? (
                    <User className="w-3.5 h-3.5 text-purple-400" />
                  ) : (
                    <GitCommit className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{isHuman ? `Rev #${step.attempt}` : `Attempt #${step.attempt}`}</span>
                  <span className={`text-[10px] px-1 rounded font-mono ${
                    isStepApproved 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {step.score || 85}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        
        {/* Step Summary Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3.5 rounded-xl bg-[#080d1a] border border-slate-800">
          <div className="flex items-center gap-2.5">
            <Badge variant={isApproved ? "success" : "destructive"} className="text-xs font-bold py-0.5">
              VERDICT: {activeStep.verdict}
            </Badge>

            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Award className="w-3.5 h-3.5 text-sky-400" />
              <span>Score:</span>
              <strong className={`font-mono text-sm ${
                score >= 85 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {score}/100
              </strong>
            </div>

            {activeStep.is_human_refinement && (
              <Badge variant="purple" className="text-[10px]">
                User Guidance Applied
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreviewDraft(activeStep.draft)}
            className="text-xs text-sky-400 hover:text-sky-300 gap-1.5 p-0 h-auto font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Load in LinkedIn preview</span>
          </Button>
        </div>

        {/* User feedback note if human refinement */}
        {activeStep.user_feedback && (
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs">
            <span className="font-semibold text-purple-300 block mb-1">
              Your Guidance to Writer Agent:
            </span>
            <p className="text-slate-300 italic">"{activeStep.user_feedback}"</p>
          </div>
        )}

        {/* Reviewer Agent Critique Box */}
        <div className="p-4 rounded-xl bg-[#0d1425] border border-slate-800/90 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Senior Editorial Reviewer Critique:</span>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-sans pl-6">
            {activeStep.feedback}
          </p>
        </div>

        {/* Criteria Breakdown Grid */}
        <ReviewerMatrix criteria={activeStep.criteria_breakdown || {}} />

        {/* Writer Agent Draft Output Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-sky-400" />
              Writer Agent Output (Draft #{activeStep.attempt}):
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(activeStep.draft)}
              className="text-[11px] text-slate-400 hover:text-sky-300 gap-1 h-7 px-2"
            >
              {copiedDraft ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedDraft ? 'Copied' : 'Copy'}</span>
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-[#050811] border border-slate-800/90 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto select-text shadow-inner">
            {activeStep.draft}
          </div>
        </div>

      </CardContent>

    </Card>
  );
}
