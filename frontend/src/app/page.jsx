"use client";

import dynamic from "next/dynamic";

const PostMimicApp = dynamic(() => import("@/components/PostMimicApp"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
      <div className="flex items-center space-x-3">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Loading PostMimic...</span>
      </div>
    </div>
  ),
});

export default function HomePage() {
  return <PostMimicApp />;
}
