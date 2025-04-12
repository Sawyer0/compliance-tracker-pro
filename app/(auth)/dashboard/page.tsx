"use client";

import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    fetch("/api/assign-role", { method: "POST" });
  }, []);

  return <div>Welcome to your dashboard</div>;
}
