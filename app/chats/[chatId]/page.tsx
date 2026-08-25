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
    return redirect("/sign-in");
  }
  const { chatId } = await params;
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  const _currentChat = _chats.find((chat) => chat?.id === parseInt(chatId));
  const { pdfUrl } = _currentChat || {};
  console.log(_currentChat);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-neutral-200 bg-white">
        <Sidebar chats={_chats} chatId={parseInt(chatId)} />
      </aside>

      {/* PDF Viewer */}
      <main className="flex-1 min-w-0 border-r border-neutral-200 bg-neutral-100">
        <div className="h-full w-full p-4">
          <div className="h-full w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            <PDFviewer fileUrl={pdfUrl || ""} />
          </div>
        </div>
      </main>

      {/* Chat Section */}
      <section className="w-[420px] shrink-0 bg-white flex flex-col">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-neutral-900">
            Ask about this document
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Answers are grounded in the PDF you uploaded
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <ChatSection
            fileKey={_currentChat?.fileKey || ""}
            chatId={parseInt(chatId)}
          />
          <p className="text-sm text-neutral-400">No messages yet</p>
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
