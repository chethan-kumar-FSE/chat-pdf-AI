"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowUp, Bot, Copy, FileText, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function ChatSection({
  fileKey,
  chatId,
}: {
  fileKey: string;
  chatId: number;
}) {
  const [input, setInput] = useState("");

  // Prevent messages from being hydrated multiple times
  const hasHydrated = useRef(false);

  // Used for automatic scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------------ */
  /* Load previous messages                                                   */
  /* ------------------------------------------------------------------------ */

  const { data, isLoading } = useQuery({
    queryKey: ["messages", chatId],

    queryFn: async () => {
      const res = await axios.get("/api/get-messages", {
        params: { chatId },
      });

      return res.data;
    },
  });

  /* ------------------------------------------------------------------------ */
  /* AI Chat                                                                  */
  /* ------------------------------------------------------------------------ */

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",

      body: {
        fileKey,
        chatId,
      },
    }),
  });

  /* ------------------------------------------------------------------------ */
  /* Hydrate previous messages                                                */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* Auto scroll                                                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [messages]);

  /* ------------------------------------------------------------------------ */
  /* Submit message                                                           */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    sendMessage({
      text: input,
    });

    setInput("");
  };

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* ================================================================== */}
      {/* Header                                                             */}
      {/* ================================================================== */}

      <header className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
            <Sparkles className="h-3.5 w-3.5 text-foreground" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">Document AI</h2>

            <p className="text-[11px] text-muted-foreground">
              Ask questions about your PDF
            </p>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* Messages                                                           */}
      {/* ================================================================== */}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Loading previous messages */}

        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading conversation...
            </div>
          </div>
        ) : messages.length === 0 ? (
          /* -------------------------------------------------------------- */
          /* Empty state                                                    */
          /* -------------------------------------------------------------- */

          <EmptyState setInput={setInput} />
        ) : (
          /* -------------------------------------------------------------- */
          /* Messages                                                       */
          /* -------------------------------------------------------------- */

          <div className="space-y-7 px-5 py-6">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}

            {/* ---------------------------------------------------------- */}
            {/* AI streaming indicator                                    */}
            {/* ---------------------------------------------------------- */}

            {status === "streaming" && (
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Bot className="h-3.5 w-3.5" />
                </div>

                <div className="flex items-center gap-1 pt-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50" />

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------- */}
            {/* Scroll target                                               */}
            {/* ---------------------------------------------------------- */}

            <div ref={messagesEndRef} className="h-px" />
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* Composer                                                           */}
      {/* ================================================================== */}

      <div className="shrink-0 px-4 pb-4 pt-3">
        <form onSubmit={handleSubmit}>
          <div
            className={cn(
              "overflow-hidden rounded-xl border border-border bg-background",
              "shadow-sm transition-all",
              "focus-within:border-ring/50",
              "focus-within:ring-2 focus-within:ring-ring/10",
            )}
          >
            {/* ---------------------------------------------------------- */}
            {/* Textarea                                                    */}
            {/* ---------------------------------------------------------- */}

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status === "streaming"}
              placeholder="Ask anything about this document..."
              className={cn(
                "min-h-[72px] w-full resize-none",
                "border-0 bg-transparent",
                "px-3.5 pt-3.5",
                "text-sm leading-5",
                "shadow-none",
                "placeholder:text-muted-foreground/60",
                "focus-visible:ring-0",
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();

                  if (input.trim() && status !== "streaming") {
                    handleSubmit(e);
                  }
                }
              }}
            />

            {/* ---------------------------------------------------------- */}
            {/* Composer footer                                             */}
            {/* ---------------------------------------------------------- */}

            <div className="flex items-center justify-between px-2.5 pb-2.5">
              <div className="flex items-center gap-1.5 px-1">
                <FileText className="h-3 w-3 text-muted-foreground/60" />

                <span className="text-[11px] text-muted-foreground">
                  Answers are based on your document
                </span>
              </div>

              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || status === "streaming"}
                className="h-8 w-8 rounded-lg"
              >
                {status === "streaming" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
            Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Empty State                                                                */
/* ========================================================================== */

function EmptyState({
  setInput,
}: {
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) {
  const suggestions = [
    "Summarize this document",
    "What are the main points?",
    "Explain this document in simple terms",
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      {/* Icon */}

      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/50">
        <Bot className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Heading */}

      <h3 className="mt-4 text-sm font-semibold">Ask about this document</h3>

      {/* Description */}

      <p className="mt-1.5 max-w-[280px] text-center text-xs leading-5 text-muted-foreground">
        Ask questions, summarize sections, or find specific information from
        your PDF.
      </p>

      {/* Suggestions */}

      <div className="mt-6 w-full max-w-[300px] space-y-1.5">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setInput(suggestion)}
            className={cn(
              "group flex w-full items-center justify-between",
              "rounded-lg border border-border",
              "px-3 py-2.5",
              "text-left text-xs text-muted-foreground",
              "transition-colors",
              "hover:bg-muted",
              "hover:text-foreground",
            )}
          >
            <span>{suggestion}</span>

            <ArrowUp
              className="
                h-3 w-3
                rotate-45
                opacity-0
                transition-opacity
                group-hover:opacity-100
              "
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Message                                                                    */
/* ========================================================================== */

function Message({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3", isUser && "justify-end")}>
      {/* ================================================================== */}
      {/* AI icon                                                            */}
      {/* ================================================================== */}

      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
          <Bot className="h-3.5 w-3.5 text-foreground" />
        </div>
      )}

      {/* ================================================================== */}
      {/* Message content                                                   */}
      {/* ================================================================== */}

      <div
        className={cn(
          "max-w-[82%]",

          isUser
            ? "rounded-xl bg-primary px-3.5 py-2.5 text-primary-foreground"
            : "pt-1 text-foreground",
        )}
      >
        {message.parts.map((part, index) => {
          if (part.type !== "text") {
            return null;
          }

          return (
            <p key={index} className="whitespace-pre-wrap text-sm leading-6">
              {part.text}
            </p>
          );
        })}

        {/* ================================================================= */}
        {/* Copy button                                                      */}
        {/* ================================================================= */}

        {!isUser && (
          <div className="mt-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="
                h-7 w-7
                text-muted-foreground
                hover:text-foreground
              "
              onClick={() => {
                const text = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("");

                navigator.clipboard.writeText(text);
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
