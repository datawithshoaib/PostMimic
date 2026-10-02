"use client";

import React, { useState } from 'react';
import { Linkedin, Sparkles, Check, ArrowRight, User, Link2, Copy, FileText } from 'lucide-react';
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';

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
      badgeVariant: 'sky',
      desc: 'Vulnerable, career mentor voice with honest reflection'
    },
    {
      key: 'ai_founder',
      name: 'Sarah Chen',
      role: 'AI Agent Founder',
      badge: '10 AI Agent Posts',
      badgeVariant: 'success',
      desc: 'Technical insights on autonomous agent systems'
    },
    {
      key: 'growth_creator',
      name: 'Arjun Mehta',
      role: 'B2B SaaS Growth Lead',
      badge: '10 High-Growth Posts',
      badgeVariant: 'purple',
      desc: 'Data-driven B2B product growth experiments'
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

        {/* Tabbed Extraction Interface */}
        <Tabs defaultValue="presets" className="w-full pt-2">
          <TabsList className="grid grid-cols-3 w-full mb-3">
            <TabsTrigger value="presets" className="text-xs gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Presets</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="text-xs gap-1.5">
              <Link2 className="w-3.5 h-3.5" />
              <span>Profile URL</span>
            </TabsTrigger>
            <TabsTrigger value="paste" className="text-xs gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Bulk Paste</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Instant Creator Presets */}
          <TabsContent value="presets" className="space-y-3 mt-0">
            <p className="text-xs text-slate-400">
              Select a pre-trained creator persona with 10 real sample posts to start generating immediately:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {presets.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => onSelectPreset(preset.key)}
                  disabled={isLoading}
                  className="p-3.5 rounded-2xl bg-[#080d1a] hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 text-left transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-sky-300 transition-colors">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">
                      {preset.role}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2">
                      {preset.desc}
                    </p>
                  </div>
                  <Badge variant={preset.badgeVariant} className="mt-2.5 text-[9px] font-mono px-1.5 py-0 self-start">
                    {preset.badge}
                  </Badge>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: Profile URL Extract */}
          <TabsContent value="url" className="space-y-3 mt-0">
            <div className="p-4 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-slate-200 block">
                Extract from Public LinkedIn URL
              </span>
              <p className="text-[11px] text-slate-400">
                Enter your public profile link to automatically analyze and extract sample post data.
              </p>
              <form onSubmit={handleUrlSubmit} className="flex gap-2 pt-1">
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
          </TabsContent>

          {/* Tab 3: Bulk Paste */}
          <TabsContent value="paste" className="space-y-3 mt-0">
            <div className="p-4 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-slate-200 block">
                Direct Past Post Paste
              </span>
              <p className="text-[11px] text-slate-400">
                Paste 10 to 15 of your past posts separated by <code className="text-sky-300 font-mono">---</code> on a new line:
              </p>
              <Textarea
                rows={5}
                value={customPostsText}
                onChange={(e) => setCustomPostsText(e.target.value)}
                placeholder={"Looking for jobs on LinkedIn is hard...\n---\nThe hardest skill in tech is explaining simple things...\n---\n..."}
                className="text-xs leading-relaxed font-sans"
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
