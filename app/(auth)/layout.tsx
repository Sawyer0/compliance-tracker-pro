"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  // Redirect to sign-in if not authenticated
  if (isLoaded && !userId) {
    router.push("/sign-in");
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col">{children}</div>
      </div>
    </Suspense>
  );
}
