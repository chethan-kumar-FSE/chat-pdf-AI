import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Crown,
  FileText,
  LogInIcon,
  MessageSquare,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

import FileUpload from "@/components/FileUpload";
import UpgradeButton from "../components/UpgradeButton";
import { checkSubscription } from "@/lib/subscription";
import { UserButton } from "@clerk/nextjs";
import { chats } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { eq } from "drizzle-orm";

export default async function Home() {
  const { userId } = await auth();

  const isUserLoggedIn = !!userId;
  const isPro = await checkSubscription();

  const _chats = userId
    ? await db.select().from(chats).where(eq(chats.userId, userId))
    : [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">
                DocChat
              </span>
              <span className="mt-1 text-[10px] text-muted-foreground">
                AI document assistant
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {isUserLoggedIn ? (
              <>
                {!isPro ? (
                  <UpgradeButton
                    isPro={isPro}
                    className="h-9 px-3.5 text-xs bg-amber-600 hover:bg-amber-700 font-medium"
                  />
                ) : (
                  <UpgradeButton
                    isPro={isPro}
                    className="h-9 px-3.5 text-xs border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium"
                  />
                )}

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 text-xs font-medium"
                >
                  <Link
                    href="/chats"
                    className="inline-flex items-center gap-1.5"
                  >
                    <span>My documents</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>

                <div className="ml-1 flex items-center pl-2 border-l border-border/60">
                  <UserButton
                    appearance={{
                      elements: { avatarBox: "h-8 w-8 rounded-lg" },
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-9 rounded-lg"
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>

                <Button asChild size="sm" className="h-9 rounded-lg">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Get started</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-muted/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-20 sm:pt-28">
          <div className="mb-7 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered document assistant
            </div>
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
              Chat with your documents.
              <span className="block text-muted-foreground">
                Get answers instantly.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Upload a PDF, ask questions, and let AI find the information you
              need. No more scrolling through hundreds of pages.
            </p>

            {!isPro && (
              <p className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400">
                ⚡ Free plan includes up to 5 documents with 10 questions per
                document. Upgrade anytime for unlimited access.
              </p>
            )}
          </div>
          <div className="mx-auto mt-12 max-w-2xl">
            {isUserLoggedIn ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/[0.03]">
                <div className="border-b border-border px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                        <Upload className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-semibold">
                            Upload your document
                          </h2>
                          {isPro ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                              <Crown className="h-3 w-3 fill-current" />
                              Unlimited
                            </span>
                          ) : (
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                                _chats.length >= 5
                                  ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  : "border-border bg-muted/60 text-muted-foreground",
                              )}
                            >
                              {_chats.length}/5 documents
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {_chats.length >= 5 && !isPro
                            ? "Limit reached — upgrade to Pro to add more files"
                            : "Start a new conversation with your PDF"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* HARD DISABLE AT UI LEVEL */}
                  {_chats.length >= 5 && !isPro ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-8 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Crown className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-foreground">
                        Document limit reached (5/5)
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                        You have used all 5 free document uploads. Upgrade to
                        Pro for unlimited PDF uploads and instant AI responses.
                      </p>
                      <UpgradeButton isPro={isPro} className="mt-6" />
                    </div>
                  ) : (
                    <FileUpload />
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/[0.03]">
                <div className="p-8 text-center sm:p-10">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <FileText className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold">
                    Your documents, now searchable with AI
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Sign in to upload a PDF and start asking questions about its
                    contents.
                  </p>

                  <Button asChild className="mt-6 h-10 rounded-lg px-5">
                    <Link href="/sign-in">
                      Sign in to upload
                      <LogInIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="mx-auto mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
            <TrustPoint>AI-powered answers</TrustPoint>

            <TrustPoint>Search your documents</TrustPoint>

            <TrustPoint>Secure document storage</TrustPoint>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              How it works
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              From document to answer in seconds
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              No complicated setup. Upload your document and start asking
              questions.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
            <FeatureCard
              number="01"
              icon={<Upload className="h-4 w-4" />}
              title="Upload"
              description="Upload your PDF and we'll prepare it for AI-powered search."
            />

            <FeatureCard
              number="02"
              icon={<MessageSquare className="h-4 w-4" />}
              title="Ask"
              description="Ask questions naturally, just like you're talking to an expert."
            />

            <FeatureCard
              number="03"
              icon={<Zap className="h-4 w-4" />}
              title="Get answers"
              description="Receive contextual answers based directly on your document."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Sparkles className="h-5 w-5" />
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight">
            Ready to talk to your documents?
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Upload your first document and see what AI can find.
          </p>

          {!isUserLoggedIn && (
            <Button asChild className="mt-6 h-10 rounded-lg px-5">
              <Link href="/sign-up">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <FileText className="h-3 w-3" />
            </div>

            <span className="text-xs font-medium">DocChat</span>
          </div>

          <p className="text-xs text-muted-foreground">
            AI-powered document conversations
          </p>
        </div>
      </footer>
    </main>
  );
}

function TrustPoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-muted">
        <Check className="h-2.5 w-2.5" />
      </div>

      {children}
    </div>
  );
}

function FeatureCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-border bg-background p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>

        <span className="text-[11px] font-medium text-muted-foreground">
          {number}
        </span>
      </div>

      <h3 className="mt-5 text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
