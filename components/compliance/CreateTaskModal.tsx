"use client";

import React, { useState, useEffect } from "react";
import { useDepartments } from "@/lib/hooks/useDepartments";
import { useDepartmentUsers } from "@/lib/hooks/useDepartmentUsers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTaskForm } from "@/lib/hooks/useTaskForm";
import TaskDetailsForm from "./TaskDetailsForm";
import TaskAssignmentForm from "./TaskAssignmentForm";
import TaskTagSelector from "./TaskTagSelector";
import TaskSummary from "./TaskSummary";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const dynamic = "force-dynamic";

export default function CreateTaskModal({ isOpen, onClose, onSuccess }: Props) {
  const {
    formData,
    setFormData,
    errors,
    apiError,
    isCreating,
    selectedTagIds,
    setSelectedTagIds,
    handleChange,
    handleSubmit,
  } = useTaskForm(onSuccess);

  const [activeTab, setActiveTab] = useState<"details" | "assignment">(
    "details"
  );

  const { departments } = useDepartments();

  const { users } = useDepartmentUsers(formData.department_id);
  const selectedUser = formData.assigned_to
    ? users?.find((user) => user.id === formData.assigned_to) || null
    : null;

  const selectedDepartment = formData.department_id
    ? departments?.find((dept) => dept.id === formData.department_id) || null
    : null;

  useEffect(() => {
    const selectedTags = selectedTagIds.map((id) => ({
      id,
      name: "...",
    }));

    setFormData((prev) => ({
      ...prev,
      tags: selectedTags,
    }));
  }, [selectedTagIds, setFormData]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Create New Task
          </DialogTitle>
          <div className="flex space-x-1 mt-4 border-b">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-b-2 border-amber-500 text-amber-700"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("details")}
              type="button"
            >
              Task Details
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "assignment"
                  ? "border-b-2 border-amber-500 text-amber-700"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("assignment")}
              type="button"
            >
              Assignment
            </button>
          </div>
        </DialogHeader>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm mb-4">
            {apiError}
          </div>
        )}

        <form
          onSubmit={(e) => handleSubmit(e, onClose)}
          className="space-y-4 py-4"
        >
          <div className={activeTab === "details" ? "block" : "hidden"}>
            <TaskDetailsForm
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              isCreating={isCreating}
            />
          </div>

          <div className={activeTab === "assignment" ? "block" : "hidden"}>
            <TaskAssignmentForm
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              setFormData={setFormData}
              departments={departments}
              isCreating={isCreating}
            />
          </div>

          <TaskTagSelector
            selectedTagIds={selectedTagIds}
            setSelectedTagIds={setSelectedTagIds}
          />

          <div className="pt-4 border-t mt-6">
            <TaskSummary
              formData={formData}
              selectedUser={selectedUser}
              selectedDepartment={selectedDepartment}
            />

            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
