import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-180px] h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-muted/40 blur-3xl" />
      </div>

      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
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

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Sign in to continue chatting with your documents.
          </p>
        </div>
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "var(--primary)",
              colorBackground: "var(--card)",
            },

            elements: {
              rootBox: "w-full",

              card: [
                "w-full",
                "border",
                "border-border",
                "rounded-xl",
                "bg-card",
                "p-6",
                "shadow-sm",
              ].join(" "),

              headerTitle: "hidden",
              headerSubtitle: "hidden",

              socialButtonsBlockButton: [
                "h-10",
                "rounded-md",
                "border",
                "border-border",
                "bg-background",
                "text-foreground",
                "shadow-none",
                "transition-colors",
                "hover:bg-muted",
              ].join(" "),

              socialButtonsBlockButtonText:
                "text-sm font-medium text-foreground",

              dividerLine: "bg-border",
              dividerText: "px-2 text-xs font-medium text-muted-foreground",

              formFieldLabel: "mb-1.5 text-sm font-medium text-foreground",

              formFieldInput: [
                "h-10",
                "rounded-md",
                "border",
                "border-input",
                "bg-background",
                "text-sm",
                "text-foreground",
                "shadow-none",
                "outline-none",
                "transition",
                "placeholder:text-muted-foreground",
                "focus:border-ring",
                "focus:ring-2",
                "focus:ring-ring/30",
              ].join(" "),

              formFieldInputShowPasswordButton:
                "text-muted-foreground hover:text-foreground",

              formButtonPrimary: [
                "h-10",
                "rounded-md",
                "bg-primary",
                "text-sm",
                "font-medium",
                "text-primary-foreground",
                "shadow-none",
                "transition-opacity",
                "hover:opacity-90",
              ].join(" "),

              footerActionText: "text-sm text-muted-foreground",

              footerActionLink:
                "text-sm font-medium text-foreground hover:underline",

              identityPreview: "rounded-md border border-border bg-muted/30",

              identityPreviewText: "text-sm font-medium text-foreground",

              identityPreviewEditButton:
                "text-sm text-foreground hover:opacity-70",

              alert:
                "rounded-md border border-destructive/30 bg-destructive/5 text-sm",

              formResendCodeLink:
                "text-sm font-medium text-foreground hover:underline",

              otpCodeFieldInput: "border-input bg-background text-foreground",

              footer: "mt-5",
            },
          }}
        />

        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          By continuing, you agree to our{" "}
          <span className="font-medium text-foreground">Terms of Service</span>{" "}
          and{" "}
          <span className="font-medium text-foreground">Privacy Policy</span>.
        </p>
      </div>
    </main>
  );
}
