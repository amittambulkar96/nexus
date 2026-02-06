"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Dashboard } from "./Dashboard";

const CONVEX_URL = "https://capable-greyhound-314.convex.cloud";
const convex = new ConvexReactClient(CONVEX_URL);

export default function ClientApp() {
  return (
    <ConvexProvider client={convex}>
      <Dashboard />
    </ConvexProvider>
  );
}
