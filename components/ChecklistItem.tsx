"use client";

import { useState } from "react";
import { ChecklistItem as ItemType } from "@/types/checklist";
import { getSupabaseClient } from "@/lib/getSupabaseClient";
import { useChecklistStore } from "@/store/checklistStore";
// import NoteModal from './NoteModal' // once implemented

interface Props {
  item: ItemType;
}

export default function ChecklistItem({ item }: Props) {
  const [loading, setLoading] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const { updateItem } = useChecklistStore();

  const onStatusChange = async () => {
    setLoading(true);

    const res = await fetch("/api/supabase-token");
    const { token } = await res.json();
    const supabase = getSupabaseClient(token);

    const { data, error } = await supabase
      .from("checklists")
      .update({ completed: !item.completed })
      .eq("id", item.id)
      .select()
      .single();

    if (data) updateItem(data);
    setLoading(false);
  };

  const onNoteClick = () => {
    setShowNoteModal(true);
  };

  return (
    <li className="bg-white p-4 shadow rounded flex justify-between items-start gap-4">
      <div>
        <p className="font-medium">{item.title}</p>
        <p className="text-sm text-gray-500">
          Status: {item.completed ? "Completed" : "Pending"}
        </p>
        {item.notes && <p className="text-sm italic mt-1">{item.notes}</p>}
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={onStatusChange}
          disabled={loading}
          className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
        >
          {item.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>

        <button
          onClick={onNoteClick}
          className="text-sm px-3 py-1 bg-gray-200 rounded"
        >
          Add Note
        </button>
      </div>

      {/* Placeholder for modal */}
      {/* {showNoteModal && <NoteModal item={item} onClose={() => setShowNoteModal(false)} />} */}
    </li>
  );
}
