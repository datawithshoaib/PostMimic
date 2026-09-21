import React from 'react';
import { Sparkles, Trash2, Heart, MessageSquare, ThumbsUp, Hash, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export default function HistoricCard({
  post,
  index,
  onUseTopic,
  onDelete
}) {
  const isHinglish = post.language === 'Hinglish';

  return (
    <Card className="flex flex-col justify-between hover:border-slate-700/80 transition-all duration-200 group hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">
      
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 p-5 pb-3 border-b border-slate-800/80">
          <span className="font-mono text-[11px] font-bold text-sky-400">
            #{index + 1} Historic Sample
          </span>

          <div className="flex items-center gap-1.5">
            <Badge variant={isHinglish ? "amber" : "sky"} className="text-[10px] font-semibold">
              {post.language || 'English'}
            </Badge>
            <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
              {post.line_count || 6} lines
            </span>
          </div>
        </div>

        {/* Post Text */}
        <div className="p-5 pt-4 text-xs sm:text-[13px] text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-sans select-text scrollbar-thin">
          {post.text}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0">
        {/* Topic Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {(post.tags || ['Career', 'Mindset']).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[10px] rounded-md bg-[#080d1a] text-sky-300 font-medium border border-slate-800"
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

          <div className="flex items-center gap-1.5">
            <Button
              variant="subtleSky"
              size="sm"
              onClick={() => onUseTopic(post.text)}
              className="gap-1 h-7 text-[11px] font-semibold"
              title="Send topic to Agent Studio"
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Use Topic</span>
            </Button>

            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => onDelete(post.id)}
              className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
              title="Delete Sample"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

      </div>

    </Card>
  );
}
