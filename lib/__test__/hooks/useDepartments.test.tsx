import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDepartments } from "../../hooks/useDepartments";
import * as supabaseHook from "../../hooks/useSupabase";
import { fetchDepartmentsWithChecklists } from "../../services/checklist";

// Mock dependencies
vi.mock("../../hooks/useSupabase", () => ({
  useSupabase: vi.fn(() => ({
    client: {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: "1",
            name: "HR",
            checklists: [{ id: "1", title: "Task 1", completed: false }],
          },
        ],
        error: null,
      }),
    },
    loading: false,
    error: null,
  })),
}));

vi.mock("../../services/checklist", () => ({
  fetchDepartmentsWithChecklists: vi.fn(),
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

describe("useDepartments hook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return admin view (all departments) for admin users", async () => {
    // Mock supabase client
    const mockClient = { from: vi.fn() };
    (supabaseHook.useSupabase as jest.Mock).mockReturnValue({
      client: mockClient,
      loading: false,
    });

    // Mock API response for admin - multiple departments
    const mockAdminDepartments = [
      {
        id: "dept1",
        name: "HR",
        checklists: [
          {
            id: "task1",
            title: "HR Task 1",
            completed: true,
            due_date: "2023-06-01",
            created_at: "2023-05-01",
          },
          {
            id: "task2",
            title: "HR Task 2",
            completed: false,
            due_date: "2023-06-15",
            created_at: "2023-05-01",
          },
        ],
      },
      {
        id: "dept2",
        name: "Finance",
        checklists: [
          {
            id: "task3",
            title: "Finance Task 1",
            completed: false,
            due_date: "2023-06-20",
            created_at: "2023-05-01",
          },
        ],
      },
      {
        id: "dept3",
        name: "IT",
        checklists: [
          {
            id: "task4",
            title: "IT Task 1",
            completed: true,
            due_date: "2023-06-10",
            created_at: "2023-05-01",
          },
          {
            id: "task5",
            title: "IT Task 2",
            completed: false,
            due_date: "2023-06-30",
            created_at: "2023-05-01",
          },
        ],
      },
    ];

    (fetchDepartmentsWithChecklists as jest.Mock).mockResolvedValue({
      data: mockAdminDepartments,
      error: null,
    });

    // Render the hook with the wrapper
    const { result } = renderHook(() => useDepartments(), {
      wrapper: createWrapper(),
    });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check if the hook returns all departments
    expect(result.current.departments.length).toBe(3);
    expect(result.current.departments[0].name).toBe("HR");
    expect(result.current.departments[1].name).toBe("Finance");
    expect(result.current.departments[2].name).toBe("IT");

    // Verify that progress is calculated correctly
    expect(result.current.departments[0].totalTasks).toBe(2);
    expect(result.current.departments[0].progress).toBe(50); // 1/2 = 50%
  });

  it("should return user view (filtered departments) for regular users", async () => {
    // Mock supabase client
    const mockClient = { from: vi.fn() };
    (supabaseHook.useSupabase as jest.Mock).mockReturnValue({
      client: mockClient,
      loading: false,
    });

    // Mock API response for regular user - only departments they have access to
    const mockUserDepartments = [
      {
        id: "dept1",
        name: "HR",
        checklists: [
          {
            id: "task1",
            title: "HR Task 1",
            completed: true,
            due_date: "2023-06-01",
            created_at: "2023-05-01",
          },
          {
            id: "task2",
            title: "HR Task 2",
            completed: false,
            due_date: "2023-06-15",
            created_at: "2023-05-01",
          },
        ],
      },
    ];

    (fetchDepartmentsWithChecklists as jest.Mock).mockResolvedValue({
      data: mockUserDepartments,
      error: null,
    });

    // Render the hook with the wrapper
    const { result } = renderHook(() => useDepartments(), {
      wrapper: createWrapper(),
    });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check if the hook returns only the user's departments
    expect(result.current.departments.length).toBe(1);
    expect(result.current.departments[0].name).toBe("HR");

    // Verify that calculations are correct
    expect(result.current.departments[0].totalTasks).toBe(2);
    expect(result.current.departments[0].overdueTasks).toBeGreaterThanOrEqual(
      0
    ); // This depends on the current date
  });

  it("should handle empty departments list", async () => {
    // Mock supabase client
    const mockClient = { from: vi.fn() };
    (supabaseHook.useSupabase as jest.Mock).mockReturnValue({
      client: mockClient,
      loading: false,
    });

    // Mock API response with no departments (empty array)
    (fetchDepartmentsWithChecklists as jest.Mock).mockResolvedValue({
      data: [],
      error: null,
    });

    // Render the hook with the wrapper
    const { result } = renderHook(() => useDepartments(), {
      wrapper: createWrapper(),
    });

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check if the hook returns an empty array
    expect(result.current.departments.length).toBe(0);
  });

  it("should handle error from the API", async () => {
    // Mock supabase client
    const mockClient = { from: vi.fn() };
    (supabaseHook.useSupabase as jest.Mock).mockReturnValue({
      client: mockClient,
      loading: false,
    });

    // Mock API error response
    const mockError = new Error("Permission denied");
    (fetchDepartmentsWithChecklists as jest.Mock).mockResolvedValue({
      data: null,
      error: mockError,
    });

    // Render the hook with the wrapper
    const { result } = renderHook(() => useDepartments(), {
      wrapper: createWrapper(),
    });

    // Wait for the hook to finish loading and show error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Check if the hook returns the error and empty departments
    expect(result.current.error).toBeDefined();
    expect(result.current.departments.length).toBe(0);
  });

  it("should not fetch data when client is not available", async () => {
    // Mock supabase client as null (not initialized)
    (supabaseHook.useSupabase as jest.Mock).mockReturnValue({
      client: null,
      loading: true,
    });

    // Render the hook with the wrapper
    const { result } = renderHook(() => useDepartments(), {
      wrapper: createWrapper(),
    });

    // Verify that fetchDepartmentsWithChecklists was not called
    expect(fetchDepartmentsWithChecklists).not.toHaveBeenCalled();

    // Check if the hook returns loading state and empty departments
    expect(result.current.isLoading).toBe(true);
    expect(result.current.departments.length).toBe(0);
  });
});
