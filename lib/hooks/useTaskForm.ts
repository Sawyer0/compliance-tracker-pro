import { useState } from "react";
import { ChecklistItem, Tag } from "@/types/checklist";
import { useChecklists } from "./useChecklists";

export const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "bg-blue-100 text-blue-800" },
  { value: "medium", label: "Medium", color: "bg-amber-100 text-amber-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
] as const;

export type PriorityLevel = (typeof PRIORITY_LEVELS)[number]["value"];

export interface TaskFormData
  extends Omit<ChecklistItem, "id" | "created_at" | "due_date"> {
  description?: string;
  priority?: PriorityLevel;
  due_date: string;
  assigned_to?: string;
  tags: Tag[];
}

const initialFormState: TaskFormData = {
  title: "",
  department_id: "",
  completed: false,
  notes: "",
  description: "",
  priority: "medium",
  due_date: "",
  assigned_to: "",
  tags: [],
};

export function useTaskForm(onSuccess?: () => void) {
  const [formData, setFormData] = useState<TaskFormData>(initialFormState);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [apiError, setApiError] = useState<string | null>(null);

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const { createChecklist, isCreating } = useChecklists();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.department_id) {
      newErrors.department_id = "Please select a department";
    }

    if (!formData.due_date) {
      newErrors.due_date = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();

    setApiError(null);

    if (!validateForm()) {
      return;
    }

    const newTask: ChecklistItem = {
      id: "",
      title: formData.title.trim(),
      department_id: formData.department_id,
      completed: false,
      notes: formData.notes,
      due_date: new Date(formData.due_date).toISOString(),
      created_at: new Date().toISOString(),
      tags: formData.tags,
    };

    if (formData.assigned_to) {
      newTask.assigned_to = formData.assigned_to;
    }

    if (formData.description || formData.priority) {
      const metadata = {
        description: formData.description || "",
        priority: formData.priority || "medium",
      };

      newTask.notes = JSON.stringify({
        text: formData.notes || "",
        metadata,
      });
    }

    try {
      await createChecklist(newTask);

      setFormData(initialFormState);
      setSelectedTagIds([]);

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setApiError(
        `Failed to create task: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setApiError(null);
    setSelectedTagIds([]);
  };

  const getPriorityInfo = (priority: PriorityLevel) => {
    return (
      PRIORITY_LEVELS.find((p) => p.value === priority) || PRIORITY_LEVELS[1]
    );
  };

  return {
    formData,
    setFormData,
    errors,
    apiError,
    isCreating,
    selectedTagIds,
    setSelectedTagIds,
    handleChange,
    handleSubmit,
    resetForm,
    getPriorityInfo,
  };
}
