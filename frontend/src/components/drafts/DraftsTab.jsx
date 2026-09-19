import React, { useState } from 'react';
import { 
  Layers, 
  ExternalLink, 
  Trash2, 
  Copy, 
  Check, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles,
  Inbox,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DraftsTab({
  drafts,
  onLoadDraft,
  onDeleteDraft,
  onCopySuccess
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#101628] via-[#161f36] to-[#101628] border border-slate-800 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Generated Drafts & Trace History
              </h1>
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold font-mono">
                {drafts.length} Saved
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Every multi-agent post generated is archived here with its full editorial review critiques, attempt counts, and quality scores.
            </p>
          </div>
        </div>
      </div>

      {/* Drafts List */}
      {drafts.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800 space-y-3">
          <Inbox className="w-12 h-12 mx-auto text-slate-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-300">No generated drafts yet</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Go to the Agent Studio to create your first multi-agent LinkedIn post.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => {
            const isApproved = draft.is_approved;
            const dateStr = new Date(draft.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={draft.id}
                className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-xl hover:border-slate-700/80 transition-all space-y-3.5"
              >
                {/* Draft Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      {draft.topic}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isApproved
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isApproved ? 'VERDICT: APPROVED' : 'MAX ATTEMPTS REACHED'}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {draft.attempts} loop iteration{draft.attempts > 1 ? 's' : ''}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(draft.id, draft.final_post)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        copiedId === draft.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {copiedId === draft.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === draft.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onLoadDraft(draft)}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Inspect in Studio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteDraft(draft.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Final Post Output */}
                <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800/90 text-xs sm:text-[13px] text-slate-200 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto font-sans select-text">
                  {draft.final_post}
                </div>

                {/* Reviewer Note */}
                {draft.review_feedback && (
                  <div className="p-3 rounded-xl bg-[#090e1c] border border-slate-800/80 text-xs text-slate-300 italic flex items-start gap-2">
                    <span className="font-semibold text-amber-400 not-italic shrink-0">
                      Editorial Reviewer:
                    </span>
                    <span className="leading-relaxed">"{draft.review_feedback}"</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
