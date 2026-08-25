import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const Sidebar = ({ chats, chatId }: Props) => {
  return (
    <div className="w-64 border-r h-screen p-4 space-y-2">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">Your Chats</h2>
      {chats.length === 0 && (
        <p className="text-sm text-gray-400">No chats yet</p>
      )}
      {chats.map((chat) => (
        <Link
          key={chat.id}
          href={`/chat/${chat.id}`}
          className={`block p-2 rounded-md text-sm truncate ${
            chat.id === chatId
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100"
          }`}
        >
          {chat.pdfName}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
