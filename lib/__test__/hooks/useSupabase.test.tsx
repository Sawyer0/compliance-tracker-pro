import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSupabase } from "../../hooks/useSupabase";
import { createClient } from "@supabase/supabase-js";

// Mock createClient from @supabase/supabase-js
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(),
    // Return a minimal mock that matches the structure I need
    supabaseUrl: "https://ahzdqhlkcgoiiufezlnd.supabase.co",
  })),
}));

// Mock fetch function
global.fetch = vi.fn();

// Mock process.env
vi.stubGlobal("process", {
  ...process,
  env: {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: "https://ahzdqhlkcgoiiufezlnd.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "mock-anon-key",
  },
});

describe("useSupabase hook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should initialize supabase client successfully", async () => {
    const mockToken = "mock-token";

    // Mock fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken }),
    });

    const { result } = renderHook(() => useSupabase());

    // Initial state should be loading with no client
    expect(result.current.loading).toBe(true);
    expect(result.current.client).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for async operations to complete AND for client to be set
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check that client exists and has expected methods
    expect(result.current.client).not.toBeNull();
    expect(typeof result.current.client?.from).toBe("function");
    expect(result.current.error).toBe(null);

    // Verify mocks were called correctly
    expect(global.fetch).toHaveBeenCalledWith("/api/supabase-token");
    expect(createClient).toHaveBeenCalledWith(
      "https://ahzdqhlkcgoiiufezlnd.supabase.co",
      "mock-anon-key",
      {
        global: {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      }
    );
  });

  it("should handle fetch errors", async () => {
    // Mock fetch error
    (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useSupabase());

    // Wait for async operations to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check error state
    expect(result.current.client).toBe(null);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Network error");
  });

  it("should handle non-ok response", async () => {
    // Mock non-ok response
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    const { result } = renderHook(() => useSupabase());

    // Wait for async operations to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check error state
    expect(result.current.client).toBe(null);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Failed to fetch token: 401");
  });
});
