"use client";

import React from "react";
import {
  Sparkles, Cpu, History, Dna, Layers, Linkedin, User, LogOut,
  ChevronDown, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export default function Navbar({
  user, currentTab, setCurrentTab, historicCount, draftsCount,
  openAuthModal, openLinkedInModal, openProfileModal, onLogout,
  onDemoLogin, onSelectPreset,
}) {
  const tabs = [
    { id: "studio", label: "Studio", icon: Cpu },
    { id: "historic", label: "Samples", icon: History, count: historicCount },
    { id: "style", label: "Style DNA", icon: Dna },
    { id: "drafts", label: "Drafts", icon: Layers, count: draftsCount },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#080d17]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <button
          onClick={() => setCurrentTab("studio")}
          className="group flex shrink-0 items-center gap-3 text-left"
          aria-label="PostMimic home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-950/40 ring-1 ring-white/10 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span>
            <span className="block text-[17px] font-bold tracking-tight text-white">
              Post<span className="text-sky-400">Mimic</span>
            </span>
            <span className="hidden text-[11px] font-medium text-slate-500 sm:block">LinkedIn writing studio</span>
          </span>
        </button>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 rounded-xl border border-slate-800/80 bg-slate-950/50 p-1 md:flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                aria-current={active ? "page" : undefined}
                className={`flex h-9 items-center gap-2 rounded-lg px-3.5 text-[13px] font-medium transition-colors ${active ? "bg-slate-800 text-white shadow-sm ring-1 ring-white/5" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"}`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-sky-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && <span className={`min-w-5 rounded-md px-1 text-center text-[10px] tabular-nums ${active ? "bg-slate-700 text-slate-200" : "bg-slate-900 text-slate-500"}`}>{tab.count}</span>}
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openLinkedInModal}
            className="h-9 gap-2 border-slate-700 bg-slate-900/70 px-3 text-slate-300 hover:border-sky-500/50 hover:bg-slate-800 hover:text-white"
            title="Sync or switch LinkedIn profile posts"
          >
            <Linkedin className="h-4 w-4 text-sky-400" />
            <span className="hidden lg:inline">{user ? "LinkedIn" : "Connect"}</span>
            {user && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-10 items-center gap-2 rounded-xl border border-transparent px-1.5 pr-2.5 text-left transition-colors hover:border-slate-800 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50" aria-label="User account menu">
                  <Avatar className="h-8 w-8 ring-1 ring-slate-700">
                    <AvatarImage src={user.avatar_url} alt={user.full_name} />
                    <AvatarFallback className="bg-sky-950 font-semibold text-sky-300">{user.full_name?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 xl:block">
                    <span className="block truncate text-xs font-semibold text-slate-200">{user.full_name}</span>
                    <span className="block truncate text-[10px] text-slate-500">{user.headline || "Content creator"}</span>
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-slate-500 xl:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="pb-1">
                  <span className="block text-xs font-semibold text-white">{user.full_name}</span>
                  <span className="block truncate text-[10px] font-normal text-slate-400">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={openProfileModal} className="gap-2"><User className="h-4 w-4 text-sky-400" />Edit author profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={openLinkedInModal} className="gap-2"><Linkedin className="h-4 w-4 text-sky-400" />LinkedIn sync & presets</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentTab("style")} className="gap-2"><Dna className="h-4 w-4 text-violet-400" />Inspect Style DNA</DropdownMenuItem>
                </DropdownMenuGroup>
                {onSelectPreset && <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[10px] text-slate-500">Switch demo persona</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onSelectPreset("tech_educator")}>Mohan Sharma · Educator</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSelectPreset("ai_founder")}>Sarah Chen · AI Founder</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSelectPreset("growth_creator")}>Arjun Mehta · Growth Lead</DropdownMenuItem>
                </>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="gap-2 text-rose-400 focus:bg-rose-500/10 focus:text-rose-300"><LogOut className="h-4 w-4" />Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : <>
            <Button variant="secondary" size="sm" onClick={onDemoLogin} className="hidden h-9 gap-1.5 sm:inline-flex"><Zap className="h-3.5 w-3.5 text-amber-400" />Demo</Button>
            <Button size="sm" onClick={openAuthModal} className="h-9">Sign in</Button>
          </>}
        </div>
      </div>

      <nav aria-label="Mobile navigation" className="grid grid-cols-4 border-t border-slate-800/70 bg-slate-950/50 px-2 py-1.5 md:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.id;
          return <button key={tab.id} onClick={() => setCurrentTab(tab.id)} aria-current={active ? "page" : undefined} className={`flex flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium ${active ? "text-sky-300" : "text-slate-500 hover:text-slate-300"}`}>
            <span className="relative"><Icon className="h-[17px] w-[17px]" />{tab.count > 0 && <span className="absolute -right-2 -top-1 rounded-full bg-sky-500 px-1 text-[8px] leading-3 text-white">{tab.count}</span>}</span>
            <span>{tab.label}</span>
          </button>;
        })}
      </nav>
    </header>
  );
}
