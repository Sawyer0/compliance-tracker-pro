import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUserRole } from "../../hooks/useUserRole";

// Mock Clerk's useUser hook
vi.mock("@clerk/nextjs", () => ({
  useUser: vi.fn(),
}));

// Import the mocked version
import { useUser } from "@clerk/nextjs";

describe("useUserRole hook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return admin role when user has admin role in metadata", async () => {
    // Mock the useUser hook to return an admin user
    (useUser as any).mockReturnValue({
      user: {
        publicMetadata: { role: "admin" },
      },
      isLoaded: true,
      isSignedIn: true,
    });

    // Render the hook
    const { result } = renderHook(() => useUserRole());

    // Check if the hook returns the correct admin role
    expect(result.current.role).toBe("admin");
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isSignedIn).toBe(true);
  });

  it("should return user role when user has regular user role in metadata", async () => {
    // Mock the useUser hook to return a regular user
    (useUser as any).mockReturnValue({
      user: {
        publicMetadata: { role: "user" },
      },
      isLoaded: true,
      isSignedIn: true,
    });

    // Render the hook
    const { result } = renderHook(() => useUserRole());

    // Check if the hook returns the correct user role
    expect(result.current.role).toBe("user");
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isSignedIn).toBe(true);
  });

  it("should default to user role when no role is specified in metadata", async () => {
    // Mock the useUser hook to return a user with no role
    (useUser as any).mockReturnValue({
      user: {
        publicMetadata: {},
      },
      isLoaded: true,
      isSignedIn: true,
    });

    // Render the hook
    const { result } = renderHook(() => useUserRole());

    // Check if the hook defaults to user role
    expect(result.current.role).toBe("user");
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isSignedIn).toBe(true);
  });

  it("should handle unauthenticated users", async () => {
    // Mock the useUser hook to return an unauthenticated state
    (useUser as any).mockReturnValue({
      user: null,
      isLoaded: true,
      isSignedIn: false,
    });

    // Render the hook
    const { result } = renderHook(() => useUserRole());

    // Check if the hook handles unauthenticated users correctly
    expect(result.current.role).toBe("user");
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isSignedIn).toBe(false);
  });

  it("should show loading state when Clerk is still loading", async () => {
    // Mock the useUser hook to return a loading state
    (useUser as any).mockReturnValue({
      user: null,
      isLoaded: false,
      isSignedIn: false,
    });

    // Render the hook
    const { result } = renderHook(() => useUserRole());

    // Check if the hook shows loading state correctly
    expect(result.current.isLoaded).toBe(false);
  });
});
