// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/fileUpload";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { downloadFromS3 } from "@/lib/s3-server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const d = await loadS3IntoPinecone("s");
    console.log(d);

    // const [chat] = await db
    //   .insert(chats)
    //   .values({
    //     pdfName: file.name,
    //     pdfUrl: key,
    //     userId: "TODO-get-from-auth",
    //   })
    //   .returning();

    return NextResponse.json({});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
