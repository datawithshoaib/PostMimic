import React from 'react';
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
  Layers
} from 'lucide-react';
import ReviewerMatrix from './ReviewerMatrix';

export default function AgentPipeline({
  currentPost,
  activeAttemptIndex,
  setActiveAttemptIndex,
  onPreviewDraft,
  onCopyDraft,
  isGenerating
}) {
  const trace = currentPost?.trace || [];

  if (isGenerating) {
    return (
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-sky-500/30 shadow-2xl relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-md mx-auto space-y-4 py-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-sky-500/25 relative">
            <Bot className="w-8 h-8 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0e1628] animate-ping"></span>
          </div>

          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Autonomous Agent Loop In Progress
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Writer Agent & Reviewer Agent are collaborating, analyzing Style DNA, and iterating on your post.
            </p>
          </div>

          {/* Stepper Steps Animation */}
          <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-sky-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
              <span>Writer Agent: Crafting Draft 1 with Hook DNA...</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              <span>Reviewer Agent: Auditing Hook Power & Whitespace...</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              <span>Loop Controller: Re-drafting if score &lt; 85...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPost || trace.length === 0) {
    return (
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/90 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <GitMerge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Multi-Agent Feedback Loop Visualizer
              </h3>
              <p className="text-[11px] text-slate-400">
                Inspect every revision, quality score, and editorial critique
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Diagram Banner */}
        <div className="text-center py-8 px-4 rounded-xl bg-[#090e1c] border border-slate-800/80 space-y-4">
          <Cpu className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-bold text-slate-200">
              Ready to generate your first LinkedIn post
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Select or type a topic on the left and click "Launch Multi-Agent Post Generator" to initiate the autonomous loop.
            </p>
          </div>

          {/* Visual Architecture Mini-Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-left">
            <div className="p-2.5 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-[10px] text-sky-400 font-mono font-bold block">AGENT 1</span>
              <p className="text-[11px] font-semibold text-slate-200">Style Persona</p>
              <p className="text-[10px] text-slate-400">Injects your 10-15 posts</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-[10px] text-sky-400 font-mono font-bold block">AGENT 2</span>
              <p className="text-[11px] font-semibold text-slate-200">Writer Agent</p>
              <p className="text-[10px] text-slate-400">Drafts authentic copy</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-[10px] text-amber-400 font-mono font-bold block">AGENT 3</span>
              <p className="text-[11px] font-semibold text-slate-200">Reviewer Critic</p>
              <p className="text-[10px] text-slate-400">Grades 6 quality factors</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-[10px] text-emerald-400 font-mono font-bold block">LOOP</span>
              <p className="text-[11px] font-semibold text-slate-200">Loop Controller</p>
              <p className="text-[10px] text-slate-400">Iterates until Approved</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeStep = trace[activeAttemptIndex] || trace[0];
  const isApproved = activeStep.verdict === 'APPROVED';

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl space-y-4">
      
      {/* Header and Step Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <GitMerge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Multi-Agent Loop Trace
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-normal">
                {trace.length} attempt{trace.length > 1 ? 's' : ''}
              </span>
            </h3>
          </div>
        </div>

        {/* Attempt Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#090e1c] p-1 rounded-xl border border-slate-800/80">
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
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {isStepApproved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isHuman ? (
                  <User className="w-3.5 h-3.5 text-purple-400" />
                ) : (
                  <GitCommit className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{isHuman ? `Revision #${step.attempt}` : `Attempt #${step.attempt}`}</span>
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

      {/* Active Step Details Panel */}
      <div className="space-y-3.5">
        
        {/* Step Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#090e1c] border border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
              isApproved
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            }`}>
              VERDICT: {activeStep.verdict}
            </span>
            <span className="text-xs text-slate-300">
              Score: <strong className="text-white font-mono text-sm">{activeStep.score}/100</strong>
            </span>
            {activeStep.is_human_refinement && (
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                User Guidance Applied
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onPreviewDraft(activeStep.draft)}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold hover:underline"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View this draft in LinkedIn preview</span>
          </button>
        </div>

        {/* User feedback note if human refinement */}
        {activeStep.user_feedback && (
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs">
            <span className="font-semibold text-purple-300 block mb-0.5">
              Your Guidance to Writer Agent:
            </span>
            <p className="text-slate-300 italic">"{activeStep.user_feedback}"</p>
          </div>
        )}

        {/* Reviewer Agent Critique Box */}
        <div className="p-4 rounded-xl bg-[#0e1628] border border-slate-800/90 space-y-1.5">
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
        <div className="relative group">
          <div className="flex items-center justify-between pb-1.5 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-sky-400" />
              Writer Agent Output (Draft #{activeStep.attempt}):
            </span>
            <button
              type="button"
              onClick={() => onCopyDraft(activeStep.draft)}
              className="text-[11px] text-slate-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#060911] border border-slate-800/90 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
            {activeStep.draft}
          </div>
        </div>

      </div>

    </div>
  );
}
