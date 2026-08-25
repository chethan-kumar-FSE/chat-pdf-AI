// src/app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

import { eq, asc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { message } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const chatId = req.nextUrl.searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json({ error: "chatId is required" }, { status: 400 });
  }

  try {
    const chatMessages = await db
      .select()
      .from(message)
      .where(eq(message.chatId, Number(chatId)))
      .orderBy(asc(message.createdAt));

    return NextResponse.json({ messages: chatMessages });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
