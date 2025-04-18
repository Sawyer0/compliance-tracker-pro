"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Cache time constants
const STALE_TIME = 1000 * 60; // 1 minute
const CACHE_TIME = 1000 * 60 * 5; // 5 minutes

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME,
            gcTime: CACHE_TIME,
            refetchOnWindowFocus: true,
            refetchOnReconnect: "always",
            retry: (failureCount, error) => {
              // Only retry network errors and 5xx server errors
              if (
                error instanceof Error &&
                error.message.includes("Network") &&
                failureCount < 3
              ) {
                return true;
              }

              // For server errors, retry a few times
              const status = (error as any)?.response?.status;
              if (status && status >= 500 && status < 600 && failureCount < 2) {
                return true;
              }

              return false;
            },
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // For optimistic updates consistency
            onError: (err, _variables, recover) => {
              if (typeof recover === "function") {
                recover();
              }
              console.error("Mutation error:", err);
            },
          },
        },
      })
  );

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ClerkProvider>
  );
};
