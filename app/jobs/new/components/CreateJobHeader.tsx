"use client";

import { Bell, HelpCircle } from "lucide-react";

export default function CreateJobHeader() {
  return (
    <div className="absolute top-4 right-6 flex items-center gap-4">
      {/* Save Draft */}
      <button className="px-4 py-2 rounded-lg bg-[#111827] border border-white/10 text-sm hover:bg-white/5 cursor-pointer">
        Save Draft
      </button>

      {/* Help */}
      <HelpCircle
        size={18}
        className="text-slate-400 hover:text-white cursor-pointer"
      />

      {/* Notifications */}
      <Bell
        size={18}
        className="text-slate-400 hover:text-white cursor-pointer"
      />

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-black text-xs font-semibold cursor-pointer">
        A
      </div>
    </div>
  );
}
