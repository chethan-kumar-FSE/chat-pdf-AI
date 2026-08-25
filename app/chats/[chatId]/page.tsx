import ChatSection from "@/components/ChatComponent";
import PDFviewer from "@/components/PDFviewer";
import Sidebar from "@/components/Sidebar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ chatId: string }>;
};

const ChatPage = async ({ params }: Props) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { chatId } = await params;
  const currentChatId = Number(chatId);

  if (Number.isNaN(currentChatId)) {
    redirect("/");
  }

  const userChats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));

  const currentChat = userChats.find((chat) => chat.id === currentChatId);

  if (!currentChat) {
    redirect("/");
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      <Sidebar chats={userChats} chatId={currentChatId} />
      <main className="flex min-w-0 flex-1">
        <section className="relative min-w-0 flex-1 bg-muted/20">
          <div className="h-full w-full">
            <PDFviewer fileUrl={currentChat.pdfUrl ?? ""} />
          </div>
        </section>
        <section className="flex w-[390px] shrink-0 flex-col border-l border-border bg-background">
          <ChatSection fileKey={currentChat.fileKey} chatId={currentChatId} />
        </section>
      </main>
    </div>
  );
};

export default ChatPage;
