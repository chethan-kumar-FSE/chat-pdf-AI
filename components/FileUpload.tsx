"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { uploadToS3 } from "@/lib/fileUpload";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FileUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async ({
      key,
      fileUrl,
      fileName,
    }: {
      key: string;
      fileUrl: string;
      fileName: string;
    }) => {
      const res = await axios.post("/api/create-chat", {
        key,
        fileUrl,
        fileName,
      });
      return res;
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      if (selectedFile.type !== "application/pdf") {
        toast.error("Only PDF files are supported");
        return;
      }

      setFile(selectedFile);
      setUploading(true);
      const toastId = toast.loading("Uploading and embedding your PDF...");

      try {
        const data = await uploadToS3(selectedFile);

        mutate(data, {
          onSuccess: (res) => {
            const chat_id = res?.data?.chat_id;
            toast.success("PDF processed! Redirecting...", { id: toastId });
            router.push(`/chats/${chat_id}`);
          },
          onError: (err) => {
            console.error(err);
            toast.error("Failed to process chat. Please try again.", {
              id: toastId,
            });
            setUploading(false);
          },
        });
      } catch (err) {
        console.error(err);
        toast.error("Upload failed. Please try again.", { id: toastId });
        setUploading(false);
      }
    },
    [mutate, router],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ease-in-out",
        "bg-background/50 hover:bg-muted/40",
        uploading
          ? "cursor-not-allowed border-muted-foreground/20 opacity-80"
          : "cursor-pointer border-border hover:border-primary/50",
        isDragActive && "border-primary bg-primary/5 ring-4 ring-primary/10",
      )}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Processing PDF
            </p>
            <p className="text-xs text-muted-foreground">
              Parsing vector embeddings & creating chat session...
            </p>
          </div>
        </div>
      ) : isDragActive ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="h-6 w-6 animate-bounce" />
          </div>
          <p className="text-sm font-medium text-primary">
            Drop your PDF here to begin
          </p>
        </div>
      ) : file ? (
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {(file.size / (1024 * 1024)).toFixed(2)} MB · Ready for upload
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:text-foreground">
            <FileText className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              <span className="text-primary underline-offset-4 hover:underline">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PDF documents only (Up to 10MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
