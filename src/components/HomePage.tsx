"use client";

import { useEffect, useState } from "react";

// Dynamically import Convex components only on client side
export default function HomePage() {
  const [ClientApp, setClientApp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Import the actual app component only on client side
    import("./ClientApp").then((mod) => {
      setClientApp(() => mod.default);
    });
  }, []);

  if (!ClientApp) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return <ClientApp />;
}
