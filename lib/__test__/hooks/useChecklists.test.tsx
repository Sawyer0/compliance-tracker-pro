import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useChecklists } from "../../hooks/useChecklists";
import { useSupabase } from "../../hooks/useSupabase";
import { fetchChecklists, updateChecklistItem } from "../../services/checklist";

// Mock dependencies
vi.mock("../../hooks/useSupabase", () => ({
  useSupabase: vi.fn(),
}));

vi.mock("../../services/checklist", () => ({
  fetchChecklists: vi.fn(),
  updateChecklistItem: vi.fn(),
}));

// Wrap component in React Query provider for tests
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useChecklists hook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch all checklists when no departmentId is provided", async () => {
    // Mock supabase client
    const mockClient = { from: vi.fn() };
    (useSupabase as jest.Mock).mockReturnValue({ client: mockClient, loading: false });

    // Mock API response for all checklists
    const mockChecklists = [
      { id: "task1", title: "Task 1", completed: false, department_id: "dept1" },
      { id: "task2", title: "Task 2", completed: true, department_id: "dept2" },
      { id: "task3", title: "Task 3", completed: false, department_id: "dept3" },
    ];

    (fetchChecklists as jest.Mock).mockResolvedValue({
      data: mockChecklists,
      error: null,
    });

    // Render the hook with the wrapper
    const { result } = renderHook(() => useChecklists(), {
      wrapper: createWrapper(),
    });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check if the hook returns all checklists
    expect(result.current.checklists.length).toBe(3);
    expect(fetchChecklists).toHaveBeenCalledWith(mockClient);
  });

  it("should fetch checklists for a specific department when departmentId is provided", async () => {
    // Mock supabase client
    const mockClient = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    };
    
    mockClient.from.mockReturnValue(mockClient);
    mockClient.select.mockReturnValue(mockClient);
    mockClient.eq.mockResolvedValue({
      data: [
        { id: "task1", title: "Task 1", completed: false, department_id: "dept1" },
        { id: "task4", title: "Task 4", completed: true, department_id: "dept1" },
      ],
      error: null,
    });
    
    (useSupabase as jest.Mock).mockReturnValue({ client: mockClient, loading: false });

    // Render the hook with departmentId
    const { result } = renderHook(() => useChecklists("dept1"), {
      wrapper: createWrapper(),
    });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check if the hook returns only checklists for the specified department
    expect(result.current.checklists.length).toBe(2);
    expect(mockClient.from).toHaveBeenCalledWith("checklists");
    expect(mockClient.select).toHaveBeenCalledWith("*");
    expect(mockClient.eq).toHaveBeenCalledWith("department_id", "dept1");
  });

  it("should successfully update a checklist item", async () => {
    // Mock supabase client
    const mockClient = { from: vi.fn() };
    (useSupabase as jest.Mock).mockReturnValue({ client: mockClient, loading: false });

    // Mock API responses
    const mockChecklists = [
      { id: "task1", title: "Task 1", completed: false, department_id: "dept1" },
    ];

    const updatedChecklist = {
      id: "task1",
      title: "Task 1",
      completed: true,
      department_id: "dept1",
    };

    (fetchChecklists as jest.Mock).mockResolvedValue({
      data: mockChecklists,
      error: null,
    });

    (updateChecklistItem as jest.Mock).mockResolvedValue({
      data: updatedChecklist,
      error: null,
    });

    // Render the hook
    const { result } = renderHook(() => useChecklists(), {
      wrapper: createWrapper(),
    });

    // Wait for the initial data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Update a checklist item
    result.current.updateChecklist({
      id: "task1",
      updates: { completed: true },
    });

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(result.current.isUpdating).toBe(false);
    });

    // Verify that updateChecklistItem was called with correct parameters
    expect(updateChecklistItem).toHaveBeenCalledWith(
      mockClient,
      "task1",
      { completed: true }
    );
  });

  it("should handle permission error when updating a checklist item", async () => {
    // Mock supabase client
    const mockClient = { from: vi.fn() };
    (useSupabase as jest.Mock).mockReturnValue({ client: mockClient, loading: false });

    // Mock API responses
    const mockChecklists = [
      { id: "task1", title: "Task 1", completed: false, department_id: "dept1" },
    ];

    const mockPermissionError = {
      code: "PGRST116",
      message: "Permission denied",
      details: "Policy check failed for table 'checklists'",
    };

    (fetchChecklists as jest.Mock).mockResolvedValue({
      data: mockChecklists,
      error: null,
    });

    (updateChecklistItem as jest.Mock).mockResolvedValue({
      data: null,
      error: mockPermissionError,
    });

    // Create a mock console.error to capture error logs
    const originalConsoleError = console.error;
    const mockConsoleError = vi.fn();
    console.error = mockConsoleError;

    // Render the hook
    const { result } = renderHook(() => useChecklists(), {
      wrapper: createWrapper(),
    });

    // Wait for the initial data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Try to update a checklist item that will fail due to permissions
    try {
      result.current.updateChecklist({
        id: "task1",
        updates: { completed: true },
      });

      // Wait for the mutation to complete or fail
      await waitFor(() => {
        expect(updateChecklistItem).toHaveBeenCalled();
      });
    } catch (error) {
      // Expected to throw due to the permission error
    }

    // Restore console.error
    console.error = originalConsoleError;

    // Verify that updateChecklistItem was called with correct parameters
    expect(updateChecklistItem).toHaveBeenCalledWith(
      mockClient,
      "task1",
      { completed: true }
    );
    
    // Verify that the error was logged
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it("should not fetch data when client is not initialized", async () => {
    // Mock supabase client as null (not initialized)
    (useSupabase as jest.Mock).mockReturnValue({ client: null, loading: true });

    // Render the hook
    const { result } = renderHook(() => useChecklists(), {
      wrapper: createWrapper(),
    });

    // Check if the hook is in loading state and has empty checklists
    expect(result.current.isLoading).toBe(true);
    expect(result.current.checklists.length).toBe(0);

    // Verify that fetchChecklists was not called
    expect(fetchChecklists).not.toHaveBeenCalled();
  });
}); 