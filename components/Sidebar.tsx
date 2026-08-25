"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  MessageSquare,
  Plus,
  Settings,
  PanelLeft,
} from "lucide-react";

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

  return (
    <aside className="flex h-dvh w-[250px] shrink-0 flex-col border-r border-border bg-background">
      {/* Brand */}
      <div className="flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>

          <span className="text-sm font-semibold tracking-tight">DocChat</span>
        </Link>
      </div>

      {/* New chat */}
      <div className="px-3 pb-4">
        <Button asChild className="h-10 w-full rounded-lg px-3 font-medium">
          <Link
            href="/"
            className="flex w-full items-center justify-start gap-2.5"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>New document</span>
          </Link>
        </Button>
      </div>

      {/* Documents */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3">
        <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Documents
        </div>

        <div className="space-y-0.5">
          {chats.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <FileText className="mx-auto h-5 w-5 text-muted-foreground/50" />

              <p className="mt-2 text-xs text-muted-foreground">
                No documents yet
              </p>
            </div>
          ) : (
            chats.map((chat) => {
              const active = chat.id === chatId;
              console.log(chat);

              return (
                <Link
                  key={chat.id}
                  href={`/chats/${chat.id}`}
                  className={cn(
                    "group flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <FileText
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-foreground" : "text-muted-foreground",
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

      {/* Bottom navigation */}
      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          className="h-9 w-full justify-start gap-2 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </aside>
  );
}
