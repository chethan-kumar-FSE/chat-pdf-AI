"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function ChatSection({
  fileKey,
  chatId,
}: {
  fileKey: string;
  chatId: number;
}) {
  const [input, setInput] = useState("");
  const hasHydrated = useRef(false);

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
      body: { fileKey, chatId },
    }),
  });

  useEffect(() => {
    if (!isLoading && data?.messages && !hasHydrated.current) {
      const initialMessages: UIMessage[] = data.messages.map((m: any) => ({
        id: String(m.id),
        role: m.role,
        parts: [{ type: "text", text: m.content }],
      }));
      setMessages(initialMessages);
      hasHydrated.current = true;
    }
  }, [isLoading, data, setMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 px-1">
        {isLoading && (
          <p className="text-sm text-neutral-400 p-4">Loading messages...</p>
        )}
        {!isLoading && messages.length === 0 && (
          <p className="text-sm text-neutral-400 text-center mt-8">
            Ask a question about this PDF to get started
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`text-sm rounded-lg px-3 py-2 max-w-[85%] ${
              m.role === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-neutral-100 text-neutral-900"
            }`}
          >
            {m.parts.map((part, i) =>
              part.type === "text" ? <span key={i}>{part.text}</span> : null,
            )}
          </div>
        ))}
        {status === "streaming" && (
          <p className="text-xs text-neutral-400">Thinking...</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t pt-3 mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the PDF..."
          className="flex-1 border rounded-md px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={status === "streaming"}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
