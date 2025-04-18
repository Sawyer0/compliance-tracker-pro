"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FormField,
  Input,
  Textarea,
  FormGroup,
} from "@/components/ui/form-field";
import {
  useDepartmentManagement,
  DepartmentFormData,
} from "@/lib/hooks/useDepartmentManagement";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateDepartmentModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const { createDepartment, isCreating } = useDepartmentManagement();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await createDepartment(
        {
          name: formData.name.trim(),
          // Only send description if it's non-empty
          ...(formData.description?.trim()
            ? { description: formData.description.trim() }
            : {}),
        },
        {
          onSuccess: () => {
            setFormData({
              name: "",
              description: "",
            });
            if (onSuccess) onSuccess();
            onClose();
          },
          onError: (error) => {
            setApiError(`Failed to create department: ${error.message}`);
          },
        }
      );
    } catch (err) {
      setApiError(
        `Failed to create department: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Create New Department
          </DialogTitle>
        </DialogHeader>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm mb-4">
            {apiError}
          </div>
        )}

        <div className="py-4">
          <form
            id="department-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <FormGroup>
              <FormField
                label="Department Name"
                htmlFor="name"
                error={errors.name}
                required
              >
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter department name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isCreating}
                  error={!!errors.name}
                />
              </FormField>

              <FormField label="Description" htmlFor="description">
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter department description (optional)"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={3}
                  disabled={isCreating}
                />
              </FormField>
            </FormGroup>
          </form>
        </div>

        <DialogFooter className="flex flex-row justify-end items-center gap-3 mt-4 w-full">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isCreating}
            className="inline-block"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="department-form"
            disabled={isCreating}
            variant="default"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isCreating ? "Creating..." : "Create Department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
