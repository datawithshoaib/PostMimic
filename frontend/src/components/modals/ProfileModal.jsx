import React, { useState, useEffect } from 'react';
import { User, Check, Sparkles } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function ProfileModal({
  isOpen,
  onClose,
  user,
  onUpdateProfile,
  isLoading
}) {
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setHeadline(user.headline || '');
      setAvatarUrl(user.avatar_url || '');
      setLinkedinUrl(user.linkedin_url || '');
    }
  }, [user, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile({
      full_name: fullName.trim(),
      headline: headline.trim(),
      avatar_url: avatarUrl.trim(),
      linkedin_url: linkedinUrl.trim()
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white">
                Edit Profile & Author Brand
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Customize how your author info appears on LinkedIn live preview
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          {/* Live Mini Preview */}
          <div className="p-3 rounded-2xl bg-[#080d1a] border border-slate-800 flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-1 ring-slate-700">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="bg-sky-950 text-sky-300 font-bold text-xs">
                {fullName?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {fullName || 'Your Name'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {headline || 'Your Headline or Title'}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <Input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Mohan Sharma"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">LinkedIn Headline</label>
            <Input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Founder @ Codebasics | 150K+ LinkedIn"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Avatar Image URL</label>
            <Input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">LinkedIn Profile URL</label>
            <Input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/username"
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="default"
            disabled={isLoading}
            className="w-full mt-2 font-bold gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Profile Changes'}</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
