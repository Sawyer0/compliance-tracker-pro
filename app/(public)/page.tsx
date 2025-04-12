"use client";

import { SignedIn, SignOutButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to Compliance Tracker Pro
      </h1>

      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </div>
  );
}

//<SignOutButton signOutCallback={() => window.location.href = "/sign-in"} />
