"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/getSupabaseClient";
import { useChecklistStore } from "@/store/checklistStore";
import ChecklistTable from "@/components/ChecklistTable";

export default function DepartmentChecklistPage() {
  const router = useRouter();
  const { deptId } = useParams();
  const {
    items,
    setItems,
    setLoading,
    isLoading,
    filterStatus,
    setFilterStatus,
  } = useChecklistStore();
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    setCompletionRate(
      items.length > 0
        ? Math.round(
            (items.filter((i) => i.completed).length / items.length) * 100
          )
        : 0
    );
  }, [items]);

  useEffect(() => {
    if (!deptId) return;
    const fetchChecklist = async () => {
      setLoading(true);
      const res = await fetch("/api/supabase-token");
      if (!res.ok) return;
      try {
        const { token } = await res.json();
        const supabase = getSupabaseClient(token);
        const { data, error } = await supabase
          .from("checklists")
          .select("*")
          .eq("department_id", deptId);
        if (error) console.error("Supabase error:", error);
        else setItems(data);
      } catch (err) {
        console.error("Error parsing JSON", err);
      }
      setLoading(false);
    };
    fetchChecklist();
  }, [deptId, setItems, setLoading]);

  return (
    <div className="page-wrapper">
      <button onClick={() => router.push("/dashboard")} className="back-link">
        ← Back to Departments
      </button>

      <h1 className="text-2xl font-semibold">Department Checklist</h1>

      <div className="progress-bg">
        <div
          className="progress-fill"
          style={{ width: `${completionRate}%` }}
        />
      </div>

      <div className="text-sm text-gray-600">{completionRate}% completed</div>

      <div className="flex justify-end">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="dropdown"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {isLoading ? (
        <p className="loading-text">Loading checklist…</p>
      ) : items.length === 0 ? (
        <p className="loading-text">
          No checklist items found for this department.
        </p>
      ) : (
        <ChecklistTable />
      )}
    </div>
  );
}
