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

// Create a mock Supabase client that returns itself for chained methods
const mockSupabase = {
  from: mockFrom.mockReturnThis(),
  select: mockSelect.mockReturnThis(),
  update: mockUpdate.mockReturnThis(),
  eq: mockEq.mockReturnThis(),
  single: mockSingle,
} as any;

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
  });

  /**
   * Tests for fetchDepartmentsWithChecklists function
   * This function retrieves departments along with their associated checklists
   */
  describe("fetchDepartmentsWithChecklists", () => {
    it("should return departments with checklists", async () => {
      // Arrange: Set up mock nested data structure
      const mockData = [
        {
          id: "1",
          name: "HR",
          checklists: [{ id: "1", title: "Checklist 1", completed: true }],
        },
      ];

      // Configure mocks
      mockFrom.mockReturnThis();
      mockSelect.mockResolvedValue({ data: mockData, error: null });

      // Act: Call the function
      const result = await fetchDepartmentsWithChecklists(mockSupabase);

      // Assert: Verify correct table access and response
      expect(mockFrom).toHaveBeenCalledWith("departments");
      expect(mockSelect).toHaveBeenCalled();
      expect(result).toEqual({ data: mockData, error: null });
    });
  });
});
