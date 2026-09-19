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
  CheckCircle2
} from 'lucide-react';
import HistoricCard from './HistoricCard';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#101628] via-[#141d33] to-[#101628] border border-slate-800 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Extracted Historic Posts
              </h1>
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold font-mono">
                {historicPosts.length} Samples
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              These 10 to 15 posts are extracted from LinkedIn to reverse-engineer your Style DNA and provide in-context few-shot learning for the Writer Agent.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenLinkedInModal}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-sky-600/25"
          >
            <Linkedin className="w-4 h-4" />
            <span>Sync from LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={onReanalyzeStyle}
            disabled={isReanalyzing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all"
          >
            <Dna className={`w-4 h-4 text-sky-400 ${isReanalyzing ? 'animate-spin' : ''}`} />
            <span>{isReanalyzing ? 'Analyzing DNA...' : 'Re-Analyze Style'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel border border-slate-800">
        
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-[#090e1c] px-3.5 py-2 rounded-xl border border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search historic posts by topic, hook, or keyword..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-[#090e1c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-sky-500"
          >
            <option value="ALL">All Languages ({historicPosts.length})</option>
            <option value="English">English only</option>
            <option value="Hinglish">Hinglish only</option>
          </select>

          {/* Add Post Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>Add Post</span>
          </button>
        </div>

      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800 space-y-3">
          <Inbox className="w-12 h-12 mx-auto text-slate-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-300">No historic posts found</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Try adjusting your search query or language filter, or click "Sync from LinkedIn" above.
            </p>
          </div>
        </div>
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
