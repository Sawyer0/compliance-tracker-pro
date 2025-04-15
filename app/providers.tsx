"use client";

import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/lib/providers/QueryProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ClerkProvider>
      <QueryProvider>{children}</QueryProvider>
    </ClerkProvider>
  );
};
