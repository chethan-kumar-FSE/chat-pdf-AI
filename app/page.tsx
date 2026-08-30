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
  Shield,
  Eye,
  Search,
  Plus,
  ChevronDown,
  Globe,
  Sliders,
  Terminal,
  Cpu,
  Layers,
  FileSearch,
  ExternalLink,
} from "lucide-react";

import FileUpload from "@/components/FileUpload";
import UpgradeButton from "@/components/UpgradeButton";
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
    <main className="relative min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Background Ambience Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 -top-40 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,210,255,0.12),transparent_70%)] blur-3xl" />
        <div className="absolute right-10 top-1/3 h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)] blur-3xl" />
        <div className="absolute -left-20 top-2/3 h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_70%)] blur-3xl" />
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* MindSpark Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#07090e]/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(0,210,255,0.4)]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#07090e]">
                <Sparkles className="h-5 w-5 text-cyan-400 transition-transform group-hover:scale-110" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                Mind<span className="text-cyan-400">Spark</span>
              </span>
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-mono">
                AI PDF Neural Engine
              </span>
            </div>
          </Link>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link
              href="#about"
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="#features"
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              How It Work
            </Link>
            {isUserLoggedIn && (
              <Link
                href="/chats"
                className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors duration-200"
              >
                <span>Docs</span>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.2 text-[11px] font-mono text-cyan-300">
                  {_chats.length}
                </span>
              </Link>
            )}
            <Link
              href="#plans"
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              Plans
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3.5">
            {/* Language Selector Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-slate-300 cursor-pointer hover:border-white/20 transition-colors">
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>Eng</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>

            {isUserLoggedIn ? (
              <div className="flex items-center gap-3">
                <UpgradeButton isPro={isPro} />

                <Button
                  asChild
                  variant="glass"
                  size="sm"
                  className="hidden sm:inline-flex h-9 rounded-xl px-4 text-xs font-medium"
                >
                  <Link
                    href="/chats"
                    className="inline-flex items-center gap-2"
                  >
                    <span>Documents</span>
                    <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
                  </Link>
                </Button>

                <div className="pl-2 border-l border-white/10">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9 rounded-xl ring-2 ring-cyan-500/30",
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl h-9"
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>

                <Button
                  asChild
                  variant="glow"
                  size="sm"
                  className="h-9 px-4.5 rounded-xl text-xs font-semibold"
                >
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Get started</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Glowing Badge Pill */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-medium text-cyan-300 shadow-[0_0_20px_rgba(0,210,255,0.2)] backdrop-blur-xl">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>✦ Smarter chats, instant solutions</span>
            </div>
          </div>

          {/* Punchy Hero Headline */}
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1] text-white">
              Chat Smarter, Not Harder –{" "}
              <span className="block mt-2 bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Meet MindSpark
                <span className="animate-cursor-blink text-cyan-400">...|</span>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
              Your Ultimate AI Chat Partner – Instant Answers, Endless
              Knowledge! Upload research papers, legal documents, textbooks, or
              reports and extract intelligence in milliseconds.
            </p>
          </div>

          {/* MindSpark Neural Hub Showcase & Workspace */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            {/* Circuit Line Decor & Feature Nodes (Desktop) */}
            <div className="hidden lg:block pointer-events-none">
              {/* Left Top Node: Speed Performance */}
              <div className="absolute -left-20 top-12 z-20 flex items-center gap-3">
                <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0d121f]/90 px-4 py-2 text-xs font-medium text-slate-200 shadow-xl backdrop-blur-xl hover:border-cyan-500/40 transition-colors">
                  <Zap className="h-4 w-4 text-cyan-400 fill-current" />
                  <span>Speed Performance</span>
                </div>
                {/* Circuit connector wire */}
                <div className="w-16 h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent" />
              </div>

              {/* Left Bottom Node: User Confidentiality */}
              <div className="absolute -left-20 bottom-16 z-20 flex items-center gap-3">
                <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0d121f]/90 px-4 py-2 text-xs font-medium text-slate-200 shadow-xl backdrop-blur-xl hover:border-cyan-500/40 transition-colors">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  <span>User Confidentiality</span>
                </div>
                <div className="w-16 h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent" />
              </div>

              {/* Right Top Node: AI Document Vision */}
              <div className="absolute -right-20 top-12 z-20 flex items-center gap-3 flex-row-reverse">
                <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0d121f]/90 px-4 py-2 text-xs font-medium text-slate-200 shadow-xl backdrop-blur-xl hover:border-cyan-500/40 transition-colors">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>Image & Diagram QA</span>
                </div>
                <div className="w-16 h-[1px] bg-gradient-to-l from-cyan-500/50 to-transparent" />
              </div>

              {/* Right Bottom Node: Documentations */}
              <div className="absolute -right-20 bottom-16 z-20 flex items-center gap-3 flex-row-reverse">
                <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0d121f]/90 px-4 py-2 text-xs font-medium text-slate-200 shadow-xl backdrop-blur-xl hover:border-cyan-500/40 transition-colors">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  <span>Documentations</span>
                </div>
                <div className="w-16 h-[1px] bg-gradient-to-l from-cyan-500/50 to-transparent" />
              </div>
            </div>

            {/* Central Layered Glass Card */}
            <div className="glass-card-stack">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c101c]/80 shadow-[0_0_50px_-10px_rgba(0,210,255,0.15)] backdrop-blur-2xl p-6 sm:p-8">
                {/* Subtle top indicator */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-mono text-cyan-300">
                      ✦ MindSpark Neural Core v2.4
                    </span>
                  </div>

                  {isUserLoggedIn && (
                    <div className="flex items-center gap-2">
                      {isPro ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-medium text-cyan-300">
                          <Crown className="h-3 w-3 fill-current text-cyan-400" />
                          Unlimited Pro Plan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-mono text-slate-300">
                          {_chats.length}/5 Documents Used
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Workspace Upload / Dropzone */}
                {isUserLoggedIn ? (
                  <div>
                    {_chats.length >= 5 && !isPro ? (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-950/20 p-8 text-center backdrop-blur-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-3">
                          <Crown className="h-6 w-6" />
                        </div>
                        <h3 className="text-base font-semibold text-white">
                          Free Document Storage Reached (5/5)
                        </h3>
                        <p className="mt-1 text-xs text-slate-400 max-w-md">
                          You have used all 5 free document slots. Upgrade to
                          Pro for unlimited PDF uploads, vector retention, and
                          zero query caps.
                        </p>
                        <div className="mt-5">
                          <UpgradeButton isPro={isPro} />
                        </div>
                      </div>
                    ) : (
                      <FileUpload />
                    )}
                  </div>
                ) : (
                  <div className="relative rounded-2xl border border-white/10 bg-slate-950/40 p-8 text-center backdrop-blur-md">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_25px_rgba(0,210,255,0.25)] mb-4">
                      <FileText className="h-7 w-7" />
                    </div>

                    <h3 className="text-lg font-semibold text-white">
                      Drop any PDF to start neural questioning
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-400">
                      Sign in to upload research papers, financial reports, or
                      manuals. Get cited page answers in real time.
                    </p>

                    <div className="mt-6 flex justify-center gap-3">
                      <Button
                        asChild
                        variant="glow"
                        className="h-10 px-6 rounded-xl text-xs font-semibold"
                      >
                        <Link
                          href="/sign-in"
                          className="inline-flex items-center gap-2"
                        >
                          <span>Sign in to upload</span>
                          <LogInIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Bottom Action Pill Dock (Matching Template UI) */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 cursor-pointer transition-colors">
                      <Plus className="h-4 w-4" />
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 text-xs hover:border-cyan-500/30 cursor-pointer transition-colors">
                      <Search className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Semantic Search</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 text-xs hover:border-cyan-500/30 cursor-pointer transition-colors">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Auto Summarize</span>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 text-slate-400 hover:text-slate-200 cursor-pointer">
                      <span>...</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      asChild
                      variant="glow"
                      size="sm"
                      className="h-9 px-5 rounded-xl text-xs font-semibold"
                    >
                      <Link href={isUserLoggedIn ? "/chats" : "/sign-up"}>
                        <span>
                          {isUserLoggedIn ? "Open Workspace" : "Generate Free"}
                        </span>
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Footer Bar (Socials & Scroll Indicator) */}
            <div className="mt-8 flex items-center justify-between px-3 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-300">Our Socials:</span>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] hover:border-cyan-500/40 hover:text-cyan-400 cursor-pointer transition-colors">
                    <span className="text-[11px] font-bold">ig</span>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] hover:border-cyan-500/40 hover:text-cyan-400 cursor-pointer transition-colors">
                    <span className="text-[11px] font-bold">fb</span>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] hover:border-cyan-500/40 hover:text-cyan-400 cursor-pointer transition-colors">
                    <span className="text-[11px] font-bold">𝕏</span>
                  </div>
                </div>
              </div>

              <a
                href="#features"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <span>Scroll to explore</span>
                <span className="text-cyan-400">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Live Metric Stats Bar */}
      <section className="border-y border-white/[0.06] bg-[#090d16]/70 backdrop-blur-xl py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                99.9<span className="text-cyan-400">%</span>
              </p>
              <p className="text-xs text-slate-400">
                Vector Retrieval Accuracy
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                &lt; 1.5<span className="text-cyan-400">s</span>
              </p>
              <p className="text-xs text-slate-400">Neural Query Latency</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                256<span className="text-cyan-400">-bit</span>
              </p>
              <p className="text-xs text-slate-400">End-to-End Encryption</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                100<span className="text-cyan-400">+</span>
              </p>
              <p className="text-xs text-slate-400">Languages & Formats</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3.5 py-1 text-xs font-mono text-cyan-300 mb-4">
              <span>NEURAL PIPELINE</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              From Document to Answers in Seconds
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Effortless AI workflow engineered for precision, privacy, and
              speed.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
            <StepCard
              number="01"
              icon={<Upload className="h-5 w-5 text-cyan-400" />}
              title="Upload & Parse"
              description="Drop any PDF. Our engine extracts text, builds Pinecone vector embeddings, and stores them in secure cloud storage."
            />
            <StepCard
              number="02"
              icon={<Cpu className="h-5 w-5 text-cyan-400" />}
              title="Neural Querying"
              description="Ask questions in plain English. MindSpark retrieves relevant passages using hybrid semantic matching."
            />
            <StepCard
              number="03"
              icon={<Zap className="h-5 w-5 text-cyan-400" />}
              title="Instant Synthesized QA"
              description="Receive concise, grounded responses with exact page citations and zero hallucination risk."
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="relative border-t border-white/[0.06] bg-[#080c15]/60 py-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Engineered for Power Users
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Everything you need to digest thousands of pages without the
              fatigue.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureItem
              icon={<Zap className="h-5 w-5 text-cyan-400" />}
              title="Real-Time Streaming"
              description="Watch answers stream character-by-character with instant AI SDK token streaming."
            />
            <FeatureItem
              icon={<Shield className="h-5 w-5 text-cyan-400" />}
              title="Private & Encrypted"
              description="Your documents are your own. Vector embeddings are isolated per user session."
            />
            <FeatureItem
              icon={<FileSearch className="h-5 w-5 text-cyan-400" />}
              title="Dual-Pane PDF Viewer"
              description="Inspect original PDF pages side-by-side with your AI chat conversation."
            />
            <FeatureItem
              icon={<Sparkles className="h-5 w-5 text-cyan-400" />}
              title="Automatic Summaries"
              description="Generate one-click executive summaries, key takeaways, and action items."
            />
            <FeatureItem
              icon={<Layers className="h-5 w-5 text-cyan-400" />}
              title="Multi-Document Management"
              description="Seamlessly switch between textbooks, financial audits, and contracts."
            />
            <FeatureItem
              icon={<Terminal className="h-5 w-5 text-cyan-400" />}
              title="One-Click Copy & Export"
              description="Export synthesis, citations, and summaries directly to your clipboard or notes."
            />
          </div>
        </div>
      </section>

      {/* Plans & Pricing Section */}
      <section
        id="plans"
        className="relative border-t border-white/[0.06] py-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3.5 py-1 text-xs font-mono text-cyan-300 mb-4">
              <span>TRANSPARENT PLANS</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Supercharge Your Reading Today
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Start for free or upgrade to Pro for unrestricted document
              capacity.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2 items-stretch">
            {/* Free Tier */}
            <div className="relative rounded-3xl border border-white/10 bg-[#0d121f]/70 p-8 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Starter Free
                  </h3>
                  <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-mono text-slate-300">
                    Forever Free
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Ideal for casual students and short paper reviews.
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <div className="mt-8 space-y-3">
                  <PlanFeature text="Up to 5 PDF document uploads" />
                  <PlanFeature text="10 AI questions per document" />
                  <PlanFeature text="10MB max file size" />
                  <PlanFeature text="Standard retrieval speed" />
                  <PlanFeature text="Dual-pane interactive viewer" />
                </div>
              </div>

              <div className="mt-8">
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-11 rounded-xl text-xs font-semibold text-slate-200 border-white/10 hover:bg-white/5"
                >
                  <Link href={isUserLoggedIn ? "/chats" : "/sign-up"}>
                    {isUserLoggedIn ? "Current Plan" : "Get Started Free"}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Pro Tier (Glowing MindSpark styling) */}
            <div className="relative rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/30 via-[#0d121f]/90 to-[#07090e] p-8 shadow-[0_0_40px_-5px_rgba(0,210,255,0.25)] backdrop-blur-xl flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-1 text-[11px] font-bold text-slate-950 shadow-md uppercase tracking-wider">
                MOST POPULAR
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-1.5">
                    <span>Pro Unlimited</span>
                    <Crown className="h-4 w-4 text-cyan-400 fill-current" />
                  </h3>
                  <span className="rounded-full bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 text-xs font-mono text-cyan-300">
                    Unlimited
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  For researchers, legal pros, analysts, and power users.
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    $20
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <div className="mt-8 space-y-3">
                  <PlanFeature
                    text="Unlimited PDF document uploads"
                    highlighted
                  />
                  <PlanFeature
                    text="Unlimited AI questions & chats"
                    highlighted
                  />
                  <PlanFeature text="High-priority GPU inference" highlighted />
                  <PlanFeature text="Advanced citation matching" highlighted />
                  <PlanFeature
                    text="Full subscription management & cancel anytime"
                    highlighted
                  />
                </div>
              </div>

              <div className="mt-8">
                {isUserLoggedIn ? (
                  <UpgradeButton
                    isPro={isPro}
                    className="w-full h-11 text-sm font-bold"
                  />
                ) : (
                  <Button
                    asChild
                    variant="glow"
                    className="w-full h-11 rounded-xl text-xs font-bold"
                  >
                    <Link href="/sign-up">Upgrade to Pro</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MindSpark Footer */}
      <footer className="border-t border-white/[0.06] bg-[#05070a] py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#07090e]">
                <Sparkles className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              Mind<span className="text-cyan-400">Spark</span>
            </span>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} MindSpark AI. All rights reserved.
            Next-generation document intelligence.
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link
              href="#about"
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#features"
              className="hover:text-cyan-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StepCard({
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
    <div className="group relative rounded-2xl border border-white/10 bg-[#0d121f]/70 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(0,210,255,0.15)]">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          {icon}
        </div>
        <span className="text-xs font-mono font-bold text-cyan-400/80 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
          {number}
        </span>
      </div>

      <h3 className="mt-5 text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0c101c]/60 p-6 backdrop-blur-md hover:border-cyan-500/30 transition-colors">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
}

function PlanFeature({
  text,
  highlighted = false,
}: {
  text: string;
  highlighted?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <div
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full",
          highlighted
            ? "bg-cyan-500/20 text-cyan-400"
            : "bg-white/10 text-slate-300",
        )}
      >
        <Check className="h-2.5 w-2.5 stroke-[3]" />
      </div>
      <span className={highlighted ? "text-slate-200" : "text-slate-400"}>
        {text}
      </span>
    </div>
  );
}
