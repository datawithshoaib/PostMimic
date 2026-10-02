"use client";

import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  ExternalLink, 
  Trash2, 
  Copy, 
  Check, 
  Clock, 
  Inbox, 
  Calendar, 
  ShieldAlert,
  Search,
  X,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

export default function DraftsTab({
  drafts,
  onLoadDraft,
  onDeleteDraft,
  onCopySuccess
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'APPROVED' | 'MULTI_LOOP'

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(async () => {
      setCopiedId(id);
      try {
        const confettiModule = await import('canvas-confetti');
        const confetti = confettiModule.default || confettiModule;
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 }
          });
        }
      } catch (err) {
        // Confetti is decorative
      }
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const filteredDrafts = useMemo(() => {
    return drafts.filter((d) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q 
        || (d.topic && d.topic.toLowerCase().includes(q))
        || (d.final_post && d.final_post.toLowerCase().includes(q));

      let matchesStatus = true;
      if (filterStatus === 'APPROVED') {
        matchesStatus = d.is_approved === true;
      } else if (filterStatus === 'MULTI_LOOP') {
        matchesStatus = (d.attempts || 1) > 1;
      }

      return matchesSearch && matchesStatus;
    });
  }, [drafts, searchQuery, filterStatus]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <Card className="border-slate-800/90 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-sky-500/10 via-blue-500/5 to-transparent pointer-events-none"></div>
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Generated Drafts & Trace History
                </h1>
                <Badge variant="sky" className="font-mono text-xs font-bold">
                  {drafts.length} Saved
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Every multi-agent post generated is archived here with its full editorial review critiques, attempt counts, and quality scores.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter and Search Bar */}
      <Card className="border-slate-800/80">
        <CardContent className="p-3.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-[#090e1c] px-3.5 py-1 rounded-xl border border-slate-750">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drafts by topic or keywords..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none h-7"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs Filter */}
          <div className="flex items-center gap-1.5 bg-[#080d1a] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === 'ALL' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({drafts.length})
            </button>
            <button
              onClick={() => setFilterStatus('APPROVED')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === 'APPROVED' ? 'bg-emerald-600/80 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus('MULTI_LOOP')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === 'MULTI_LOOP' ? 'bg-sky-600/80 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Multi-Loop (2+)
            </button>
          </div>

        </CardContent>
      </Card>

      {/* Drafts List */}
      {filteredDrafts.length === 0 ? (
        <Card className="text-center py-16 border-slate-800/80">
          <CardContent className="space-y-3">
            <Inbox className="w-12 h-12 mx-auto text-slate-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-300">No generated drafts found</h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-sm mx-auto">
                {drafts.length === 0 
                  ? 'Go to the Agent Studio to create and review your first multi-agent LinkedIn post.' 
                  : 'Try adjusting your search query or status filter.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDrafts.map((draft) => {
            const isApproved = draft.is_approved;
            const dateStr = new Date(draft.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <Card
                key={draft.id}
                className="border-slate-800/90 shadow-xl hover:border-slate-700/80 transition-all space-y-3.5 group"
              >
                <CardHeader className="pb-3 border-b border-slate-800/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-sm font-bold text-white tracking-wide">
                        {draft.topic}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2.5 mt-2">
                        <Badge variant={isApproved ? "success" : "amber"} className="text-[10px] font-bold">
                          {isApproved ? 'VERDICT: APPROVED' : 'MAX ATTEMPTS REACHED'}
                        </Badge>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {draft.attempts} loop iteration{draft.attempts > 1 ? 's' : ''}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {dateStr}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant={copiedId === draft.id ? "default" : "secondary"}
                        size="sm"
                        onClick={() => handleCopy(draft.id, draft.final_post)}
                        className={copiedId === draft.id ? "bg-emerald-600 hover:bg-emerald-500 text-white" : ""}
                      >
                        {copiedId === draft.id ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                        <span>{copiedId === draft.id ? 'Copied' : 'Copy'}</span>
                      </Button>

                      <Button
                        variant="subtleSky"
                        size="sm"
                        onClick={() => onLoadDraft(draft)}
                        className="gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspect in Studio</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => onDeleteDraft(draft.id)}
                        className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Delete draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Final Post Output */}
                  <div className="p-4 rounded-xl bg-[#050811] border border-slate-800/90 text-xs sm:text-[13px] text-slate-200 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto font-sans select-text shadow-inner">
                    {draft.final_post}
                  </div>

                  {/* Reviewer Note */}
                  {draft.review_feedback && (
                    <div className="p-3 rounded-xl bg-[#0a0f1d] border border-slate-800/80 text-xs text-slate-300 italic flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 not-italic mt-0.5" />
                      <span className="leading-relaxed">
                        <strong className="text-amber-400 not-italic mr-1.5">Editorial Reviewer:</strong>
                        "{draft.review_feedback}"
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}
