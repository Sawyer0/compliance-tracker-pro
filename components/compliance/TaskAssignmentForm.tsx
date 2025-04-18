"use client";

import React from "react";
import { TaskFormData } from "@/lib/hooks/useTaskForm";
import { useDepartmentUsers } from "@/lib/hooks/useDepartmentUsers";
import { Department } from "@/types/checklist";
import { User } from "lucide-react";

interface TaskAssignmentFormProps {
  formData: TaskFormData;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  departments: Department[];
  isCreating: boolean;
}

export default function TaskAssignmentForm({
  formData,
  errors,
  handleChange,
  setFormData,
  departments,
  isCreating,
}: TaskAssignmentFormProps) {
  const { users, isLoading: isLoadingUsers } = useDepartmentUsers(
    formData.department_id
  );

  const selectedDepartment = formData.department_id
    ? departments.find((dept) => dept.id === formData.department_id)
    : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="department_id" className="text-sm font-medium">
          Department <span className="text-red-500">*</span>
        </label>
        <select
          id="department_id"
          name="department_id"
          className={`w-full p-2 border rounded-md bg-white ${
            errors.department_id ? "border-red-500" : "border-gray-300"
          }`}
          value={formData.department_id}
          onChange={handleChange}
          disabled={isCreating}
        >
          <option value="">Select a department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        {errors.department_id && (
          <p className="text-red-500 text-xs mt-1">{errors.department_id}</p>
        )}

        {formData.department_id && selectedDepartment && (
          <div className="mt-2 p-3 bg-amber-50 rounded-md border border-amber-100">
            <h4 className="font-medium text-sm text-amber-800">
              Selected Department
            </h4>
            <p className="text-amber-900">{selectedDepartment.name}</p>
          </div>
        )}
      </div>

      {formData.department_id && (
        <div className="space-y-2 mt-6">
          <label
            htmlFor="assigned_to"
            className="text-sm font-medium flex justify-between"
          >
            <span>Assign To User</span>
            {isLoadingUsers && (
              <span className="text-amber-600 text-xs">Loading users...</span>
            )}
          </label>

          <div className="mt-2">
            {users.length === 0 && !isLoadingUsers ? (
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 text-gray-600 text-sm">
                No users available in this department
              </div>
            ) : (
              <>
                <div
                  className={`p-3 rounded-md border mb-2 cursor-pointer transition-colors ${
                    formData.assigned_to === ""
                      ? "bg-amber-50 border-amber-200"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, assigned_to: "" }))
                  }
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Unassigned</p>
                      <p className="text-xs text-gray-600">
                        Department-level responsibility
                      </p>
                    </div>
                  </div>
                </div>

                {!isLoadingUsers &&
                  users.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 rounded-md border mb-2 cursor-pointer transition-colors ${
                        user.id === formData.assigned_to
                          ? "bg-amber-50 border-amber-200"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          assigned_to: user.id,
                        }))
                      }
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3 text-amber-800 font-medium">
                          {user.full_name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-xs text-gray-600">
                            Role: {user.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
