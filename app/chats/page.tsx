import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export default async function ChatsPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const userChats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId))
    .orderBy(asc(chats.createdAt))
    .limit(1);

  if (userChats.length > 0) {
    return redirect(`/chats/${userChats[0].id}`);
  }

  return redirect("/");
}
