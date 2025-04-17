import { vi } from "vitest";
import "@testing-library/jest-dom";
import dotenv from "dotenv";

// Load environment variables from .env.test
dotenv.config({ path: ".env.test" });

// Mock Clerk
vi.mock("@clerk/clerk-react", () => ({
  useAuth: vi.fn(() => ({
    userId: process.env.TEST_REGULAR_USER_ID || "mock-user-id",
    isSignedIn: true,
  })),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock fetch for Supabase token
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        token: process.env.TEST_USER_TOKEN || "mock-supabase-token",
      }),
  })
) as any;

// Create mock for window.ENV
vi.stubGlobal("ENV", {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
