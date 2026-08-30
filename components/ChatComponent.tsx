"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowUp,
  Bot,
  Copy,
  FileText,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import UpgradeButton from "./UpgradeButton";

export default function ChatSection({
  isPro,
  fileKey,
  chatId,
}: {
  isPro: boolean;
  fileKey: string;
  chatId: number;
}) {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const hasHydrated = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["messages", chatId],

    queryFn: async () => {
      const res = await axios.get("/api/get-messages", {
        params: { chatId },
      });

      return res.data;
    },
  });

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",

      body: {
        fileKey,
        chatId,
      },
    }),
  });

  useEffect(() => {
    if (!isLoading && data?.messages && !hasHydrated.current) {
      const initialMessages: UIMessage[] = data.messages.map((m: any) => ({
        id: String(m.id),

        role: m.role,

        parts: [
          {
            type: "text",
            text: m.content,
          },
        ],
      }));

      setMessages(initialMessages);

      hasHydrated.current = true;
    }
  }, [isLoading, data, setMessages]);

  useEffect(() => {
    if (status === "ready" || status === "error") {
      setIsGenerating(false);
    }
  }, [status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    if (isGenerating) return;

    setIsGenerating(true);

    sendMessage({
      text: input,
    });

    setInput("");
  };

  const currentTotalMessages = messages.length;

  const MAX_FREE_MESSAGES = 10;

  const isLimitReached = !isPro && currentTotalMessages >= MAX_FREE_MESSAGES;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#080c15] text-slate-200">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-4 bg-[#090d18]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(0,210,255,0.3)]">
            <Sparkles className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>MindSpark Assistant</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">
              Vector Context Active
            </p>
          </div>
        </div>

        {isPro && (
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
            <Zap className="h-3 w-3 fill-current" />
            PRO
          </span>
        )}
      </header>

      {/* Messages Scroll Area */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-[#07090e]/60">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              <span>Retrieving neural conversation...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <EmptyState setInput={setInput} />
        ) : (
          <div className="space-y-6 px-4 py-5">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}

            {isGenerating && <TypingIndicator />}

            <div ref={messagesEndRef} className="h-px" />
          </div>
        )}
      </div>

      {/* Input Dock */}
      <div className="shrink-0 p-3 bg-[#080c15] border-t border-white/[0.06]">
        <form onSubmit={handleSubmit}>
          {isLimitReached ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-center shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Free Message Limit Reached (10/10)</span>
              </div>

              <p className="mt-1 max-w-sm text-[11px] text-slate-400">
                Upgrade to Pro for unrestricted conversations and continuous
                intelligence.
              </p>

              <UpgradeButton isPro={isPro} className="mt-3 h-8 text-xs" />
            </div>
          ) : (
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c101c]/90",
                "shadow-lg transition-all duration-300",
                "focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_-3px_rgba(0,210,255,0.2)]",
              )}
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isGenerating || status === "streaming"}
                placeholder="Ask anything about this document..."
                className={cn(
                  "min-h-[70px] w-full resize-none",
                  "border-0 bg-transparent",
                  "p-3",
                  "text-xs leading-relaxed text-slate-100",
                  "placeholder:text-slate-500",
                  "focus-visible:ring-0 shadow-none",
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    if (
                      input.trim() &&
                      !isGenerating &&
                      status !== "streaming" &&
                      !isLimitReached
                    ) {
                      handleSubmit(e);
                    }
                  }
                }}
              />

              <div className="flex items-center justify-between px-3 pb-2.5">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <FileText className="h-3 w-3 text-cyan-400/80" />
                  <span>
                    {isPro
                      ? "Unlimited Pro Access"
                      : `${Math.max(0, 10 - currentTotalMessages)} msgs remaining`}
                  </span>
                </div>

                <Button
                  type="submit"
                  size="icon"
                  variant="glow"
                  disabled={
                    !input.trim() ||
                    isGenerating ||
                    status === "streaming" ||
                    isLimitReached
                  }
                  className="h-7 w-7 rounded-lg"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />
                  ) : (
                    <ArrowUp className="h-3.5 w-3.5 text-slate-950 stroke-[3]" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <p className="mt-1.5 text-center text-[10px] text-slate-500 font-mono">
            {isLimitReached
              ? "Upgrade to unlock continuous messaging"
              : "Enter to send · Shift + Enter for new line"}
          </p>
        </form>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
        <Bot className="h-3.5 w-3.5" />
      </div>

      <div className="flex items-center gap-2 pt-1.5">
        <span className="text-xs text-slate-400 font-mono">Synthesizing</span>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  setInput,
}: {
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) {
  const suggestions = [
    "Summarize the entire document",
    "What are the key conclusions?",
    "Extract major figures & metrics",
    "List potential risks or open questions",
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-8">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
        <Bot className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white">Ask Document AI</h3>
      <p className="mt-1 text-center text-xs text-slate-400 max-w-[260px] leading-relaxed">
        Query any section, request summaries, or verify citations instantly.
      </p>

      <div className="mt-5 w-full space-y-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setInput(suggestion)}
            className={cn(
              "group flex w-full items-center justify-between",
              "rounded-xl border border-white/[0.08] bg-white/[0.02]",
              "px-3 py-2 text-left text-xs text-slate-300",
              "transition-all duration-200",
              "hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-white",
            )}
          >
            <span>{suggestion}</span>
            <ArrowUp className="h-3 w-3 rotate-45 text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Message({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-2.5", isUser && "justify-end")}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Bot className="h-3.5 w-3.5" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl text-xs leading-relaxed",
          isUser
            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium px-3.5 py-2.5 shadow-[0_0_15px_-3px_rgba(0,210,255,0.3)]"
            : "bg-white/[0.03] border border-white/[0.08] text-slate-200 px-3.5 py-3 shadow-md",
        )}
      >
        {message.parts.map((part, index) => {
          if (part.type !== "text") return null;

          return (
            <p key={index} className="whitespace-pre-wrap">
              {part.text}
            </p>
          );
        })}

        {!isUser && (
          <div className="mt-2.5 flex items-center justify-end border-t border-white/[0.06] pt-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded-md"
              onClick={() => {
                const text = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("");
                navigator.clipboard.writeText(text);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
