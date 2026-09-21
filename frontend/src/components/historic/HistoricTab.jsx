import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Plus, 
  RefreshCw, 
  Dna, 
  Filter, 
  Linkedin, 
  Inbox,
  Flame,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import HistoricCard from './HistoricCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function HistoricTab({
  historicPosts,
  onUseTopic,
  onDeletePost,
  onOpenAddModal,
  onOpenLinkedInModal,
  onReanalyzeStyle,
  isReanalyzing
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('ALL');

  const filteredPosts = useMemo(() => {
    return historicPosts.filter((post) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q 
        || post.text.toLowerCase().includes(q) 
        || (post.tags && post.tags.some(t => t.toLowerCase().includes(q)));
      
      const matchesLang = languageFilter === 'ALL' || post.language === languageFilter;
      return matchesSearch && matchesLang;
    });
  }, [historicPosts, searchQuery, languageFilter]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <Card className="border-slate-800/90 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-sky-500/10 via-blue-500/5 to-transparent pointer-events-none"></div>
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Extracted Historic Posts
                </h1>
                <Badge variant="sky" className="font-mono text-xs font-bold">
                  {historicPosts.length} Samples
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                These 10 to 15 posts are extracted from LinkedIn to reverse-engineer your Style DNA and provide in-context few-shot learning for the Writer Agent.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="linkedin"
              size="sm"
              onClick={onOpenLinkedInModal}
              className="gap-2"
            >
              <Linkedin className="w-4 h-4" />
              <span>Sync from LinkedIn</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={onReanalyzeStyle}
              disabled={isReanalyzing}
              className="gap-2"
            >
              <Dna className={`w-4 h-4 text-sky-400 ${isReanalyzing ? 'animate-spin' : ''}`} />
              <span>{isReanalyzing ? 'Analyzing DNA...' : 'Re-Analyze Style'}</span>
            </Button>
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
              placeholder="Search historic posts by topic, hook, or tag..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none h-7"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Language Filter & Add Post */}
          <div className="flex items-center gap-2.5">
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="bg-[#090e1c] border border-slate-750 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-sky-500 h-9"
            >
              <option value="ALL">All Languages ({historicPosts.length})</option>
              <option value="English">English only</option>
              <option value="Hinglish">Hinglish only</option>
            </select>

            <Button
              variant="default"
              size="sm"
              onClick={onOpenAddModal}
              className="gap-1.5 font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Post Sample</span>
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Card className="text-center py-16 border-slate-800/80">
          <CardContent className="space-y-3">
            <Inbox className="w-12 h-12 mx-auto text-slate-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-300">No historic posts found</h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-sm mx-auto">
                Try adjusting your search query or language filter, or click "Sync from LinkedIn" above to import posts.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post, idx) => (
            <HistoricCard
              key={post.id || idx}
              post={post}
              index={idx}
              onUseTopic={onUseTopic}
              onDelete={onDeletePost}
            />
          ))}
        </div>
      )}

    </div>
  );
}
