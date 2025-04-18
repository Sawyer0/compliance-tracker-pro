"use client";

import React, { useState } from "react";
import { useDepartments } from "@/lib/hooks/useDepartments";
import { useDepartmentManagement } from "@/lib/hooks/useDepartmentManagement";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Building, Plus, FileCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { CreateDepartmentModal } from "@/components/departments";

export default function DepartmentsPage() {
  const { departments, isLoading, isError, error } = useDepartments();
  const { deleteDepartment, isDeleting } = useDepartmentManagement();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: string, hasChecklists: boolean) => {
    if (hasChecklists) {
      setDeleteError(
        "Cannot delete department that has tasks. Please delete or reassign tasks first."
      );
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this department? This action cannot be undone."
      )
    ) {
      try {
        await deleteDepartment(id);
        setDeleteError(null);
      } catch (err) {
        setDeleteError(
          `Failed to delete department: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      }
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading departments...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">
        Error loading departments: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Departments"
          description="Manage your organization's departments"
        />

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          New Department
        </Button>
      </div>

      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {deleteError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-indigo-600" />
                  {department.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-gray-500">Tasks</span>
                    <span className="font-medium flex items-center">
                      <FileCheck className="h-4 w-4 text-gray-400 mr-1" />
                      {department.totalTasks || 0}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-gray-500">Completion</span>
                    <span className="font-medium">{department.progress}%</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-gray-500">Overdue</span>
                    <span className="font-medium flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                      {department.overdueTasks || 0}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <Link
                    href={`/dashboard/department/${department.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View Tasks
                  </Link>
                  <button
                    onClick={() =>
                      handleDelete(
                        department.id,
                        (department.totalTasks || 0) > 0
                      )
                    }
                    className="text-rose-600 hover:text-rose-800 text-sm font-medium"
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {departments.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No departments yet
            </h3>
            <p className="mt-1 text-gray-500">
              Create your first department to start organizing your compliance
              tasks.
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Department
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateDepartmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
