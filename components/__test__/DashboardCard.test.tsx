import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardCard from "../DashboardCard";

describe("DashboardCard", () => {
  it("renders department name, progress, total tasks, and overdue tasks", () => {
    render(
      <DashboardCard
        id="123"
        name="Compliance"
        progress={75}
        totalTasks={8}
        overdueTasks={2}
      />
    );

    expect(screen.getByText("Compliance")).toBeInTheDocument();
    expect(screen.getByText("75% complete")).toBeInTheDocument();
    expect(screen.getByText("Total Tasks:")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText(/Overdue:/i)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it('displays "No tasks yet" when totalTasks is 0', () => {
    render(
      <DashboardCard
        id="456"
        name="Legal"
        progress={0}
        totalTasks={0}
        overdueTasks={0}
      />
    );

    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it("links to the correct department dashboard route", () => {
    render(
      <DashboardCard
        id="789"
        name="Finance"
        progress={60}
        totalTasks={5}
        overdueTasks={1}
      />
    );

    const link = screen.getByRole("link", {
      name: /View Finance department details/i,
    });

    expect(link).toHaveAttribute("href", "/dashboard/department/789");
  });

  it("renders progress bar width based on progress prop", () => {
    render(
      <DashboardCard
        id="001"
        name="IT"
        progress={45}
        totalTasks={10}
        overdueTasks={0}
      />
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle("width: 45%");
  });

  it("includes aria-label with department name", () => {
    render(
      <DashboardCard
        id="002"
        name="Engineering"
        progress={90}
        totalTasks={15}
        overdueTasks={1}
      />
    );

    expect(
      screen.getByLabelText(/View Engineering department details/i)
    ).toBeInTheDocument();
  });
});
