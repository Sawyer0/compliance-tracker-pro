import React from "react";
import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ChecklistItem from "../ChecklistItem";

describe("ChecklistItem", () => {
  it("renders checklist item with title and buttons", () => {
    const mockItem = {
      id: "1",
      title: "Review compliance policy",
      completed: false,
      notes: "",
      department_id: "dept-1",
      created_at: "2025-04-13T00:00:00Z",
    };

    // Render the component
    render(<ChecklistItem item={mockItem} />);
    
    // Title is rendered
    expect(screen.getByText("Review compliance policy")).toBeInTheDocument();

    // Status line shows “Pending”
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
