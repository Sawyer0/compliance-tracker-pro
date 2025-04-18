"use client";

import React from "react";
import { useTags } from "@/lib/hooks/useTags";
import { TagList } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

interface TaskTagSelectorProps {
  selectedTagIds: string[];
  setSelectedTagIds: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}

export default function TaskTagSelector({
  selectedTagIds,
  setSelectedTagIds,
  className,
}: TaskTagSelectorProps) {
  const { tags: availableTags, isLoading: isLoadingTags } = useTags();

  const handleTagSelect = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <label className="font-medium">Tags</label>

      {isLoadingTags ? (
        <div className="text-sm text-gray-500">Loading tags...</div>
      ) : availableTags.length === 0 ? (
        <div className="text-sm text-gray-500">No tags available</div>
      ) : (
        <TagList
          tags={availableTags}
          selectedIds={selectedTagIds}
          onTagSelect={handleTagSelect}
        />
      )}
    </div>
  );
}
