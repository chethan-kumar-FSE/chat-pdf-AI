"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useClerk } from "@clerk/nextjs";
import { FileText, Plus, Settings, LogOut, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Chat = {
  id: number;
  fileName?: string | null;
  pdfName?: string | null;
};

type Props = {
  chats: Chat[];
  chatId: number;
};

export default function Sidebar({ chats, chatId }: Props) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="flex h-dvh w-[260px] shrink-0 flex-col border-r border-white/[0.08] bg-[#080c15] text-slate-200">
      {/* Brand */}
      <div className="flex h-16 items-center px-4 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px] shadow-[0_0_15px_rgba(0,210,255,0.3)]">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#07090e]">
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
          </div>

          <span className="text-sm font-bold tracking-tight text-white">
            Mind<span className="text-cyan-400">Spark</span>
          </span>
        </Link>
      </div>

      {/* New chat button */}
      <div className="p-3">
        <Button
          asChild
          variant="glow"
          className="h-10 w-full rounded-xl px-3 font-semibold text-xs shadow-[0_0_15px_rgba(0,210,255,0.25)]"
        >
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" />
            <span>New Document</span>
          </Link>
        </Button>
      </div>

      {/* Documents List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        <div className="mb-2.5 flex items-center justify-between px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          <span>Documents</span>
          <span className="rounded-full bg-white/[0.06] px-1.5 py-0.2 text-[10px] text-cyan-400">
            {chats.length}
          </span>
        </div>

        <div className="space-y-1">
          {chats.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <FileText className="mx-auto h-6 w-6 text-slate-600" />
              <p className="mt-2 text-xs text-slate-500">
                No documents uploaded yet
              </p>
            </div>
          ) : (
            chats.map((chat) => {
              const active = chat.id === chatId;

              return (
                <Link
                  key={chat.id}
                  href={`/chats/${chat.id}`}
                  className={cn(
                    "group relative flex h-10 items-center gap-2.5 rounded-xl px-3 text-xs transition-all duration-200",
                    active
                      ? "bg-cyan-500/10 border border-cyan-500/30 text-white shadow-[0_0_15px_-3px_rgba(0,210,255,0.2)] font-medium"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent",
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
                  )}

                  <FileText
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-colors",
                      active
                        ? "text-cyan-400"
                        : "text-slate-500 group-hover:text-slate-300",
                    )}
                  />

                  <span className="min-w-0 flex-1 truncate">
                    {chat.pdfName ?? `Document ${chat.id}`}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom User Area */}
      <div className="space-y-2 border-t border-white/[0.06] p-3 bg-[#06080e]/60">
        <div className="flex items-center gap-2.5 px-2 py-1.5 text-xs text-slate-300 rounded-xl bg-white/[0.02]">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-7 w-7 rounded-lg ring-1 ring-cyan-500/30",
              },
            }}
          />
          <span className="text-xs font-medium text-slate-300 truncate">
            Account
          </span>
        </div>

        <Button
          variant="ghost"
          onClick={() => signOut({ redirectUrl: "/" })}
          className="h-9 w-full justify-start gap-2.5 px-3 text-xs text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign out</span>
        </Button>
      </div>
    </aside>
  );
}
