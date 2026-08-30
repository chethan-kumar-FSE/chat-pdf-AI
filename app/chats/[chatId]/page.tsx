import ChatSection from "@/components/ChatComponent";
import PDFviewer from "@/components/PDFviewer";
import Sidebar from "@/components/Sidebar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
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
  const isPro = await checkSubscription();

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
    <div className="flex h-dvh w-full overflow-hidden bg-[#07090e] text-slate-100">
      <Sidebar chats={userChats} chatId={currentChatId} />
      <main className="flex min-w-0 flex-1">
        {/* PDF Document Viewer Pane */}
        <section className="relative min-w-0 flex-1 bg-[#05070a] border-r border-white/[0.08]">
          <div className="h-full w-full">
            <PDFviewer fileUrl={currentChat.pdfUrl ?? ""} />
          </div>
        </section>
        {/* Chat Assistant Pane */}
        <section className="flex w-[420px] shrink-0 flex-col bg-[#080c15]">
          <ChatSection
            isPro={!!isPro}
            fileKey={currentChat.fileKey}
            chatId={currentChatId}
          />
        </section>
      </main>
    </div>
  );
};

export default ChatPage;
