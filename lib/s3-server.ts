// src/lib/s3-server.ts
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./db/s3";

export async function downloadFromS3(fileKey: string): Promise<Blob | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: fileKey,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error("S3 object has no body");
    }

    const bytes = await response.Body.transformToByteArray();

    const blob = new Blob([Buffer.from(bytes)]); // ✅
    return blob;
  } catch (err) {
    console.error("S3 download failed:", err);
    return null;
  }
}
