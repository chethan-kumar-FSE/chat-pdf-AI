import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MindSpark – Next-Gen AI PDF Intelligence",
  description:
    "Chat with your PDF documents with AI, extract citations, and summarize knowledge in milliseconds.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#07090e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#0d121f",
              color: "#f8fafc",
              border: "1px solid rgba(0, 210, 255, 0.2)",
              borderRadius: "12px",
              boxShadow: "0 0 20px rgba(0, 210, 255, 0.15)",
              fontSize: "12px",
            },
          }}
        />
        <ClerkProvider>
          <QueryProvider>{children}</QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
