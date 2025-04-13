"use client";

import React from "react";
import { useState } from "react";
import { ChecklistItem } from "@/types/checklist";
import { getSupabaseClient } from "@/lib/getSupabaseClient";
import { useChecklistStore } from "@/store/checklistStore";

interface Props {
  item: ChecklistItem;
  onClose: () => void;
}

export default function NoteModal({ item, onClose }: Props) {
  const [note, setNote] = useState(item.notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateItem } = useChecklistStore();

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch("api/supabase-token");
    const { token } = await res.json();
    const supabase = getSupabaseClient(token);

    const { data, error } = await supabase
      .from("checklists")
      .update({ notes: note })
      .eq("id", item.id)
      .select()
      .single();

    if (error) {
      setError("Failed to save note. Please try again.");
    } else if (data) {
      updateItem(data);
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg space-y-4">
        <h2 className="text-lg font-semibold">Add a Note</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <textarea
          className="w-full border border-gray-300 p-2 rounded text-sm"
          placeholder="Add a note explaining context, decisions, or updates..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading || note === item.notes}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
