"use client";

import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";
import { Dashboard } from "@/components/Dashboard";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Home() {
  return (
    <ConvexProvider client={convex}>
      <Dashboard />
    </ConvexProvider>
  );
}
