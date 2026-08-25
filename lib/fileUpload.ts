// src/lib/uploadFile.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/db/s3";

export async function uploadToS3(
  file: File,
): Promise<{ key: string; fileUrl: string; fileName: string }> {
  const key = `pdfs/${file.name}-${Date.now()}`;

  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  });

  await s3Client.send(command);

  const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;

  return { key, fileUrl, fileName: file.name };
}
