"use client";

import { ClerkProvider } from "@clerk/nextjs";

interface ProvidersProps {
    children: React.ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return <ClerkProvider>{children}</ClerkProvider>;
}
