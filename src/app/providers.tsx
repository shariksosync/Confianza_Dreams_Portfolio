"use client";

import { AuthProvider } from "@/context/AuthContext";
import { SiteProvider } from "@/context/SiteContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SiteProvider>{children}</SiteProvider>
    </AuthProvider>
  );
}
