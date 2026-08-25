import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      {
        error: "Unautorised Error",
      },
      { status: 401 },
    );
  }
  try {
    const body = await request.json();
    const { key, fileUrl, fileName } = body;
    await loadS3IntoPinecone(key);
    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: key,
        pdfName: fileName,
        pdfUrl: fileUrl,
        userId,
      })
      .returning({
        insertedId: chats.id,
      });
    console.log("pages", chat_id);

    return NextResponse.json(
      {
        chat_id: chat_id[0]?.insertedId,
      },
      { status: 201 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
