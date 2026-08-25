"use client";

import axios from "axios";
import { useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UpgradeButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export default function UpgradeButton({
  className,
  size = "sm",
  children,
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
      onClick={handleUpgrade}
      disabled={loading}
      className={cn(
        "h-8 gap-1.5 bg-amber-600 text-white hover:bg-amber-700 font-medium rounded-lg px-4",
        className,
      )}
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Redirecting...</span>
        </>
      ) : (
        (children ?? (
          <>
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Upgrade to Pro</span>
          </>
        ))
      )}
    </Button>
  );
}
