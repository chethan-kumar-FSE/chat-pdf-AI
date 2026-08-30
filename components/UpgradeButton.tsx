"use client";

import axios from "axios";
import { useState } from "react";
import { Loader2, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UpgradeButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
  isPro?: boolean;
}

export default function UpgradeButton({
  className,
  size = "sm",
  children,
  isPro = false,
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/stripe");
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size={size}
      variant={isPro ? "cyber" : "glow"}
      onClick={handleUpgrade}
      disabled={loading}
      className={cn(
        "h-9 gap-2 font-semibold tracking-wide rounded-xl px-5 text-xs transition-all duration-300",
        !isPro && "shadow-cyan-500/30 hover:shadow-cyan-500/50",
        isPro &&
          "border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40",
        className,
      )}
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-inherit" />
          <span>Redirecting...</span>
        </>
      ) : (
        (children ?? (
          <>
            {isPro ? (
              <Settings className="h-3.5 w-3.5 text-cyan-400" />
            ) : (
              <Zap className="h-3.5 w-3.5 fill-current" />
            )}
            <span>{isPro ? "Manage Subscription" : "Get Unlimited Pro"}</span>
          </>
        ))
      )}
    </Button>
  );
}
