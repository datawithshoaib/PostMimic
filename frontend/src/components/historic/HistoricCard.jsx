import React from 'react';
import { Sparkles, Trash2, Heart, MessageSquare, ThumbsUp, Hash } from 'lucide-react';

export default function HistoricCard({
  post,
  index,
  onUseTopic,
  onDelete
}) {
  const isHinglish = post.language === 'Hinglish';

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-200 group hover:shadow-xl hover:shadow-black/30">
      
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 pb-3 mb-3 border-b border-slate-800/80">
          <span className="font-mono text-[11px] font-bold text-sky-400">
            #{index + 1} Historic Sample
          </span>

          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              isHinglish 
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' 
                : 'bg-blue-500/10 text-sky-300 border border-blue-500/20'
            }`}>
              {post.language || 'English'}
            </span>
            <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
              {post.line_count || 6} lines
            </span>
          </div>
        </div>

        {/* Post Text */}
        <div className="text-xs sm:text-[13px] text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto mb-4 font-sans select-text scrollbar-thin">
          {post.text}
        </div>
      </div>

      {/* Card Footer */}
      <div>
        {/* Topic Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {(post.tags || ['Career', 'Mindset']).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[10px] rounded-md bg-[#0a0f1d] text-sky-300 font-medium border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions & Metrics */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-sky-400 flex items-center justify-center text-[10px]">
              👍
            </span>
            <span className="text-xs font-mono">{post.engagement || 120} Reactions</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUseTopic(post.text)}
              className="px-2.5 py-1 rounded-lg bg-sky-600/15 hover:bg-sky-600/30 text-sky-400 text-xs font-semibold flex items-center gap-1 transition-all border border-sky-500/20"
              title="Use post topic in Agent Studio"
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Use Topic</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(post.id)}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Sample"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
