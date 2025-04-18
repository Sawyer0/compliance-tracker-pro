import React, { useState } from "react";
import { useTags } from "@/lib/hooks/useTags";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const COLORS = [
  { name: "blue", bg: "bg-blue-100", text: "text-blue-800" },
  { name: "red", bg: "bg-red-100", text: "text-red-800" },
  { name: "green", bg: "bg-green-100", text: "text-green-800" },
  { name: "amber", bg: "bg-amber-100", text: "text-amber-800" },
  { name: "purple", bg: "bg-purple-100", text: "text-purple-800" },
];

export default function TagManager() {
  const { tags, createTag, isCreating } = useTags();
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    createTag({
      name: newTagName.trim(),
      color: selectedColor,
    });

    setNewTagName("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Manage Tags</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={`px-3 py-1 rounded-full bg-${
              tag.color || "blue"
            }-100 text-${tag.color || "blue"}-800`}
          >
            {tag.name}
          </div>
        ))}
      </div>

      <div className="flex items-end gap-2">
        <div>
          <label className="text-sm font-medium block mb-1">Tag Name</label>
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="px-3 py-2 border rounded-md"
            placeholder="Enter tag name"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Color</label>
          <div className="flex gap-1">
            {COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                className={`w-6 h-6 rounded-full ${color.bg} ${
                  selectedColor === color.name
                    ? "ring-2 ring-offset-1 ring-gray-500"
                    : ""
                }`}
                onClick={() => setSelectedColor(color.name)}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleCreateTag}
          disabled={isCreating || !newTagName.trim()}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Tag
        </Button>
      </div>
    </div>
  );
}
