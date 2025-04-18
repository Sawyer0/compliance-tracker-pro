import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, TagIcon, XCircle } from "lucide-react";
import { Tag, TagColor } from "@/components/ui/tag";
import { Input } from "@/components/ui/form-field";

import { Card } from "@/components/ui/card";

const COLOR_OPTIONS: { label: string; value: TagColor }[] = [
  { label: "Blue", value: "blue" },
  { label: "Red", value: "red" },
  { label: "Green", value: "green" },
  { label: "Amber", value: "amber" },
  { label: "Purple", value: "purple" },
];

export interface TagManagerProps {
  existingTags: Array<{ id: string; name: string; color: TagColor }>;
  onCreateTag: (name: string, color: TagColor) => Promise<void>;
  onDeleteTag?: (id: string) => Promise<void>;
  className?: string;
}

export function TagManager({
  existingTags = [],
  onCreateTag,
  onDeleteTag,
  className,
}: TagManagerProps) {
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState<TagColor>("blue");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      setError("Tag name cannot be empty");
      return;
    }

    if (
      existingTags.some(
        (tag) => tag.name.toLowerCase() === newTagName.trim().toLowerCase()
      )
    ) {
      setError("A tag with this name already exists");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await onCreateTag(newTagName.trim(), selectedColor);

      setNewTagName("");
      setSelectedColor("blue");
    } catch (err) {
      setError("Failed to create tag");
      console.error("Error creating tag:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!onDeleteTag) return;

    try {
      await onDeleteTag(id);
    } catch (err) {
      console.error("Error deleting tag:", err);
    }
  };

  return (
    <Card className={className}>
      <div className="p-4">
        <div className="flex items-center mb-4">
          <TagIcon className="mr-2 h-5 w-5 text-neutral-600" />
          <h3 className="text-lg font-medium">Manage Tags</h3>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Input
              placeholder="Enter tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="w-full mb-2"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tag Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((colorOption) => (
                <Tag
                  key={colorOption.value}
                  color={colorOption.value}
                  label={colorOption.label}
                  selected={selectedColor === colorOption.value}
                  onSelect={() => setSelectedColor(colorOption.value)}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleCreateTag}
            disabled={isCreating || !newTagName.trim()}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Tag
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-700">
            Existing Tags
          </h4>

          {existingTags.length === 0 ? (
            <p className="text-sm text-neutral-500">No tags created yet</p>
          ) : (
            <div className="space-y-2">
              {existingTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between bg-neutral-50 rounded p-2"
                >
                  <Tag color={tag.color} label={tag.name} />

                  {onDeleteTag && (
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                      aria-label={`Delete ${tag.name} tag`}
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
