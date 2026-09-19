import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  History, 
  Dna, 
  Layers, 
  Linkedin, 
  User, 
  LogOut, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  user, 
  currentTab, 
  setCurrentTab, 
  historicCount, 
  draftsCount,
  openAuthModal, 
  openLinkedInModal, 
  openProfileModal, 
  onLogout,
  onDemoLogin
}) {
  const tabs = [
    { id: 'studio', label: 'Agent Studio', icon: Cpu },
    { id: 'historic', label: 'Historic Posts', icon: History, count: historicCount },
    { id: 'style', label: 'Style DNA', icon: Dna },
    { id: 'drafts', label: 'Drafts & Trace', icon: Layers, count: draftsCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('studio')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Post<span className="text-sky-400">Mimic</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                Multi-Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block -mt-0.5">
              LinkedIn Style Cloner & Multi-Agent Feedback Studio
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#101626]/80 p-1.5 rounded-xl border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono font-semibold ${
                    isActive ? 'bg-sky-700/60 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* LinkedIn Status / Sync Pill */}
          <button
            onClick={openLinkedInModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121a2d] border border-slate-800 hover:border-sky-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Linkedin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="hidden sm:inline">
              {user ? `Connected: ${user.full_name?.split(' ')[0]}` : 'Connect Profile'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              {/* User Avatar & Info */}
              <button
                onClick={openProfileModal}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all text-left"
              >
                <img
                  src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <div className="hidden xl:block leading-tight">
                  <p className="text-xs font-semibold text-white truncate max-w-[110px]">
                    {user.full_name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[110px]">
                    {user.headline || 'Content Creator'}
                  </p>
                </div>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onDemoLogin}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-all"
              >
                1-Click Demo
              </button>
              <button
                onClick={openAuthModal}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/25 transition-all"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-800/60 bg-[#0e1424] px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
                isActive ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
