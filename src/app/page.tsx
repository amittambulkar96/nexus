"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Dashboard } from "@/components/Dashboard";
import { useMemo } from "react";

export default function Home() {
  // Use useMemo to lazily initialize Convex client
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    // Provide a dummy URL for build time if env var is not set
    // The actual URL will be used at runtime
    return new ConvexReactClient(url || "https://dummy-build-time-url.convex.cloud");
  }, []);

  return (
    <ConvexProvider client={convex}>
      <Dashboard />
    </ConvexProvider>
  );
}
