// src/app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { getPineconeIndex } from "@/lib/pinecone";
import { getEmbeddings } from "@/lib/embedding";
import { convertToAscii } from "@/lib/utils";
import { db } from "@/lib/db";
import { message } from "@/lib/db/schema";

export async function POST(req: Request) {
  const {
    messages,
    fileKey,
    chatId,
  }: { messages: UIMessage[]; fileKey: string; chatId: string } =
    await req.json();

  // 1. Get the latest user question as plain text

  console.log("messages--", messages);
  const lastMessage = messages[messages.length - 1];
  const userQuestion =
    lastMessage.parts.find((p) => p.type === "text")?.text ?? "";

  await db.insert(message).values({
    chatId: Number(chatId),
    content: userQuestion,
    role: "user",
  });

  // 2. Embed the question
  const queryEmbedding = await getEmbeddings(userQuestion);

  // 3. Query Pinecone, scoped to this PDF's namespace
  const index = await getPineconeIndex();
  const namespace = convertToAscii(fileKey);

  const queryResults = await index.namespace(namespace).query({
    vector: queryEmbedding,
    topK: 4,
    includeMetadata: true,
  });

  console.log("query-result", queryResults);

  const context = queryResults.matches
    .map((match) => (match.metadata as any)?.text ?? "")
    .join("\n\n---\n\n");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are answering questions about a PDF document. Use ONLY the context below to answer — 
    if the answer isn't in the context, say you don't know.

Context:
${context}`,
    messages: await convertToModelMessages(messages),
    onFinish: async ({ text }) => {
      await db.insert(message).values({
        chatId: Number(chatId),
        content: text,
        role: "system",
      });
    },
  });

  return result.toUIMessageStreamResponse();
}
