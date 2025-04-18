"use client";

import React from "react";
import { useTags } from "@/lib/hooks/useTags";

interface TaskTagSelectorProps {
  selectedTagIds: string[];
  setSelectedTagIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TaskTagSelector({
  selectedTagIds,
  setSelectedTagIds,
}: TaskTagSelectorProps) {
  const { tags: availableTags, isLoading: isLoadingTags } = useTags();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tags</label>
      <div className="flex flex-wrap gap-2">
        {isLoadingTags ? (
          <div className="text-sm text-gray-500">Loading tags...</div>
        ) : availableTags.length === 0 ? (
          <div className="text-sm text-gray-500">No tags available</div>
        ) : (
          availableTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedTagIds.includes(tag.id)
                  ? `bg-${tag.color || "blue"}-500 text-white`
                  : `bg-${tag.color || "blue"}-100 text-${
                      tag.color || "blue"
                    }-800`
              }`}
              onClick={() => {
                setSelectedTagIds((prev) =>
                  prev.includes(tag.id)
                    ? prev.filter((id) => id !== tag.id)
                    : [...prev, tag.id]
                );
              }}
            >
              {tag.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
