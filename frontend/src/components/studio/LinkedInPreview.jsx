import React, { useState } from 'react';
import { 
  Eye, 
  Copy, 
  Bookmark, 
  Download, 
  Smartphone, 
  Monitor, 
  Globe, 
  MoreHorizontal, 
  ThumbsUp, 
  MessageSquare, 
  Repeat, 
  Send, 
  Check, 
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function LinkedInPreview({
  postText,
  user,
  onSaveDraft,
  onCopySuccess
}) {
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const fallbackText = "Your AI-generated LinkedIn post will appear here formatted with exact line breaks, thumb-friendly spacing, and authentic creator style...";
  const content = postText || fallbackText;
  const isPlaceholder = !postText;

  // Analytics
  const chars = content.length;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const lines = content.split('\n').filter(l => l.trim()).length;
  const readSeconds = Math.max(8, Math.round((words / 200) * 60));

  // Hook line check (first line)
  const firstLine = content.split('\n')[0] || '';
  const isHookShort = firstLine.length <= 110;

  // Handle Copy
  const handleCopy = () => {
    if (isPlaceholder) return;
    navigator.clipboard.writeText(content).then(async () => {
      setCopied(true);
      try {
        const confettiModule = await import('canvas-confetti');
        const confetti = confettiModule.default || confettiModule;
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
      } catch (err) {
        // Confetti is decorative
      }
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Handle Download
  const handleDownload = () => {
    if (isPlaceholder) return;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkedin-post-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Split lines for "see more" simulation
  const rawLines = content.split('\n');
  const shouldTruncate = !isExpanded && rawLines.length > 5 && !isPlaceholder;
  const displayedContent = shouldTruncate 
    ? rawLines.slice(0, 4).join('\n')
    : content;

  return (
    <Card className="border-slate-800/90 shadow-2xl space-y-4">
      
      {/* Header Bar */}
      <CardHeader className="pb-3 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                LinkedIn Feed Live Preview
                <Badge variant="sky" className="text-[10px] font-medium font-mono">
                  1:1 Native
                </Badge>
              </CardTitle>
              <CardDescription className="text-[11px] text-slate-400">
                Simulate how readers experience your post on mobile & desktop
              </CardDescription>
            </div>
          </div>

          {/* Device Switcher and Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Device Toggle */}
            <div className="flex items-center bg-[#090e1c] p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-lg transition-all ${
                  deviceMode === 'desktop' 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Desktop Feed View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-lg transition-all ${
                  deviceMode === 'mobile' 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mobile Feed View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Copy Button */}
            <Button
              variant={copied ? "default" : "secondary"}
              size="sm"
              onClick={handleCopy}
              disabled={isPlaceholder}
              className={copied ? "bg-emerald-600 hover:bg-emerald-500 text-white" : ""}
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              <span>{copied ? 'Copied!' : 'Copy Post'}</span>
            </Button>

            {/* Save to Drafts Button */}
            <Button
              variant="subtleSky"
              size="sm"
              onClick={onSaveDraft}
              disabled={isPlaceholder}
            >
              <Bookmark className="w-3.5 h-3.5 mr-1" />
              <span>Save Draft</span>
            </Button>

            {/* Download Button */}
            <Button
              variant="secondary"
              size="iconSm"
              onClick={handleDownload}
              disabled={isPlaceholder}
              title="Download as Markdown"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* LinkedIn Post Mock Container */}
        <div className={`mx-auto transition-all duration-300 ${
          deviceMode === 'mobile' ? 'max-w-[390px]' : 'w-full'
        }`}>
          <div className="linkedin-card p-4 sm:p-5 border border-slate-200/90 shadow-2xl relative">
            
            {/* Post Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12 ring-1 ring-slate-200 shrink-0">
                  <AvatarImage 
                    src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"} 
                    alt={user?.full_name || "Author"} 
                  />
                  <AvatarFallback className="bg-slate-100 text-slate-700 font-bold">
                    {user?.full_name?.slice(0, 2).toUpperCase() || 'MS'}
                  </AvatarFallback>
                </Avatar>

                <div className="leading-tight">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-[14px] text-gray-900 hover:text-[#0a66c2] hover:underline cursor-pointer">
                      {user?.full_name || 'Mohan Sharma'}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-normal">• 1st</span>
                  </div>
                  <p className="text-[12px] text-gray-500 line-clamp-1 max-w-sm mt-0.5">
                    {user?.headline || 'Tech Educator | 150K+ LinkedIn | Founder @ Codebasics'}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                    <span>Just now</span>
                    <span>•</span>
                    <Globe className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>

              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Text Body */}
            <div className="linkedin-text mb-4 text-[14.5px] leading-relaxed text-gray-900 font-linkedin select-text">
              {displayedContent}
              {shouldTruncate && (
                <span 
                  onClick={() => setIsExpanded(true)}
                  className="text-gray-500 hover:text-[#0a66c2] cursor-pointer font-medium ml-1 inline-block"
                >
                  ...see more
                </span>
              )}
              {isExpanded && !isPlaceholder && (
                <span 
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer text-xs block mt-2 font-medium"
                >
                  (collapse preview)
                </span>
              )}
            </div>

            {/* Engagement Counts Bar */}
            <div className="flex items-center justify-between py-2 border-t border-b border-gray-100 text-[12px] text-gray-500 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="flex -space-x-1 shrink-0">
                  <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white shadow-sm">👍</span>
                  <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] text-white shadow-sm">❤️</span>
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] text-white shadow-sm">👏</span>
                </span>
                <span className="font-medium text-gray-600">{hasLiked ? 349 : 348} reactions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <span>42 comments</span>
                <span>•</span>
                <span>12 reposts</span>
              </div>
            </div>

            {/* Interaction Action Buttons */}
            <div className="flex items-center justify-between text-gray-600 pt-1 text-[13px] font-semibold">
              <button 
                onClick={() => setHasLiked(!hasLiked)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg hover:bg-gray-100 flex-1 transition-colors ${
                  hasLiked ? 'text-[#0a66c2]' : ''
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-[#0a66c2]' : ''}`} />
                <span className="hidden sm:inline">Like</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg hover:bg-gray-100 flex-1 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Comment</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg hover:bg-gray-100 flex-1 transition-colors">
                <Repeat className="w-4 h-4" />
                <span className="hidden sm:inline">Repost</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg hover:bg-gray-100 flex-1 transition-colors">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>

          </div>
        </div>

        {/* Analytics & Retention Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Characters</span>
            <p className="text-base font-bold text-white mt-0.5 font-mono">{chars}</p>
            <span className="text-[9px] text-slate-500">Max: 3,000</span>
          </div>

          <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Words</span>
            <p className="text-base font-bold text-white mt-0.5 font-mono">{words}</p>
            <span className="text-[9px] text-emerald-400 font-medium">Optimal: 120-180</span>
          </div>

          <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Whitespace Lines</span>
            <p className="text-base font-bold text-white mt-0.5 font-mono">{lines}</p>
            <span className="text-[9px] text-sky-400 font-medium">Thumb-skimmable</span>
          </div>

          <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. Read Time</span>
            <p className="text-base font-bold text-sky-400 mt-0.5 font-mono">~{readSeconds}s</p>
            <span className="text-[9px] text-slate-500">Scroll retention</span>
          </div>
        </div>

        {/* Mobile Hook Retention Insight */}
        {!isPlaceholder && (
          <div className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs ${
            isHookShort 
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
              : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
          }`}>
            {isHookShort ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            )}
            <div>
              <span className="font-bold block">
                {isHookShort 
                  ? 'Mobile-Optimized Hook Line' 
                  : 'Hook line exceeds 110 characters'}
              </span>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                {isHookShort 
                  ? 'Your opening line fits cleanly before the LinkedIn mobile fold without awkward cutoff.' 
                  : 'Consider trimming the first sentence so readers digest the entire punchline before hitting "...see more".'}
              </p>
            </div>
          </div>
        )}

      </CardContent>

    </Card>
  );
}
