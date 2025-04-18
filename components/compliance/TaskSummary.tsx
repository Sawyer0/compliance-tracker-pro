"use client";

import React from "react";
import {
  TaskFormData,
  PriorityLevel,
  PRIORITY_LEVELS,
} from "@/lib/hooks/useTaskForm";
import { Department } from "@/types/checklist";
import { DepartmentUser } from "@/lib/services/users";

interface TaskSummaryProps {
  formData: TaskFormData;
  selectedUser: DepartmentUser | null;
  selectedDepartment: Department | null;
}

export default function TaskSummary({
  formData,
  selectedUser,
  selectedDepartment,
}: TaskSummaryProps) {
  const getPriorityInfo = (priority: PriorityLevel) => {
    return (
      PRIORITY_LEVELS.find((p) => p.value === priority) || PRIORITY_LEVELS[1]
    );
  };

  return (
    <div className="mb-4 space-y-2">
      <h3 className="font-medium text-sm">Task Summary</h3>
      <div className="bg-gray-50 p-3 rounded-md space-y-2 text-sm">
        {formData.title && (
          <p>
            <span className="font-medium">Title:</span> {formData.title}
          </p>
        )}
        {formData.priority && (
          <p>
            <span className="font-medium">Priority:</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                getPriorityInfo(formData.priority).color
              }`}
            >
              {getPriorityInfo(formData.priority).label}
            </span>
          </p>
        )}
        {formData.due_date && (
          <p>
            <span className="font-medium">Due:</span>{" "}
            {new Date(formData.due_date).toLocaleDateString()}
          </p>
        )}
        {selectedDepartment && (
          <p>
            <span className="font-medium">Department:</span>{" "}
            {selectedDepartment.name}
          </p>
        )}
        {selectedUser && (
          <p>
            <span className="font-medium">Assigned to:</span>{" "}
            {selectedUser.full_name}
          </p>
        )}
        {!selectedUser && formData.department_id && (
          <p>
            <span className="font-medium">Assigned to:</span>{" "}
            <span className="text-gray-500">Unassigned (Department-level)</span>
          </p>
        )}
      </div>
    </div>
  );
}
