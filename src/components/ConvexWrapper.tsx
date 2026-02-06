"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Dashboard } from "./Dashboard";
import { useMemo } from "react";

export default function ConvexWrapper() {
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
    }
    return new ConvexReactClient(url);
  }, []);

  return (
    <ConvexProvider client={convex}>
      <Dashboard />
    </ConvexProvider>
  );
}
