"use client";

import axios from "axios";
import { useState } from "react";
import { Loader2, Crown } from "lucide-react";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/stripe");
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        <>
          <Crown className="w-4 h-4 text-amber-400" />
          Upgrade to Pro
        </>
      )}
    </button>
  );
}
