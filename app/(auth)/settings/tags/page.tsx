"use client";

import React from "react";
import { TagManager } from "@/components/compliance/TagManager";
import { useTags } from "@/lib/hooks/useTags";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { TagColor } from "@/components/ui/tag";

export default function TagsSettingsPage() {
  const { tags, createTag, deleteTag, isCreating } = useTags();

  // Wrap mutation functions to return Promises
  const handleCreateTag = (name: string, color: TagColor): Promise<void> => {
    return new Promise((resolve, reject) => {
      createTag(
        { name, color },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        }
      );
    });
  };

  const handleDeleteTag = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      deleteTag(id, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Tag Management"
        description="Create and manage tags for organizing your compliance tasks"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <TagManager
          existingTags={tags || []}
          onCreateTag={handleCreateTag}
          onDeleteTag={handleDeleteTag}
          className="md:col-span-1"
        />

        <Card className="md:col-span-1 p-6">
          <h3 className="text-lg font-medium mb-4">Using Tags</h3>
          <div className="prose max-w-none">
            <p>
              Tags help you organize and filter compliance tasks based on
              different categories.
            </p>

            <h4 className="font-medium mt-4">Benefits of using tags:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Quickly filter tasks by category</li>
              <li>Create a consistent taxonomy for your organization</li>
              <li>Make task management more efficient</li>
              <li>Generate reports based on tag categories</li>
            </ul>

            <h4 className="font-medium mt-4">Best practices:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use consistent naming conventions</li>
              <li>Choose colors that represent the tag's purpose</li>
              <li>Limit the number of tags to avoid clutter</li>
              <li>Review and cleanup unused tags periodically</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
