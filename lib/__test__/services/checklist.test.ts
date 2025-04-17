import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  updateChecklistItem,
  fetchChecklists,
  fetchDepartmentsWithChecklists,
} from "../../services/checklist";

/**
 * Test suite for the Checklist service functions.
 * These tests validate the behavior of API functions that interact with Supabase
 * to perform CRUD operations on checklists and departments.
 */

// Mock the Supabase client and its methods
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockFrom = vi.fn();
const mockUpdate = vi.fn();
const mockSingle = vi.fn();
const mockAuth = vi.fn();
const mockIn = vi.fn();

// Create a mock Supabase client that returns itself for chained methods
const mockSupabase = {
  from: mockFrom.mockReturnThis(),
  select: mockSelect.mockReturnThis(),
  update: mockUpdate.mockReturnThis(),
  eq: mockEq.mockReturnThis(),
  in: mockIn.mockReturnThis(),
  single: mockSingle,
  auth: mockAuth,
} as any;

// Mock user sessions for different roles

describe("Checklist API", () => {
  beforeEach(() => {
    // Reset all mocks between tests to ensure clean test state
    vi.resetAllMocks();
  });

  /**
   * Tests for fetchChecklists function
   * This function should retrieve all checklist items from the database
   */
  describe("fetchChecklists", () => {
    it("should return data when successful", async () => {
      // Arrange: Set up mock data and response
      const mockData = [{ id: "1", title: "Test Checklist" }];
      mockFrom.mockReturnThis();
      mockSelect.mockResolvedValue({ data: mockData, error: null });

      // Act: Call the function being tested
      const result = await fetchChecklists(mockSupabase);

      // Assert: Verify correct behavior
      expect(mockFrom).toHaveBeenCalledWith("checklists");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(result).toEqual({ data: mockData, error: null });
    });

    it("should handle errors", async () => {
      // Arrange: Set up mock error response
      const mockError = new Error("Database error");
      mockFrom.mockReturnThis();
      mockSelect.mockResolvedValue({ data: null, error: mockError });

      // Act: Call the function being tested
      const result = await fetchChecklists(mockSupabase);

      // Assert: Verify error handling
      expect(mockFrom).toHaveBeenCalledWith("checklists");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(result).toEqual({ data: null, error: mockError });
    });

    it("should return filtered data based on RLS for regular users", async () => {
      // Arrange: Set up mock filtered data for regular user
      const mockUserData = [
        { id: "1", title: "Task 1", department_id: "dept1" },
        { id: "2", title: "Task 2", department_id: "dept1" },
      ];
      // Setup regular user permissions - they should only see their departments
      mockFrom.mockReturnThis();
      mockSelect.mockResolvedValue({ data: mockUserData, error: null });

      // Act: Call with authenticated client for a regular user
      const result = await fetchChecklists(mockSupabase);

      // Assert: Verify I got the user-specific filtered data
      expect(mockFrom).toHaveBeenCalledWith("checklists");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(result.data?.length).toBe(2);
      expect(result.data?.[0].department_id).toBe("dept1");
    });

    it("should return all data for admin users", async () => {
      // Arrange: Set up mock data that an admin would see
      const mockAllData = [
        { id: "1", title: "Task 1", department_id: "dept1" },
        { id: "2", title: "Task 2", department_id: "dept1" },
        { id: "3", title: "Task 3", department_id: "dept2" },
        { id: "4", title: "Task 4", department_id: "dept3" },
      ];
      mockFrom.mockReturnThis();
      mockSelect.mockResolvedValue({ data: mockAllData, error: null });

      // Act: Call with authenticated client for an admin
      const result = await fetchChecklists(mockSupabase);

      // Assert: Verify I got all data (admin view)
      expect(mockFrom).toHaveBeenCalledWith("checklists");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(result.data?.length).toBe(4);
    });
  });

  /**
   * Tests for updateChecklistItem function
   * This function updates a specific checklist item and returns the updated record
   */
  describe("updateChecklistItem", () => {
    it("should update a checklist item and return data", async () => {
      // Arrange: Set up mock item, updates, and successful response
      const mockItem = { id: "1", title: "Updated Title" };
      const mockUpdates = { title: "Updated Title" };

      // Set up mock chaining behavior
      mockFrom.mockReturnThis();
      mockUpdate.mockReturnThis();
      mockEq.mockReturnThis();
      mockSelect.mockReturnThis();
      mockSingle.mockResolvedValue({ data: mockItem, error: null });

      // Act: Call the function with test ID and updates
      const result = await updateChecklistItem(mockSupabase, "1", mockUpdates);

      // Assert: Verify correct method calls and response
      expect(mockFrom).toHaveBeenCalledWith("checklists");
      expect(mockUpdate).toHaveBeenCalledWith(mockUpdates);
      expect(mockEq).toHaveBeenCalledWith("id", "1");
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual({ data: mockItem, error: null });
    });

    it("should handle errors when updating", async () => {
      // Arrange: Set up mock error case
      const mockError = new Error("Update error");
      const mockUpdates = { title: "Updated Title" };

      // Set up mock chaining behavior
      mockFrom.mockReturnThis();
      mockUpdate.mockReturnThis();
      mockEq.mockReturnThis();
      mockSelect.mockReturnThis();
      mockSingle.mockResolvedValue({ data: null, error: mockError });

      // Act: Call the function
      const result = await updateChecklistItem(mockSupabase, "1", mockUpdates);

      // Assert: Verify error is returned correctly
      expect(result).toEqual({ data: null, error: mockError });
    });

    it("should return permission error when a regular user tries to update unauthorized checklist", async () => {
      // Arrange: Set up RLS permission error
      const mockError = {
        code: "PGRST116",
        message: "Not authorized",
        details: "Policy check failed for table 'checklists'",
      };
      const mockUpdates = {
        completed: true,
        notes: "Attempted to complete this task",
      };

      // Setup chaining with permission denied response
      mockFrom.mockReturnThis();
      mockUpdate.mockReturnThis();
      mockEq.mockReturnThis();
      mockSelect.mockReturnThis();
      mockSingle.mockResolvedValue({ data: null, error: mockError });

      // Act: Call the function with an item not assigned to the user
      const result = await updateChecklistItem(
        mockSupabase,
        "unauthorized-id",
        mockUpdates
      );

      // Assert: Verify I get the permission error back
      expect(result.error).toEqual(mockError);
      expect(result.data).toBeNull();
    });
  });

  /**
   * Tests for fetchDepartmentsWithChecklists function
   * This function retrieves departments along with their associated checklists
   */
  describe("fetchDepartmentsWithChecklists", () => {
    it("should return departments with checklists", async () => {
      vi.resetAllMocks();

      // Mock first query to user_departments
      mockFrom.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [{ department_id: "1" }, { department_id: "2" }],
          error: null,
        }),
      }));

      // Mock second query with in method
      mockFrom.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({
          data: [
            {
              id: "1",
              name: "HR",
              checklists: [{ id: "1", title: "Checklist 1", completed: true }],
            },
          ],
          error: null,
        }),
      }));

      const result = await fetchDepartmentsWithChecklists(
        mockSupabase,
        "mock-user-id"
      );

      expect(mockFrom.mock.calls[0][0]).toBe("user_departments");
      expect(result.data?.length).toBe(1);
    });

    it("should return only assigned departments for regular users", async () => {
      vi.resetAllMocks();

      // Mock first query
      mockFrom.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [{ department_id: "1" }],
          error: null,
        }),
      }));

      // Mock second query with in method
      mockFrom.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({
          data: [
            {
              id: "1",
              name: "HR",
              checklists: [{ id: "1", title: "HR Task 1", completed: false }],
            },
          ],
          error: null,
        }),
      }));

      const result = await fetchDepartmentsWithChecklists(
        mockSupabase,
        "mock-user-id"
      );

      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].name).toBe("HR");
    });

    it("should return all departments for admin users", async () => {
      vi.resetAllMocks();

      // Mock first query
      mockFrom.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: [
            { department_id: "1" },
            { department_id: "2" },
            { department_id: "3" },
          ],
          error: null,
        }),
      }));

      // Mock second query with in method
      mockFrom.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({
          data: [
            {
              id: "1",
              name: "HR",
              checklists: [{ id: "1", title: "HR Task 1", completed: false }],
            },
            {
              id: "2",
              name: "Finance",
              checklists: [
                { id: "2", title: "Finance Task 1", completed: true },
              ],
            },
            {
              id: "3",
              name: "Legal",
              checklists: [
                { id: "3", title: "Legal Task 1", completed: false },
              ],
            },
          ],
          error: null,
        }),
      }));

      const result = await fetchDepartmentsWithChecklists(
        mockSupabase,
        "mock-user-id"
      );

      expect(mockFrom.mock.calls[0][0]).toBe("user_departments");
      expect(result.data?.length).toBe(3);
    });
  });

  /**
   * Tests for handling unauthenticated requests
   * These requests should be rejected by RLS
   */
  describe("RLS Authentication Tests", () => {
    it("should return auth error when client has no auth token", async () => {
      // Arrange: Set up auth error for unauthenticated request
      const mockAuthError = {
        code: "PGRST109",
        message: "Not authenticated",
        details: null,
      };

      // Setup mocks to return this exact error structure
      // Make sure I'm creating a fresh mock for this test
      const mockUnauthSelect = vi
        .fn()
        .mockResolvedValue({ data: null, error: mockAuthError });
      const mockUnauthFrom = vi.fn().mockReturnValue({
        select: mockUnauthSelect,
      });

      // Mock client with missing auth - with properly initialized mocks
      const unauthenticatedClient = {
        from: mockUnauthFrom,
      } as any;

      // Act: Call function with unauthenticated client
      const result = await fetchChecklists(unauthenticatedClient);

      // Assert: Verify I get the exact auth error
      expect(result.error).toEqual(mockAuthError);
      expect(result.data).toBeNull();
    });
  });
});
