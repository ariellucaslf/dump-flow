"use client";

import { LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";

export function UserAccountMenu({ username }: { username: string }) {
  return (
    <div className="border-t border-neutral-800 pt-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
            <User className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="text-sm font-medium text-white truncate max-w-[100px]">{username}</span>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          title="Sair"
          className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
