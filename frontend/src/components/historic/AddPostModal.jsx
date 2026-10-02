"use client";

import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AddPostModal({ isOpen, onClose, onAddPost, isSubmitting }) {
  const [text, setText] = useState('');
  const [engagement, setEngagement] = useState(150);
  const [language, setLanguage] = useState('English');
  const [tagsInput, setTagsInput] = useState('Career, JobSearch');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onAddPost({
      text: text.trim(),
      engagement: parseInt(engagement) || 150,
      language,
      tags: tags.length ? tags : ['Career']
    });

    setText('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="pb-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white">
                Add Historic Post Sample
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Paste a high-performing past post to train your Style Persona
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              LinkedIn Post Content
            </label>
            <Textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your past LinkedIn post text here with its original spacing and line breaks..."
              required
              className="text-xs leading-relaxed font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Estimated Reactions (Likes)
              </label>
              <Input
                type="number"
                value={engagement}
                onChange={(e) => setEngagement(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hinglish">Hinglish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Topic Tags (comma-separated)
            </label>
            <Input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Career, AI, Motivation, Leadership"
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="default"
            disabled={!text.trim() || isSubmitting}
            className="w-full mt-2 font-bold gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving & Analyzing...' : 'Add Sample & Retrain Style DNA'}</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
