"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/getSupabaseClient";
import { useChecklistStore } from "@/store/checklistStore";
import ChecklistTable from "@/components/ChecklistTable";

export default function DepartmentChecklistPage() {
  const { deptId } = useParams();
  const router = useRouter();
  const {
    setItems,
    setLoading,
    isLoading,
    items,
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

      if (!res.ok) {
        console.error("Failed to fetch token:", res.statusText);
        return;
      }

      try {
        const { token } = await res.json();
        const supabase = getSupabaseClient(token);
        const { data, error } = await supabase
          .from("checklists")
          .select("*")
          .eq("department_id", deptId);

        console.log("Dept ID:", deptId);
        console.log("Supabase response data:", data);
        console.log("Supabase response error:", error);

        if (error) {
          console.error("Supabase error:", error);
        } else {
          setItems(data);
        }
      } catch (err) {
        console.error("Error parsing JSON:", err);
      }

      setLoading(false);
    };

    fetchChecklist();
  }, [deptId, setItems, setLoading]);

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => router.push("/dashboard")}
        className="text-sm text-blue-600 underline"
      >
        ← Back to Departments
      </button>

      <h1 className="text-2xl font-semibold">Department Checklist</h1>

      <div className="w-full bg-gray-100 h-4 rounded overflow-hidden">
        <div
          className="h-full bg-green-500"
          style={{ width: `${completionRate}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">{completionRate}% completed</p>

      <div className="flex justify-end">
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "all" | "completed" | "pending")
          }
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading checklist...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          No checklist items found for this department.
        </p>
      ) : (
        <ChecklistTable />
      )}
    </div>
  );
}
