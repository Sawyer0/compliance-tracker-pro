"use client";

import React from "react";
import { TaskFormData, PRIORITY_LEVELS } from "@/lib/hooks/useTaskForm";

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
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          className={`w-full p-2 border rounded-md ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter task title"
          value={formData.title}
          onChange={handleChange}
          disabled={isCreating}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2 mt-4">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter task description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          disabled={isCreating}
        />
      </div>

      <div className="space-y-2 mt-4">
        <label htmlFor="due_date" className="text-sm font-medium">
          Due Date <span className="text-red-500">*</span>
        </label>
        <input
          id="due_date"
          name="due_date"
          type="date"
          className={`w-full p-2 border rounded-md ${
            errors.due_date ? "border-red-500" : "border-gray-300"
          }`}
          value={formData.due_date}
          onChange={handleChange}
          disabled={isCreating}
          min={new Date().toISOString().split("T")[0]}
        />
        {errors.due_date && (
          <p className="text-red-500 text-xs mt-1">{errors.due_date}</p>
        )}
      </div>

      <div className="space-y-2 mt-4">
        <label className="text-sm font-medium mb-2 block">Priority</label>
        <div className="flex space-x-2">
          {PRIORITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium flex-1 ${
                formData.priority === level.value
                  ? `${level.color} ring-2 ring-offset-1 ring-amber-500`
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
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

      <div className="space-y-2 mt-4">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Add any additional notes..."
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          disabled={isCreating}
        />
      </div>
    </div>
  );
}
