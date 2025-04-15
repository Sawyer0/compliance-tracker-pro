import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSupabase } from "../../hooks/useSupabase";
import { getSupabaseClient } from "../../getSupabaseClient";

// Mock dependencies
vi.mock("../../getSupabaseClient", () => ({
  getSupabaseClient: vi.fn(),
}));

// Mock fetch function
global.fetch = vi.fn();

describe("useSupabase hook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should initialize supabase client successfully", async () => {
    const mockClient = { from: vi.fn() };
    const mockToken = "mock-token";

    // Mock fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken }),
    });

    // Mock getSupabaseClient
    (getSupabaseClient as any).mockReturnValue(mockClient);

    const { result } = renderHook(() => useSupabase());

    // Initial state should be loading with no client
    expect(result.current.loading).toBe(true);
    expect(result.current.client).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check final state
    expect(result.current.client).toBe(mockClient);
    expect(result.current.error).toBe(null);

    // Verify mocks were called correctly
    expect(global.fetch).toHaveBeenCalledWith("/api/supabase-token");
    expect(getSupabaseClient).toHaveBeenCalledWith(mockToken);
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
    expect(result.current.error?.message).toBe(
      "Failed to fetch Supabase token"
    );
  });
});
