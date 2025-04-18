"use client";

import React from "react";
import { TaskFormData, PRIORITY_LEVELS } from "@/lib/hooks/useTaskForm";
import {
  FormField,
  FormGroup,
  Input,
  Textarea,
} from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

interface TaskDetailsFormProps {
  formData: TaskFormData;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  isCreating: boolean;
}

export default function TaskDetailsForm({
  formData,
  errors,
  handleChange,
  isCreating,
}: TaskDetailsFormProps) {
  return (
    <FormGroup>
      <FormField
        label="Task Title"
        htmlFor="title"
        error={errors.title}
        required
      >
        <Input
          id="title"
          name="title"
          placeholder="Enter task title"
          value={formData.title}
          onChange={handleChange}
          disabled={isCreating}
          error={!!errors.title}
        />
      </FormField>

      <FormField label="Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          placeholder="Enter task description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          disabled={isCreating}
        />
      </FormField>

      <FormField
        label="Due Date"
        htmlFor="due_date"
        error={errors.due_date}
        required
      >
        <Input
          id="due_date"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
          disabled={isCreating}
          error={!!errors.due_date}
          min={new Date().toISOString().split("T")[0]}
        />
      </FormField>

      <div className="space-y-2">
        <label className="text-sm font-medium mb-2 block">Priority</label>
        <div className="flex space-x-2">
          {PRIORITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium flex-1",
                formData.priority === level.value
                  ? `${level.color} ring-2 ring-offset-1 ring-amber-500`
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              )}
              onClick={() => {
                const e = {
                  target: {
                    name: "priority",
                    value: level.value,
                  },
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleChange(e);
              }}
              disabled={isCreating}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <FormField label="Notes" htmlFor="notes">
        <Textarea
          id="notes"
          name="notes"
          placeholder="Add any additional notes..."
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          disabled={isCreating}
        />
      </FormField>
    </FormGroup>
  );
}
