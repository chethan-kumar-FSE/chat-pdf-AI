import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#07090e] px-4 py-12 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-180px] h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,210,255,0.15),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      </div>

      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <div className="mb-5 flex justify-center">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px] shadow-[0_0_25px_rgba(0,210,255,0.35)]">
              <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#07090e]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-cyan-400"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 4.75A2.75 2.75 0 0 1 8.75 2h6.5A2.75 2.75 0 0 1 18 4.75v14.5A2.75 2.75 0 0 1 15.25 22h-6.5A2.75 2.75 0 0 1 6 19.25V4.75Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.5 6.5h5M9.5 10h5M9.5 13.5h3"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Get Started with Mind<span className="text-cyan-400">Spark</span>
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm text-slate-400">
            Create your account to unlock AI-powered document intelligence.
          </p>
        </div>

        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#00d2ff",
              colorBackground: "#0d121f",
              colorText: "#f8fafc",
            },

            elements: {
              rootBox: "w-full",

              card: [
                "w-full",
                "border",
                "border-white/10",
                "rounded-2xl",
                "bg-[#0d121f]/85",
                "backdrop-blur-xl",
                "p-6 sm:p-8",
                "shadow-[0_0_40px_-10px_rgba(0,210,255,0.15)]",
              ].join(" "),

              headerTitle: "hidden",
              headerSubtitle: "hidden",

              socialButtonsBlockButton: [
                "h-11",
                "rounded-xl",
                "border",
                "border-white/10",
                "bg-white/[0.03]",
                "text-slate-200",
                "shadow-none",
                "transition-all",
                "hover:border-cyan-500/40",
                "hover:bg-cyan-500/10",
                "hover:text-white",
              ].join(" "),

              socialButtonsBlockButtonText:
                "text-xs font-semibold text-slate-200",

              dividerLine: "bg-white/10",

              dividerText: "px-2 text-xs font-mono text-slate-400",

              formFieldLabel: "mb-1.5 text-xs font-medium text-slate-300",

              formFieldInput: [
                "h-10",
                "rounded-xl",
                "border",
                "border-white/10",
                "bg-slate-950/60",
                "text-xs",
                "text-slate-100",
                "shadow-none",
                "outline-none",
                "transition",
                "placeholder:text-slate-500",
                "focus:border-cyan-400",
                "focus:ring-2",
                "focus:ring-cyan-400/20",
              ].join(" "),

              formButtonPrimary: [
                "h-11",
                "rounded-xl",
                "glow-button",
                "text-xs",
                "font-bold",
                "text-slate-950",
                "shadow-lg",
                "transition-all",
              ].join(" "),

              footerActionText: "text-xs text-slate-400",

              footerActionLink:
                "text-xs font-semibold text-cyan-400 hover:underline",

              identityPreview:
                "rounded-xl border border-white/10 bg-white/[0.02]",

              identityPreviewText: "text-xs font-medium text-slate-200",

              identityPreviewEditButton:
                "text-xs text-cyan-400 hover:opacity-70",

              alert:
                "rounded-xl border border-red-500/30 bg-red-950/20 text-xs text-red-300",

              formResendCodeLink:
                "text-xs font-medium text-cyan-400 hover:underline",

              otpCodeFieldInput:
                "border-white/10 bg-slate-950/60 text-white rounded-xl",

              footer: "mt-5",
            },
          }}
        />

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          By creating an account, you agree to our{" "}
          <span className="text-slate-400 hover:text-cyan-400 cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-slate-400 hover:text-cyan-400 cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </main>
  );
}
