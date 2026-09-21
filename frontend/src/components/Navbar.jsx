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
  ChevronRight,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
    { id: 'studio', label: 'Agent Studio', icon: Cpu, badge: 'Live' },
    { id: 'historic', label: 'Historic Posts', icon: History, count: historicCount },
    { id: 'style', label: 'Style DNA', icon: Dna },
    { id: 'drafts', label: 'Drafts & Trace', icon: Layers, count: draftsCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090d19]/85 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('studio')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/35 group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Post<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">Mimic</span>
              </span>
              <Badge variant="sky" className="text-[10px] font-mono px-2 py-0 hidden sm:inline-flex">
                Multi-Agent
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block -mt-0.5 font-medium">
              LinkedIn Style Cloner & Multi-Agent Feedback Studio
            </p>
          </div>
        </div>

        {/* Navigation Tabs (shadcn style) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#0e1424]/90 p-1 rounded-2xl border border-slate-800/90 shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold ${
                    isActive ? 'bg-sky-700/70 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* LinkedIn Connection Pill */}
          <button
            onClick={openLinkedInModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f172a]/90 border border-slate-800 hover:border-sky-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm group"
          >
            <Linkedin className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden sm:inline">
              {user ? `Connected: ${user.full_name?.split(' ')[0]}` : 'Sync LinkedIn'}
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              {/* User Profile trigger with shadcn Avatar */}
              <button
                onClick={openProfileModal}
                className="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all text-left group"
                title="Edit author profile & persona brand"
              >
                <Avatar className="w-8 h-8 ring-1 ring-slate-700 group-hover:ring-sky-500 transition-all">
                  <AvatarImage src={user.avatar_url} alt={user.full_name} />
                  <AvatarFallback className="text-[11px] bg-sky-950 text-sky-300 font-bold">
                    {user.full_name?.slice(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden xl:block leading-tight">
                  <p className="text-xs font-bold text-white truncate max-w-[110px]">
                    {user.full_name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[110px]">
                    {user.headline || 'Content Creator'}
                  </p>
                </div>
              </button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="iconSm"
                onClick={onLogout}
                title="Logout"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onDemoLogin}
                className="text-sky-300 hover:text-sky-200 border-sky-500/20"
              >
                <Zap className="w-3 h-3 text-sky-400 mr-1" />
                1-Click Demo
              </Button>
              <Button
                variant="gradient"
                size="sm"
                onClick={openAuthModal}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-800/80 bg-[#0a0f1d] px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-all ${
                isActive ? 'text-sky-400 font-bold bg-sky-500/10' : 'text-slate-400 hover:text-slate-200'
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
