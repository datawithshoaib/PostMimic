import React, { useState } from 'react';
import { Linkedin, Sparkles, Check, ArrowRight, User } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function LinkedInModal({
  isOpen,
  onClose,
  onExtractUrl,
  onSelectPreset,
  onImportCustomPosts,
  isLoading
}) {
  const [url, setUrl] = useState('');
  const [customPostsText, setCustomPostsText] = useState('');

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onExtractUrl(url.trim());
  };

  const handleCustomPostsSubmit = (e) => {
    e.preventDefault();
    if (!customPostsText.trim()) return;
    const posts = customPostsText
      .split('\n---\n')
      .map((p) => p.trim())
      .filter(Boolean);

    onImportCustomPosts(posts.length > 0 ? posts : [customPostsText.trim()]);
  };

  const presets = [
    {
      key: 'tech_educator',
      name: 'Mohan Sharma',
      role: 'Tech Educator & Mentor',
      badge: '10 Authentic Posts',
      badgeVariant: 'sky'
    },
    {
      key: 'ai_founder',
      name: 'Sarah Chen',
      role: 'AI Agent Founder',
      badge: '10 AI Agent Posts',
      badgeVariant: 'success'
    },
    {
      key: 'growth_creator',
      name: 'Arjun Mehta',
      role: 'B2B SaaS Growth Lead',
      badge: '10 High-Growth Posts',
      badgeVariant: 'purple'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-1">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#0a66c2]/20 text-sky-400 border border-sky-500/30">
              <Linkedin className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-white">
                Connect LinkedIn & Sync 10–15 Posts
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Extract historic posts to train your autonomous Style Persona
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Option 1: Profile URL */}
          <div className="p-4 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200 block">
              Method 1: Extract from Profile URL
            </span>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/your-profile"
                className="flex-1 text-xs"
              />
              <Button
                type="submit"
                variant="linkedin"
                size="default"
                disabled={isLoading || !url.trim()}
                className="shrink-0 font-bold"
              >
                {isLoading ? 'Extracting...' : 'Extract'}
              </Button>
            </form>
          </div>

          {/* Option 2: Instant Persona Presets */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200 block">
              Method 2: Select an Instant Creator Persona
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {presets.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => onSelectPreset(preset.key)}
                  disabled={isLoading}
                  className="p-3.5 rounded-2xl bg-[#080d1a] hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 text-left transition-all duration-200 group"
                >
                  <span className="text-xs font-bold text-white block group-hover:text-sky-300 transition-colors">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">
                    {preset.role}
                  </span>
                  <Badge variant={preset.badgeVariant} className="mt-2.5 text-[9px] font-mono px-1.5 py-0">
                    {preset.badge}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Option 3: Bulk Paste */}
          <div className="p-4 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-200 block">
              Method 3: Direct Past Post Paste (Separated by ---)
            </span>
            <Textarea
              rows={4}
              value={customPostsText}
              onChange={(e) => setCustomPostsText(e.target.value)}
              placeholder="Paste 10-15 past posts separated by '---' on a new line..."
              className="text-xs leading-relaxed"
            />
            <Button
              type="button"
              variant="secondary"
              size="default"
              onClick={handleCustomPostsSubmit}
              disabled={isLoading || !customPostsText.trim()}
              className="w-full font-bold"
            >
              Import Pasted Posts & Re-train Style DNA
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
