import React from "react";
import { describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import ChecklistItem from "@/components/compliance/ChecklistItem"; 
import { useChecklistStore } from "@/store/checklistStore";
import { useSupabase } from "@/lib/hooks/useSupabase";

// Mock the hooks
vi.mock('@/store/checklistStore', () => ({
  useChecklistStore: vi.fn(() => ({
    updateItem: vi.fn(),
  })),
}));

vi.mock('@/lib/hooks/useSupabase', () => ({
  useSupabase: vi.fn(() => ({
    client: { from: vi.fn() }, // Mock a valid client
    loading: false,
    error: null,
  })),
}));

// Mock NoteModal component
vi.mock('@/components/compliance/NoteModal', () => ({
  __esModule: true,
  default: ({ item, onClose }: { item: any, onClose: () => void }) => <div data-testid="note-modal">Mock Modal</div>
}));

describe("ChecklistItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders checklist item with title and buttons", () => {
    const mockItem = {
      id: "1",
      title: "Review compliance policy",
      completed: false,
      notes: "",
      department_id: "dept-1",
      created_at: "2025-04-13T00:00:00Z",
      due_date: "2024-04-01T00:00:00.000Z",
    };

    // Render the component
    render(<ChecklistItem item={mockItem} />);
    
    // Title is rendered
    expect(screen.getByText("Review compliance policy")).toBeInTheDocument();

    // Status line shows "Pending"
    expect(screen.getByText(/Status:\s*Pending/i)).toBeInTheDocument();

    // Action buttons exist
    expect(
      screen.getByRole("button", { name: /Mark Complete/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Note/i })
    ).toBeInTheDocument();
  });
});
