"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { uploadToS3 } from "@/lib/fileUpload";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: async ({
      key,
      fileUrl,
      fileName,
    }: {
      key: string;
      fileUrl: string;
      fileName: String;
    }) => {
      const res = await axios("/api/create-chat", {
        method: "POST",
        data: { key, fileUrl, fileName },
      });

      return res;
    },
  });
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      console.log(acceptedFiles[0]);
    }
    const data = await uploadToS3(acceptedFiles[0]);

    mutate(data, {
      onSuccess: async (data) => {
        console.log("chat_id", data?.data?.chat_id);
        const chat_id = data?.data?.chat_id;
        router.push(`/chats/${chat_id}`);
      },
      onError: (err) => {
        console.log(err);
      },
    });
    console.log(data);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the PDF here...</p>
      ) : file ? (
        <p>Selected: {file.name}</p>
      ) : (
        <p>Drag & drop a PDF here, or click to select one</p>
      )}
    </div>
  );
}
