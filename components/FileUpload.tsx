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
        "relative flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition-all duration-300 ease-out",
        "bg-slate-950/40 backdrop-blur-md",
        uploading
          ? "cursor-not-allowed border-cyan-500/20 bg-slate-900/40 opacity-90"
          : "cursor-pointer border-white/10 hover:border-cyan-400/60 hover:bg-cyan-500/[0.03] hover:shadow-[0_0_25px_-5px_rgba(0,210,255,0.15)]",
        isDragActive &&
          "border-cyan-400 bg-cyan-500/10 ring-2 ring-cyan-400/30 shadow-[0_0_35px_-5px_rgba(0,210,255,0.3)]",
      )}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className="flex flex-col items-center gap-3.5 py-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.3)]">
            <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
            <div className="absolute inset-0 rounded-2xl animate-ping bg-cyan-500/20 opacity-30" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white tracking-wide">
              Neural Processing PDF...
            </p>
            <p className="text-xs text-slate-400">
              Generating vector embeddings & activating AI assistant...
            </p>
          </div>
        </div>
      ) : isDragActive ? (
        <div className="flex flex-col items-center gap-3.5 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(0,210,255,0.4)]">
            <UploadCloud className="h-7 w-7 animate-bounce text-cyan-300" />
          </div>
          <p className="text-sm font-medium text-cyan-300">
            Release your PDF here to analyze
          </p>
        </div>
      ) : file ? (
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{file.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {(file.size / (1024 * 1024)).toFixed(2)} MB · Ready for analysis
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3.5 py-3">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 text-slate-300 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
            <FileText className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-200">
              <span className="text-cyan-400 font-semibold hover:underline underline-offset-4">
                Click to upload
              </span>{" "}
              or drag & drop PDF
            </p>
            <p className="text-xs text-slate-400">
              PDF documents up to 10MB · Instant vector retrieval
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
