// src/lib/embeddings.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text.replace(/\n/g, " "),
      dimensions: 2048,
    });

    return response.data[0].embedding;
  } catch (err) {
    console.error("Embedding API Error:", err);
    throw err;
  }
}
